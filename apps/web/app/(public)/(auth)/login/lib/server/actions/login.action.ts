'use server'

import { client } from '@api/auth/login/client'
import { LoginBody, LoginResponse } from '@api/auth/login/types'

export type LoginAction = typeof loginAction

export async function loginAction(body: LoginBody): Promise<LoginResponse> {
  const { data } = await client.post<LoginResponse>('/auth/login', body, {
    headers: {
      'x-request-id': crypto.randomUUID(),
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })

  return data
}
