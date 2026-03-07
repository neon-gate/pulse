import { LoginAction } from './form-login.action'
import { LoginFormState } from './form-state.type'
import { UpdateLoginFormState } from './update-login-form-state.type'

export interface LoginSubmitInput {
  loginAction: LoginAction
  formState: LoginFormState
  updater: UpdateLoginFormState
}
