import type { StateUpdater } from '@lib/state'
import type { FieldErrors, SchemaState } from '@lib/ui'
import type { SignupState } from '@signup/state'
import type { SignupAction } from '@signup/ui'

import type { SignupFormSchema } from './form.validation'

export interface SignupFormState
  extends SignupState,
    SchemaState<SignupFormSchema> {
  hasInteractedWithName: boolean
  hasInteractedWithEmail: boolean
  hasInteractedWithPassword: boolean
}

export interface SignupSubmitInput {
  signupAction: SignupAction
  formState: SignupFormState
  updater: StateUpdater<SignupFormState>
}

export interface SignupSubmitMap {
  draft: SignupFormState
  isPending: boolean
  fieldErrors?: FieldErrors<SignupFormSchema>
}
