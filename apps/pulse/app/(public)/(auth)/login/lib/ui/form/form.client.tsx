'use client'

import Link from 'next/link'
import type { ChangeEvent, FocusEvent, SubmitEvent } from 'react'
import { useImmer } from 'use-immer'
import {
  handleEmailBlur,
  handleEmailChange,
  handleFormSubmit,
  handlePasswordBlur,
  handlePasswordChange
} from './form.handlers'
import { loginAction } from './form-login.action'
import { loginFormState } from './form-state.data'
import type { LoginFormState } from './form-state.type'

export function LoginForm() {
  const [formState, updateFormState] = useImmer<LoginFormState>(loginFormState)

  const { email, password, fieldErrors, isPending } = formState

  const { email: emailError, password: passwordError } = fieldErrors

  function onEmailBlur(event: FocusEvent<HTMLInputElement>) {
    const input = { email: event.target.value, password: formState.password }
    handleEmailBlur(input, updateFormState)
  }

  function onPasswordBlur(event: FocusEvent<HTMLInputElement>) {
    const input = { email: formState.email, password: event.target.value }
    handlePasswordBlur(input, updateFormState)
  }

  function onEmailChange(event: ChangeEvent<HTMLInputElement>) {
    handleEmailChange(event.target.value, updateFormState)
  }

  function onPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    handlePasswordChange(event.target.value, updateFormState)
  }

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    handleFormSubmit({
      loginAction,
      formState,
      updater: updateFormState
    })
  }

  return (
    <form onSubmit={onSubmit} aria-busy={isPending}>
      <div data-invalid={Boolean(email)}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          name="email"
          type="text"
          value={email}
          onChange={onEmailChange}
          onBlur={onEmailBlur}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? 'login-email-error' : undefined}
        />
        <div id="login-email-error" aria-live="polite">
          {emailError}
        </div>
      </div>

      <div data-invalid={Boolean(passwordError)}>
        <div className="flex items-center">
          <label htmlFor="login-password">Password</label>
          <Link
            href="/forgot-password"
            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
        <input
          id="login-password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChange}
          onBlur={onPasswordBlur}
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? 'login-password-error' : undefined}
        />
        <div id="login-password-error">{passwordError}</div>
      </div>

      <div>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Signing in...' : 'Login'}
        </button>
        <div className="text-center">
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </div>
      </div>
    </form>
  )
}
