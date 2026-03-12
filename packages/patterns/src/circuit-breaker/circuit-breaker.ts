import { CircuitBreakerState } from './circuit-breaker-state.enum'
import {
  CircuitBreakerConfig,
  CircuitBreakerOptions,
  CircuitBreakerStats
} from './circuit-breaker.types'
import { CircuitBreakerOpenError } from './circuit-breaker-open.error'
import { DEFAULT_OPTIONS } from './circuit-breaker.data'

export class CircuitBreaker {
  private state = CircuitBreakerState.Closed
  private nextAttempt = 0
  private stats: CircuitBreakerStats = {
    failures: 0,
    successes: 0,
    consecutiveFailures: 0,
    consecutiveSuccesses: 0
  }
  private readonly config: CircuitBreakerConfig

  constructor(options: CircuitBreakerOptions) {
    const timeoutMs = options.timeoutMs ?? DEFAULT_OPTIONS.timeoutMs
    const resetTimeoutMs =
      options.resetTimeoutMs ?? DEFAULT_OPTIONS.resetTimeoutMs
    const successThreshold =
      options.successThreshold ?? DEFAULT_OPTIONS.successThreshold

    if (
      !Number.isInteger(options.failureThreshold) ||
      options.failureThreshold < 1
    ) {
      throw new Error('Circuit breaker failureThreshold must be >= 1')
    }

    if (!Number.isInteger(successThreshold) || successThreshold < 1) {
      throw new Error('Circuit breaker successThreshold must be >= 1')
    }

    if (!Number.isInteger(timeoutMs) || timeoutMs < 1) {
      throw new Error('Circuit breaker timeoutMs must be >= 1')
    }

    if (!Number.isInteger(resetTimeoutMs) || resetTimeoutMs < 1) {
      throw new Error('Circuit breaker resetTimeoutMs must be >= 1')
    }

    this.config = {
      ...DEFAULT_OPTIONS,
      ...options,
      timeoutMs,
      resetTimeoutMs,
      successThreshold
    }
  }

  async execute<T>(
    operation: Operation<T>,
    fallback?: CircuitBreakerFallback<T>
  ): Promise<T> {
    if (this.state === CircuitBreakerState.Open) {
      if (Date.now() < this.nextAttempt) {
        if (fallback) {
          return await fallback()
        }
        throw new CircuitBreakerOpenError(this.nextAttempt - Date.now())
      }
      this.transitionTo(CircuitBreakerState.HalfOpen)
    }

    try {
      const result = await this.executeWithTimeout(operation)
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure(error)
      if (fallback) {
        return await fallback()
      }
      throw error
    }
  }

  private async executeWithTimeout<T>(operation: Operation<T>): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new Error('Operation timeout')),
          this.config.timeoutMs
        )
      )
    ])
  }

  private onSuccess(): void {
    this.stats.successes += 1
    this.stats.consecutiveSuccesses += 1
    this.stats.consecutiveFailures = 0

    if (this.state === CircuitBreakerState.HalfOpen) {
      if (this.stats.consecutiveSuccesses >= this.config.successThreshold) {
        this.resetStats()
        this.transitionTo(CircuitBreakerState.Closed)
      }
    }
  }

  private onFailure(_error: unknown): void {
    this.stats.failures += 1
    this.stats.consecutiveFailures += 1
    this.stats.consecutiveSuccesses = 0
    this.stats.lastFailureTime = Date.now()

    if (this.state === CircuitBreakerState.HalfOpen) {
      this.trip()
      return
    }

    if (this.stats.consecutiveFailures >= this.config.failureThreshold) {
      this.trip()
    }
  }

  private trip(): void {
    this.nextAttempt = Date.now() + this.config.resetTimeoutMs
    this.transitionTo(CircuitBreakerState.Open)
  }

  private transitionTo(nextState: CircuitBreakerState): void {
    if (this.state === nextState) return

    const previousState = this.state
    this.state = nextState
    this.config.onStateChange?.({ previous: previousState, next: nextState })
  }

  private resetStats(): void {
    this.stats = {
      failures: 0,
      successes: 0,
      consecutiveFailures: 0,
      consecutiveSuccesses: 0
    }
  }

  getState(): CircuitBreakerState {
    return this.state
  }

  getStats(): CircuitBreakerStats {
    return { ...this.stats }
  }

  reset(): void {
    this.resetStats()
    this.transitionTo(CircuitBreakerState.Closed)
  }
}
