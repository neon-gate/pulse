import { requireStringEnvCompute } from './require-string-env'

export function requireNumberEnvCompute(name: string): number {
  const value = requireStringEnvCompute(name)
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number`)
  }

  return parsed
}
