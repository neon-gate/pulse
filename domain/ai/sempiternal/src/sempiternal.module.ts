import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'
import { FingerprintModule } from './modules/fingerprint/fingerprint.module'
import { TranscriptionModule } from './modules/transcription/transcription.module'
import { ReasoningModule } from './modules/reasoning/reasoning.module'
import { HealthController } from './interface/http/health.controller'

@Module({
  imports: [
    CoreModule,
    FingerprintModule,
    TranscriptionModule,
    ReasoningModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
