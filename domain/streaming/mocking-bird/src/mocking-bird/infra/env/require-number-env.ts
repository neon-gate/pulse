export function requireNumberEnv(name: string): number {
  const raw = process.env[name]
  const value = Number(raw)

  if (!raw || Number.isNaN(value)) {
    throw new Error(`Missing or invalid environment variable: ${name}`)
  }

  return value
}
