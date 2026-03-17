import type { Provider } from '@nestjs/common'

import { AudioStoragePort } from './audio-storage.port'
import { MinioAudioStorageAdapter } from './minio-audio-storage.adapter'

/// Binds AudioStoragePort to the MinIO-backed S3 adapter.
export const minioProvider: Provider = {
  provide: AudioStoragePort,
  useClass: MinioAudioStorageAdapter
}
