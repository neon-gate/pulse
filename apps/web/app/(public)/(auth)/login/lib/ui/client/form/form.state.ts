import type { State, StateUpdater } from '@lib/ui/state'
import { LoginState, loginState } from '@login/state'
import type { LoginFormSchema } from '@login/ui/client/form'

export interface LoginFormState extends LoginState, State<LoginFormSchema> {
  hasInteractedWithEmail: boolean
  hasInteractedWithPassword: boolean
}

export type UpdateLoginFormState = StateUpdater<LoginFormState>

export const loginFormState: LoginFormState & LoginState = {
  ...loginState,
  apiError: null,
  fieldErrors: {},
  isPending: false,
  hasInteractedWithEmail: false,
  hasInteractedWithPassword: false
}
