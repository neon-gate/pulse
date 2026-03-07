'use server'

import { instance, LoginResponse } from '@api/auth/login'
import { LoginState } from '@login/state'

export type LoginAction = typeof loginAction

export async function loginAction(body: LoginState): Promise<LoginResponse> {
  const { data } = await instance.post<LoginResponse>('/auth/login', body, {
    headers: {
      'x-request-id': crypto.randomUUID(),
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })

  return data
}
