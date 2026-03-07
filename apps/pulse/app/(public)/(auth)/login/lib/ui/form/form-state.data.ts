import { LoginState, loginStateData } from '@login/state'
import { LoginFormState } from './form-state.type'

export const loginFormState: LoginFormState & LoginState = {
  ...loginStateData,
  apiError: null,
  fieldErrors: {},
  isPending: false,
  hasInteractedWithEmail: false,
  hasInteractedWithPassword: false
}
