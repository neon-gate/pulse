import { Module } from '@nestjs/common'

import { AudioStoragePort } from './audio-storage.port'
import { minioProvider } from './minio.provider'

/// Provides and exports the MinIO audio storage adapter.
@Module({
  providers: [minioProvider],
  exports: [AudioStoragePort]
})
export class MinioModule {}
