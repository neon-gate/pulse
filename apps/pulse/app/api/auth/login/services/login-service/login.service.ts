import { NextResponse } from 'next/server'

import { type LoginResponse } from '@api/auth'
import type { LoginState } from '@login/state'

import type { LoginHttpClient } from './http.client'
import type { AbstractLoginService } from './login.service.abstract'

export class LoginService implements AbstractLoginService {
  readonly body: LoginState
  readonly requestId: string
  readonly httpClient: LoginHttpClient

  constructor(body: LoginState, requestId: string, httpClient: LoginHttpClient) {
    this.body = body
    this.requestId = requestId
    this.httpClient = httpClient
  }

  async login(): Promise<NextResponse> | never {
    const { data } = await this.httpClient.post<LoginResponse>(
      '/login',
      this.body,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'x-request-id': this.requestId
        }
      }
    )

    return NextResponse.json(data, {
      headers: { 'x-request-id': this.requestId }
    })
  }
}
