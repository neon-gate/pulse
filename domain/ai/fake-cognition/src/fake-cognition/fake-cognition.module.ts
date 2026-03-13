import { Module } from '@nestjs/common'

import { HealthController } from './health/health.controller'
import { FakeCognitionService } from './nats/fake-cognition.service'

@Module({
  controllers: [HealthController],
  providers: [FakeCognitionService]
})
export class FakeCognitionModule {}
