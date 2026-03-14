export function optionalStringEnv(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue
}
