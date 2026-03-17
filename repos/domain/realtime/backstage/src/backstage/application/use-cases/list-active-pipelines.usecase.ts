import { Injectable } from '@nestjs/common'
import { UseCase } from '@repo/kernel'

import { TrackPipeline } from '@domain/entities'
import { PipelineRepositoryPort } from '@domain/repositories'

@Injectable()
export class ListActivePipelinesUseCase extends UseCase<
  [],
  TrackPipeline[]
> {
  constructor(private readonly repository: PipelineRepositoryPort) {
    super()
  }

  async execute(): Promise<TrackPipeline[]> {
    return this.repository.findActive()
  }
}
