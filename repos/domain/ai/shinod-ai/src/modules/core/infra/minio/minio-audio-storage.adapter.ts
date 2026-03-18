import { Injectable } from '@nestjs/common'
import {
  S3Client,
  GetObjectCommand,
  type S3ClientConfig
} from '@aws-sdk/client-s3'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'
import type { Readable } from 'node:stream'

import { optionalStringEnv } from '@env/lib'
import { AudioStoragePort, type DownloadedAudio } from './audio-storage.port'

function buildS3Client(): S3Client {
  const endpoint = optionalStringEnv('STORAGE_ENDPOINT', 'http://localhost:9000')
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

/// Downloads audio from MinIO / S3-compatible object storage to a temp file.
@Injectable()
export class MinioAudioStorageAdapter extends AudioStoragePort {
  private readonly client = buildS3Client()

  async download(bucket: string, key: string): Promise<DownloadedAudio> {
    const response = await this.client.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    )

    const fileName = path.basename(key)
    const tmpDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), 'audio-')
    )
    const filePath = path.join(tmpDir, fileName)

    const stream = response.Body as Readable
    await new Promise<void>((resolve, reject) => {
      const writer = fs.createWriteStream(filePath)
      stream.pipe(writer)
      writer.on('finish', resolve)
      writer.on('error', reject)
    })

    return {
      filePath,
      cleanup: async () => {
        await fs.promises.rm(tmpDir, { recursive: true, force: true })
      }
    }
  }
}
