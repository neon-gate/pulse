import { Module } from '@nestjs/common'

import { HealthController } from '@interface/health.controller'
import { FakeCognitionService } from '@infra/fake-cognition.service'

@Module({
  controllers: [HealthController],
  providers: [FakeCognitionService]
})
export class FakeCognitionModule {}
