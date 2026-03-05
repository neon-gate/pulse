import type { FieldErrors } from '@lib/ui/validation'
import { LoginAction } from '@login/server/actions'
import type { LoginFormState, UpdateLoginFormState } from './form.state'
import type { LoginFormSchema } from './form.validation'

export interface LoginSubmitInput {
  loginAction: LoginAction
  formState: LoginFormState
  updater: UpdateLoginFormState
}

export interface LoginSubmitMap {
  draft: LoginFormState
  isPending: boolean
  fieldErrors?: FieldErrors<LoginFormSchema>
}
