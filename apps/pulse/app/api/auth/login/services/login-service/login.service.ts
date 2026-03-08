import { AxiosInstance } from 'axios'
import { NextResponse } from 'next/server'

import { type LoginResponse } from '@api/auth'
import type { LoginState } from '@login/state'

import type { AbstractLoginService } from './login.service.abstract'

export class LoginService implements AbstractLoginService {
  readonly body: LoginState
  readonly requestId: string
  readonly httpClient: AxiosInstance

  constructor(body: LoginState, requestId: string, httpClient: AxiosInstance) {
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
