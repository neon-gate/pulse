import { FieldErrors } from '@lib/ui/validation'
import { LoginAction } from '@login/server/actions'
import type { LoginState, UpdateLoginState } from './form.state'
import type { LoginSchema } from './form.validation'
export interface LoginFormInput {
  email: string
  password: string
}
export interface LoginSubmitInput {
  loginAction: LoginAction
  formState: LoginState
  updater: UpdateLoginState
}

export interface LoginSubmitMap {
  draft: LoginState
  isPending: boolean
  fieldErrors?: FieldErrors<LoginSchema>
}
