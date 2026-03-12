import { Injectable } from '@nestjs/common'

import { UseCase } from '@repo/kernel'

import { SegmentStorePort } from '@domain/ports'

@Injectable()
export class GetPlaylistUseCase extends UseCase<
  [trackId: string],
  { data: Buffer; contentType: string }
> {
  constructor(private readonly segments: SegmentStorePort) {
    super()
  }

  async execute(trackId: string) {
    return this.segments.getPlaylist(trackId)
  }
}
