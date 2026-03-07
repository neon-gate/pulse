import { type LoginResponse, loginInstance } from '@api/auth'

import { HttpErrorName } from '@api/transport/http'
import type { LoginState } from '@login/state'
import { NextResponse } from 'next/server'

export class LoginService {
  private readonly body: LoginState
  private readonly requestId: string

  constructor(body: LoginState, requestId: string) {
    this.body = body
    this.requestId = requestId
  }

  async login(): Promise<NextResponse> | never {
    if (!process.env.BFF_BASE_URL || !process.env.BFF_API_TIMEOUT_MS) {
      throw new Error(HttpErrorName.UnprocessableEntity)
    }

    const { data } = await loginInstance.post<LoginResponse>(
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
