import { LoginState } from "@login/state"
import { loginSchema } from "@login/ui"

export function isLoginBodyValid(body: unknown): LoginState | never {
  const parsed = loginSchema.parse(body)

  return parsed as LoginState
}