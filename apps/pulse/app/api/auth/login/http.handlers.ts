import { normalizeRouteError } from '@api/transport/http'
import type { LoginState } from '@login/state'
import { NextResponse } from 'next/server'
import { login } from './login.compute'

export async function handleLoginRequest(
  body: LoginState,
  requestId: string
): Promise<NextResponse> {
  try {
    const data = await login(body, requestId)
    return NextResponse.json(data, {
      headers: { 'x-request-id': requestId }
    })
  } catch (error) {
    return normalizeRouteError(error, requestId)
  }
}
