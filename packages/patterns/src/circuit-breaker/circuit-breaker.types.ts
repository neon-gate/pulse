import { CircuitBreakerState } from './circuit-breaker-state.enum'

export interface CircuitBreakerOptions {
  failureThreshold: number
  timeoutMs?: number
  resetTimeoutMs?: number
  successThreshold?: number
  onStateChange?: (params: {
    previous: CircuitBreakerState
    next: CircuitBreakerState
  }) => void
}

export interface CircuitBreakerConfig extends CircuitBreakerOptions {
  timeoutMs: number
  resetTimeoutMs: number
  successThreshold: number
}

export interface CircuitBreakerStats {
  failures: number
  successes: number
  consecutiveFailures: number
  consecutiveSuccesses: number
  lastFailureTime?: number
}


