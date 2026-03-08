import { AxiosInstance } from 'axios'
import type { NextResponse } from 'next/server'

import type { LoginState } from '@login/state'

// TODO: Make AxiosInstance a generic type
export abstract class AbstractLoginService {
  readonly body: LoginState
  readonly requestId: string
  readonly httpClient: AxiosInstance

  constructor(
    body: LoginState,
    requestId: string,
    httpClient: AxiosInstance,
  ) {
    this.body = body
    this.requestId = requestId
    this.httpClient = httpClient
  }

  abstract login(): Promise<NextResponse>
}