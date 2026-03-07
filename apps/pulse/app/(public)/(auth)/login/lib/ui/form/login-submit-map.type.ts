import { FieldErrors } from '@lib/validation'
import { LoginFormSchema } from './form.validation'
import { LoginFormState } from './form-state.type'

export interface LoginSubmitMap {
  draft: LoginFormState
  isPending: boolean
  fieldErrors?: FieldErrors<LoginFormSchema>
}
