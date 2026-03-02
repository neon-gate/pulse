import type { FieldErrors } from '@lib/ui/validation'

import { type LoginState, loginInitialState } from './form.state'
import type { LoginSubmitMap } from './form.types'
import { LoginSchema } from './form.validation'

export function mapLoginSubmit(map: LoginSubmitMap) {
  const { draft, fieldErrors, isPending } = map

  draft.fieldErrors.email = fieldErrors?.email
  draft.fieldErrors.password = fieldErrors?.password
  draft.isPending = isPending
}

export function mapLoginStateReset(draft: LoginState) {
  draft.email = loginInitialState.email
  draft.password = loginInitialState.password
  draft.apiError = loginInitialState.apiError
  draft.fieldErrors = loginInitialState.fieldErrors
  draft.hasInteractedWithEmail = loginInitialState.hasInteractedWithEmail
  draft.hasInteractedWithPassword = loginInitialState.hasInteractedWithPassword
  draft.isPending = loginInitialState.isPending
}

export function mapEmailChange(draft: LoginState, email: string) {
  draft.email = email
  draft.fieldErrors.email = undefined
}

export function mapPasswordChange(draft: LoginState, password: string) {
  draft.password = password
  draft.fieldErrors.password = undefined
}

export function mapEmailBlur(
  draft: LoginState,
  errors: FieldErrors<LoginSchema>
) {
  draft.hasInteractedWithEmail = true
  draft.fieldErrors.email = errors.email
}

export function mapPasswordBlur(
  draft: LoginState,
  errors: FieldErrors<LoginSchema>
) {
  draft.hasInteractedWithPassword = true
  draft.fieldErrors.password = errors.password
}
