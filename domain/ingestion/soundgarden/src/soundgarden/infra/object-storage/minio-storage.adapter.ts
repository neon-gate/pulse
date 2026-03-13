import { Injectable } from '@nestjs/common'
import {
  S3Client,
  PutObjectCommand,
  type S3ClientConfig
} from '@aws-sdk/client-s3'

import {
  ObjectStoragePort,
  type StorageRef
} from '@domain/ports/object-storage.port'
import { optionalStringEnv } from '@infra/env'

function buildS3Client(): S3Client | null {
  const endpoint = process.env.STORAGE_ENDPOINT
  if (!endpoint) return null

  const region = optionalStringEnv('STORAGE_REGION', 'us-east-1')
  const accessKeyId = optionalStringEnv('STORAGE_ACCESS_KEY', 'minioadmin')
  const secretAccessKey = optionalStringEnv('STORAGE_SECRET_KEY', 'minioadmin')

  const config: S3ClientConfig = {
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
    endpoint
  }

  return new S3Client(config)
}

@Injectable()
export class MinioStorageAdapter extends ObjectStoragePort {
  private readonly client = buildS3Client()

  async upload(
    bucket: string,
    key: string,
    buffer: Buffer,
    contentType: string
  ): Promise<StorageRef> {
    if (!this.client) {
      throw new Error('Object storage is not configured (STORAGE_ENDPOINT missing)')
    }

    await this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ContentLength: buffer.length
      })
    )

    return { bucket, key }
  }
}
