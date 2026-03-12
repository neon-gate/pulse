import { CircuitBreaker, type CircuitBreakerParams } from '@repo/patterns'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

import type { LoginHttpClient } from './http.client'

const DEFAULT_BREAKER_OPTIONS: CircuitBreakerParams = {
  failureThreshold: 3,
  cooldownMs: 30_000,
  successThreshold: 1
}

export class CircuitBreakerHttpAdapter implements LoginHttpClient {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly breaker: CircuitBreaker
  ) {}

  post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<{ data: T }> {
    return this.breaker.execute(() =>
      this.httpClient.post<T>(url, data, config)
    )
  }
}

export function createCircuitBreakerHttpClient(
  httpClient: AxiosInstance,
  options: Partial<CircuitBreakerParams> = {}
): CircuitBreakerHttpAdapter {
  const breaker = new CircuitBreaker({
    ...DEFAULT_BREAKER_OPTIONS,
    ...options
  })

  return new CircuitBreakerHttpAdapter(httpClient, breaker)
}
