import { Injectable } from '@nestjs/common'

import { SegmentStorePort } from '@domain/ports'

// TODO: must implement abstract class for use cases
@Injectable()
export class GetSegmentUseCase {
  constructor(private readonly segments: SegmentStorePort) {}

  async execute(trackId: string, segment: string) {
    return this.segments.getSegment(trackId, segment)
  }
}
