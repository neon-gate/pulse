import type { LoginState } from '@login/state'

export type LoginBody = LoginState

export interface LoginResponse {
  message: string
}
