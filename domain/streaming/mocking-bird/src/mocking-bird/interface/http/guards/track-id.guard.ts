import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common'
import { z } from 'zod'

@Injectable()
export class TrackIdGuard implements CanActivate {
  private readonly schema = z.string().uuid()

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ params?: { trackId?: string } }>()
    const trackId = request.params?.trackId
    const parsed = this.schema.safeParse(trackId)

    if (!parsed.success) {
      throw new BadRequestException('Invalid trackId')
    }

    return true
  }
}
