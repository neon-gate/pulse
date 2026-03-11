import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import {
  GetPlaylistUseCase,
  GetSegmentUseCase,
  StartPlaybackUseCase
} from '@application/use-cases'
import { SegmentStorePort, TranscoderPort } from '@domain/ports'
import { FortMinorController, SegmentGuard, TrackIdGuard } from '@interface/http'
import { FileSystemSegmentAdapter } from '@infra/segments/file-system-segment.adapter'
import { FfmpegTranscoderAdapter } from '@infra/transcoder/ffmpeg-transcoder.adapter'
import {
  fortMinorEventBusProvider,
  natsConnectionProvider,
  NatsLifecycleService
} from '@infra/event-bus'

@Module({
  imports: [ConfigModule],
  controllers: [FortMinorController],
  providers: [
    StartPlaybackUseCase,
    GetPlaylistUseCase,
    GetSegmentUseCase,
    TrackIdGuard,
    SegmentGuard,
    natsConnectionProvider,
    fortMinorEventBusProvider,
    NatsLifecycleService,
    {
      provide: SegmentStorePort,
      useClass: FileSystemSegmentAdapter
    },
    {
      provide: TranscoderPort,
      useClass: FfmpegTranscoderAdapter
    }
  ]
})
export class FortMinorModule {}
