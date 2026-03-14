import { Module } from '@nestjs/common'

import { FingerprintModule } from './fingerprint/fingerprint.module'

@Module({
  imports: [FingerprintModule]
})
export class AppModule {}
