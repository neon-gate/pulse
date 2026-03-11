import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common'
import { z } from 'zod'

@Injectable()
export class SegmentGuard implements CanActivate {
  private readonly schema = z
    .string()
    .regex(/^segment_\d{3}\.ts$/)

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ params?: { segment?: string } }>()
    const segment = request.params?.segment
    const parsed = this.schema.safeParse(segment)

    if (!parsed.success) {
      throw new BadRequestException('Invalid segment name')
    }

    return true
  }
}
