import { getFieldErrors } from '@lib/ui/validation'

import {
  mapEmailBlur,
  mapEmailChange,
  mapLoginStateReset,
  mapLoginSubmit,
  mapPasswordBlur,
  mapPasswordChange
} from './form.mappers'
import { type LoginState, UpdateLoginState } from './form.state'
import type { LoginFormInput, LoginSubmitInput } from './form.types'
import { LoginSchema, loginSchema } from './form.validation'

export function handleEmailChange(
  email: LoginFormInput['email'],
  updater: UpdateLoginState
) {
  updater((draft: LoginState) => mapEmailChange(draft, email))
}

export function handlePasswordChange(
  password: LoginFormInput['password'],
  updater: UpdateLoginState
) {
  updater((draft: LoginState) => mapPasswordChange(draft, password))
}

export function handleEmailBlur(
  input: LoginFormInput,
  updater: UpdateLoginState
) {
  const fieldErrors = getFieldErrors<LoginSchema>(input, loginSchema)

  if (fieldErrors === null) return

  updater((draft: LoginState) => mapEmailBlur(draft, fieldErrors))
}

export function handlePasswordBlur(
  input: LoginFormInput,
  updater: UpdateLoginState
) {
  const fieldErrors = getFieldErrors<LoginSchema>(input, loginSchema)

  if (fieldErrors === null) return

  updater((draft: LoginState) => mapPasswordBlur(draft, fieldErrors))
}

export async function handleFormSubmit(input: LoginSubmitInput) {
  const { formState, updater, loginAction } = input

  const payload = { email: formState.email, password: formState.password }

  const fieldErrors = getFieldErrors(payload, loginSchema)

  if (fieldErrors) {
    updater((draft: LoginState) =>
      mapLoginSubmit({ draft, fieldErrors, isPending: false })
    )
    return
  }

  updater((draft: LoginState) => mapLoginSubmit({ draft, isPending: true }))

  try {
    const response = await loginAction(payload)

    console.log(response)

    updater((draft: LoginState) => mapLoginStateReset(draft))
  } catch {
    updater((draft: LoginState) => mapLoginSubmit({ draft, isPending: false }))
  }
}
