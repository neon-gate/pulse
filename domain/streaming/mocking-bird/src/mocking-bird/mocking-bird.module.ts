import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import {
  GetPlaylistUseCase,
  GetSegmentUseCase,
  StartPlaybackUseCase
} from '@application/use-cases'
import { SegmentStorePort, TranscoderPort } from '@domain/ports'
import {
  MockingbirdController,
  SegmentGuard,
  TrackIdGuard
} from '@interface/http'
import { mockingbirdEventBusProvider } from '@infra/event-bus'
import { NatsLifecycleService } from '@infra/event-bus'
import { natsConnectionProvider } from '@infra/event-bus'
import { FileSystemSegmentAdapter } from '@infra/segments/file-system-segment.adapter'
import { FfmpegTranscoderAdapter } from '@infra/transcoder/ffmpeg-transcoder.adapter'

@Module({
  imports: [ConfigModule],
  controllers: [MockingbirdController],
  providers: [
    StartPlaybackUseCase,
    GetPlaylistUseCase,
    GetSegmentUseCase,
    TrackIdGuard,
    SegmentGuard,
    natsConnectionProvider,
    mockingbirdEventBusProvider,
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
export class MockingbirdModule {}
