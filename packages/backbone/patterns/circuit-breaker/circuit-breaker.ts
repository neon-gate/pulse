import { CircuitBreakerOpenError } from './circuit-breaker-open.error'

export enum CircuitBreakerState {
  Closed = 'CLOSED',
  Open = 'OPEN',
  HalfOpen = 'HALF_OPEN'
}

type OnStateChangeParams = {
  previous: CircuitBreakerState
  next: CircuitBreakerState
}

export type CircuitBreakerParams = {
  failureThreshold: number
  cooldownMs: number
  onStateChange?: (params: OnStateChangeParams) => void
}

export class CircuitBreaker {
  private state = CircuitBreakerState.Closed
  private consecutiveFailures = 0
  private openedAtMs = 0

  constructor(private readonly params: CircuitBreakerParams) {
    if (
      !Number.isInteger(params.failureThreshold) ||
      params.failureThreshold < 1
    ) {
      throw new Error(
        'Circuit breaker failureThreshold must be an integer >= 1'
      )
    }

    if (params.cooldownMs < 1) {
      throw new Error('Circuit breaker cooldownMs must be >= 1')
    }
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const currentState = this.getState()
    if (currentState === CircuitBreakerState.Open) {
      throw new CircuitBreakerOpenError(this.msUntilHalfOpen())
    }

    try {
      const result = await fn()
      this.onSuccess(currentState)
      return result
    } catch (error) {
      this.onFailure(currentState)
      throw error
    }
  }

  getState(): CircuitBreakerState {
    if (
      this.state === CircuitBreakerState.Open &&
      Date.now() - this.openedAtMs >= this.params.cooldownMs
    ) {
      this.transitionTo(CircuitBreakerState.HalfOpen)
    }

    return this.state
  }

  private onSuccess(currentState: CircuitBreakerState): void {
    this.consecutiveFailures = 0
    if (currentState === CircuitBreakerState.HalfOpen) {
      this.transitionTo(CircuitBreakerState.Closed)
    }
  }

  private onFailure(currentState: CircuitBreakerState): void {
    if (currentState === CircuitBreakerState.HalfOpen) {
      this.openCircuit()
      return
    }

    this.consecutiveFailures += 1
    if (this.consecutiveFailures >= this.params.failureThreshold) {
      this.openCircuit()
    }
  }

  private openCircuit(): void {
    this.consecutiveFailures = 0
    this.openedAtMs = Date.now()
    this.transitionTo(CircuitBreakerState.Open)
  }

  private msUntilHalfOpen(): number {
    const elapsedMs = Date.now() - this.openedAtMs
    return Math.max(this.params.cooldownMs - elapsedMs, 0)
  }

  private transitionTo(nextState: CircuitBreakerState): void {
    if (this.state === nextState) {
      return
    }

    const previous = this.state
    this.state = nextState
    this.params.onStateChange?.({ previous, next: nextState })
  }
}
