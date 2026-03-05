import { getFieldErrors } from '@lib/ui/validation'
import { LoginState } from '@login/state'
import {
  mapEmailBlur,
  mapEmailChange,
  mapLoginStateReset,
  mapLoginSubmit,
  mapPasswordBlur,
  mapPasswordChange
} from './form.mappers'
import { LoginFormState, type UpdateLoginFormState } from './form.state'
import type { LoginSubmitInput } from './form.types'
import { LoginFormSchema, loginSchema } from './form.validation'

export function handleEmailChange(
  email: LoginFormState['email'],
  updater: UpdateLoginFormState
) {
  updater((draft: LoginFormState) => mapEmailChange(draft, email))
}

export function handlePasswordChange(
  password: LoginFormState['password'],
  updater: UpdateLoginFormState
) {
  updater((draft: LoginFormState) => mapPasswordChange(draft, password))
}

export function handleEmailBlur(
  input: LoginState,
  updater: UpdateLoginFormState
) {
  const fieldErrors = getFieldErrors<LoginFormSchema>(input, loginSchema)

  if (fieldErrors === null) return

  updater((draft: LoginFormState) => mapEmailBlur(draft, fieldErrors))
}

export function handlePasswordBlur(
  input: LoginState,
  updater: UpdateLoginFormState
) {
  const fieldErrors = getFieldErrors<LoginFormSchema>(input, loginSchema)

  if (fieldErrors === null) return

  updater((draft: LoginFormState) => mapPasswordBlur(draft, fieldErrors))
}

export async function handleFormSubmit(input: LoginSubmitInput) {
  const { formState, updater, loginAction } = input

  const payload = { email: formState.email, password: formState.password }

  const fieldErrors = getFieldErrors(payload, loginSchema)

  if (fieldErrors) {
    updater((draft: LoginFormState) =>
      mapLoginSubmit({ draft, fieldErrors, isPending: false })
    )
    return
  }

  updater((draft: LoginFormState) => mapLoginSubmit({ draft, isPending: true }))

  try {
    const response = await loginAction(payload)

    console.log(response)

    updater((draft: LoginFormState) => mapLoginStateReset(draft))
  } catch {
    updater((draft: LoginFormState) =>
      mapLoginSubmit({ draft, isPending: false })
    )
  }
}
