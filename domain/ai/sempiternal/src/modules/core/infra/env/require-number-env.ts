export function requireNumberEnv(name: string): number {
  const raw = process.env[name]
  if (!raw) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  const value = Number(raw)
  if (Number.isNaN(value)) {
    throw new Error(
      `Environment variable ${name} must be a number, got: ${raw}`
    )
  }
  return value
}
