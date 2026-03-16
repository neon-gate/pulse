import { Injectable } from '@nestjs/common'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import * as fs from 'fs'
import * as path from 'path'
import { createWriteStream } from 'fs'

import { StoragePort } from '@domain/ports'
import { optionalStringEnvCompute } from '@repo/environment'

@Injectable()
export class MinioStorageAdapter implements StoragePort {
  private readonly client: S3Client | null
  private readonly uploadsBucket: string
  private readonly transcodedBucket: string

  constructor() {
    const endpoint = process.env.STORAGE_ENDPOINT

    if (!endpoint) {
      this.client = null
      this.uploadsBucket = ''
      this.transcodedBucket = ''
      return
    }

    this.client = new S3Client({
      region: optionalStringEnvCompute('STORAGE_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: optionalStringEnvCompute('STORAGE_ACCESS_KEY', 'minioadmin'),
        secretAccessKey: optionalStringEnvCompute('STORAGE_SECRET_KEY', 'minioadmin')
      },
      forcePathStyle: true,
      endpoint
    })

    this.uploadsBucket = optionalStringEnvCompute('STORAGE_UPLOADS_BUCKET', 'uploads')
    this.transcodedBucket = optionalStringEnvCompute(
      'STORAGE_TRANSCODED_BUCKET',
      'transcoded'
    )
  }

  async download(objectKey: string): Promise<string> {
    if (!this.client) {
      throw new Error('Storage not configured: STORAGE_ENDPOINT is required')
    }

    const localPath = path.join(
      '/tmp',
      `mockingbird-${Date.now()}-${path.basename(objectKey)}`
    )

    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.uploadsBucket,
        Key: this.normalizeKey(objectKey, this.uploadsBucket)
      })
    )

    if (!response.Body) {
      throw new Error(`Empty response for object ${objectKey}`)
    }

    const stream = response.Body as NodeJS.ReadableStream
    const writeStream = createWriteStream(localPath)

    await new Promise<void>((resolve, reject) => {
      stream.pipe(writeStream).on('finish', resolve).on('error', reject)
    })

    return localPath
  }

  async upload(objectKey: string, filePath: string): Promise<void> {
    if (!this.client) {
      throw new Error('Storage not configured: STORAGE_ENDPOINT is required')
    }

    const body = fs.readFileSync(filePath)
    const key = this.normalizeKey(objectKey, this.transcodedBucket)

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.transcodedBucket,
        Key: key,
        Body: body,
        ContentType: 'audio/mpeg'
      })
    )

    fs.unlinkSync(filePath)
  }

  /** Strip bucket prefix from key if present (e.g. "uploads/x/y" -> "x/y") */
  private normalizeKey(objectKey: string, forBucket: string): string {
    const prefix = `${forBucket}/`
    if (objectKey.startsWith(prefix)) {
      return objectKey.slice(prefix.length)
    }
    return objectKey
  }
}
