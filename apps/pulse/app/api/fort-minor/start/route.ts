import { NextResponse } from 'next/server'

import { ErrorFactoryService, ErrorService } from '@api/transport/http'
import { HTTP_ERROR_MAP } from '@api/transport/http'
import { StartResponse } from './start.types'

type MinorStartResponse = Promise<NextResponse>

export async function POST(request: Request): MinorStartResponse {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID()

  try {
    const body = await request.json()

    // const playback = await startPlayback(body.songId);
    const playback = {
      streamUrl: '/stream/stream_abc/master.m3u8',
      track: {
        id: '1',
        name: 'Test Song',
        description: 'Test Description',
        durationMs: 1000
      }
    }

    return NextResponse.json(playback)
  } catch (error) {
    const errorFactory = new ErrorFactoryService(HTTP_ERROR_MAP)
    const errorService = new ErrorService(errorFactory)

    return errorService.normalizeRouteError(error, requestId)
  }
}
