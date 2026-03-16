export function optionalStringEnvCompute(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue
}

export function optionalNumberEnvCompute(name: string, defaultValue: number): number {
  const value = process.env[name]
  if (!value) return defaultValue

  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number`)
  }
  return parsed
}
