import { Injectable } from '@nestjs/common'

import { UseCase } from '@repo/kernel'

import { SegmentStorePort } from '@domain/ports'

export interface GetSegmentResult {
  data: Buffer
  contentType: string
}

@Injectable()
export class GetSegmentUseCase extends UseCase<
  [trackId: string, segment: string],
  GetSegmentResult
> {
  constructor(private readonly segments: SegmentStorePort) {
    super()
  }

  async execute(trackId: string, segment: string): Promise<GetSegmentResult> {
    return this.segments.getSegment(trackId, segment)
  }
}
