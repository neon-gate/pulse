import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
  UseGuards
} from '@nestjs/common'

import {
  GetPlaylistUseCase,
  GetSegmentUseCase,
  StartPlaybackUseCase
} from '@application/use-cases'
import type { StartRequestDto, StartResponseDto } from '@interface/dto'
import { StartBodyPipe } from '@interface/http/pipes/start-body.pipe'
import { SegmentGuard } from '@interface/http/guards/segment.guard'
import { TrackIdGuard } from '@interface/http/guards/track-id.guard'

@Controller('mocking-bird')
export class MockingbirdController {
  constructor(
    private readonly startPlayback: StartPlaybackUseCase,
    private readonly playlists: GetPlaylistUseCase,
    private readonly segments: GetSegmentUseCase
  ) {}

  @Post('start')
  async start(
    @Body(StartBodyPipe) body: StartRequestDto
  ): Promise<StartResponseDto> {
    return this.startPlayback.execute(body.trackId)
  }

  @UseGuards(TrackIdGuard)
  @Get(':trackId/playlist')
  async playlist(@Param('trackId') trackId: string) {
    const playlist = await this.playlists.execute(trackId)
    return new StreamableFile(playlist.data, {
      type: playlist.contentType
    })
  }

  @UseGuards(TrackIdGuard, SegmentGuard)
  @Get(':trackId/segment/:segment')
  async segment(
    @Param('trackId') trackId: string,
    @Param('segment') segment: string
  ) {
    return this.renderSegment(trackId, segment)
  }

  @UseGuards(TrackIdGuard, SegmentGuard)
  @Get(':trackId/:segment')
  async segmentDirect(
    @Param('trackId') trackId: string,
    @Param('segment') segment: string
  ) {
    return this.renderSegment(trackId, segment)
  }

  private async renderSegment(trackId: string, segment: string) {
    const chunk = await this.segments.execute(trackId, segment)
    return new StreamableFile(chunk.data, {
      type: chunk.contentType
    })
  }
}
