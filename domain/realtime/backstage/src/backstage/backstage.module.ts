import { Module } from '@nestjs/common'

import { TrackGateway } from '@interface/track.gateway'
import { HealthController } from '@interface/health.controller'
import { NatsSubscriberService } from '@infra/nats-subscriber.service'

@Module({
  controllers: [HealthController],
  providers: [TrackGateway, NatsSubscriberService]
})
export class BackstageModule {}
