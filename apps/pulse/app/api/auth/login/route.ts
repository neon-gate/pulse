import { normalizeRouteError } from '@api/transport/http'
import type { LoginState } from '@login/state'
import { NextResponse } from 'next/server'
import { handleLoginRequest } from './http.handlers'

function getRequestId(request: Request): string {
  return request.headers.get('x-request-id') ?? crypto.randomUUID()
}

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = getRequestId(request)

  try {
    const body = (await request.json()) as LoginState

    return await handleLoginRequest(body, requestId)
  } catch (error) {
    return normalizeRouteError(error, requestId)
  }
}
