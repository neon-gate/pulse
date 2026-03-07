import type { SchemaState } from '@lib/validation'
import type { LoginState } from '@login/state'
import type { LoginFormSchema } from './form.validation'

export interface LoginFormState
  extends LoginState,
    SchemaState<LoginFormSchema> {
  hasInteractedWithEmail: boolean
  hasInteractedWithPassword: boolean
}
