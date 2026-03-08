import { StateUpdater } from '@lib/state'
import { SchemaState, FieldErrors } from '@lib/ui'
import { LoginState } from '@login/state'
import { LoginAction } from '@login/ui'

import { LoginFormSchema } from './form.validation'

export interface LoginFormState
  extends LoginState,
    SchemaState<LoginFormSchema> {
  hasInteractedWithEmail: boolean
  hasInteractedWithPassword: boolean
}

export interface LoginSubmitInput {
  loginAction: LoginAction
  formState: LoginFormState
  updater: StateUpdater<LoginFormState>
}

export interface LoginSubmitMap {
  draft: LoginFormState
  isPending: boolean
  fieldErrors?: FieldErrors<LoginFormSchema>
}
