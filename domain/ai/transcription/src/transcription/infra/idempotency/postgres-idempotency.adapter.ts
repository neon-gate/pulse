import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IdempotencyPort } from '@domain/ports'
import { ProcessedEventEntity } from './processed-event.entity'

@Injectable()
export class PostgresIdempotencyAdapter extends IdempotencyPort {
  constructor(
    @InjectRepository(ProcessedEventEntity)
    private readonly repo: Repository<ProcessedEventEntity>
  ) { super() }

  async hasProcessed(eventId: string): Promise<boolean> {
    return (await this.repo.countBy({ eventId })) > 0
  }

  async markProcessed(eventId: string): Promise<void> {
    await this.repo.save({ eventId })
  }
}
