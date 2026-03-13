import { Module } from '@nestjs/common'

import { TrackGateway } from './events/track.gateway'
import { HealthController } from './health/health.controller'
import { NatsSubscriberService } from './nats/nats-subscriber.service'

@Module({
  controllers: [HealthController],
  providers: [TrackGateway, NatsSubscriberService]
})
export class BackstageModule {}
