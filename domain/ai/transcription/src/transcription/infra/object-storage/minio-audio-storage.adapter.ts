import { Injectable } from '@nestjs/common'
import { S3Client, GetObjectCommand, type S3ClientConfig } from '@aws-sdk/client-s3'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'
import type { Readable } from 'node:stream'
import { AudioStoragePort, type DownloadedAudio } from '@domain/ports'
import { optionalStringEnv } from '@infra/env'

@Injectable()
export class MinioAudioStorageAdapter extends AudioStoragePort {
  private readonly client = new S3Client({
    region: optionalStringEnv('STORAGE_REGION', 'us-east-1'),
    credentials: {
      accessKeyId: optionalStringEnv('STORAGE_ACCESS_KEY', 'minioadmin'),
      secretAccessKey: optionalStringEnv('STORAGE_SECRET_KEY', 'minioadmin')
    },
    forcePathStyle: true,
    endpoint: optionalStringEnv('STORAGE_ENDPOINT', 'http://localhost:9000')
  } as S3ClientConfig)

  async download(bucket: string, key: string): Promise<DownloadedAudio> {
    const response = await this.client.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'transcription-'))
    const filePath = path.join(tmpDir, path.basename(key))
    const stream = response.Body as Readable
    await new Promise<void>((resolve, reject) => {
      const writer = fs.createWriteStream(filePath)
      stream.pipe(writer)
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
    return { filePath, cleanup: async () => fs.promises.rm(tmpDir, { recursive: true, force: true }) }
  }
}
