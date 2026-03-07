import { createHttpError, HttpErrorName } from '@api/transport/http'
import type { LoginState } from '@login/state'
import { instance } from './login.instance'
import type { LoginResponse } from './login-response.type'

export async function login(
  body: LoginState,
  requestId: string
): Promise<LoginResponse> {
  if (!process.env.BFF_BASE_URL) {
    throw createHttpError(HttpErrorName.ServiceUnavailable)
  }

  const { data } = await instance.post<LoginResponse>('/login', body, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-request-id': requestId
    }
  })

  return data
}
