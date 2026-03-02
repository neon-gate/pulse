import type { State, StateUpdater } from '@lib/ui/state'

import type { LoginFormInput } from './form.types'
import type { LoginSchema } from './form.validation'

export interface LoginState extends LoginFormInput, State<LoginSchema> {
  hasInteractedWithEmail: boolean
  hasInteractedWithPassword: boolean
}

export type UpdateLoginState = StateUpdater<LoginState>

export const loginInitialState: LoginState = {
  email: '',
  password: '',
  apiError: null,
  fieldErrors: {},
  isPending: false,
  hasInteractedWithEmail: false,
  hasInteractedWithPassword: false
}
