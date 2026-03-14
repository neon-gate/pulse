import { Injectable } from '@nestjs/common'
import {
  S3Client,
  PutObjectCommand,
  type S3ClientConfig
} from '@aws-sdk/client-s3'

import {
  ObjectStoragePort,
  type StorageRef,
  type UploadedStorageRefs
} from '@domain/ports/object-storage.port'
import { optionalStringEnv } from '@infra/env'

interface StorageTarget {
  bucket: string
  client: S3Client | null
}

function buildS3Client(prefix: string): S3Client | null {
  const endpoint = process.env[`${prefix}ENDPOINT`]
  if (!endpoint) return null

  const region = optionalStringEnv(`${prefix}REGION`, 'us-east-1')
  const accessKeyId = optionalStringEnv(`${prefix}ACCESS_KEY`, 'minioadmin')
  const secretAccessKey = optionalStringEnv(
    `${prefix}SECRET_KEY`,
    'minioadmin'
  )

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
  private readonly soundgardenClient = buildS3Client('STORAGE_')
  private readonly fingerprintClient = buildS3Client('FINGERPRINT_STORAGE_')
  private readonly transcriptionClient = buildS3Client('TRANSCRIPTION_STORAGE_')

  async upload(
    trackId: string,
    fileName: string,
    soundgardenBucket: string,
    buffer: Buffer,
    contentType: string
  ): Promise<UploadedStorageRefs> {
    const key = `uploads/${trackId}/${fileName}`
    const refs: UploadedStorageRefs = {}

    const targets: Array<[keyof UploadedStorageRefs, StorageTarget]> = [
      [
        'soundgarden',
        { bucket: soundgardenBucket, client: this.soundgardenClient }
      ],
      [
        'fingerprint',
        {
          bucket: optionalStringEnv('FINGERPRINT_STORAGE_BUCKET', 'tracks'),
          client: this.fingerprintClient
        }
      ],
      [
        'transcription',
        {
          bucket: optionalStringEnv('TRANSCRIPTION_STORAGE_BUCKET', 'tracks'),
          client: this.transcriptionClient
        }
      ]
    ]

    for (const [name, target] of targets) {
      if (!target.client) continue

      await this.uploadToTarget(
        target.client,
        target.bucket,
        key,
        buffer,
        contentType
      )

      refs[name] = { bucket: target.bucket, key }
    }

    return refs
  }

  private async uploadToTarget(
    client: S3Client,
    bucket: string,
    key: string,
    buffer: Buffer,
    contentType: string
  ): Promise<StorageRef> {
    await client.send(
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
