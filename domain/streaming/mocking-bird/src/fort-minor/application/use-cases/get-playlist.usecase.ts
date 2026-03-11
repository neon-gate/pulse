import { Injectable } from '@nestjs/common'

import { SegmentStorePort } from '@domain/ports'

// TODO: must implement abstract class for use cases
@Injectable()
export class GetPlaylistUseCase {
  constructor(private readonly segments: SegmentStorePort) {}

  async execute(trackId: string) {
    return this.segments.getPlaylist(trackId)
  }
}
