export class CircuitBreakerOpenError extends Error {
  constructor(readonly retryAfterMs: number) {
    super('Circuit breaker is open')
    this.name = 'CircuitBreakerOpenError'
  }
}
