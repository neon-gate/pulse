'use client'

import type { ChangeEvent, FocusEvent, SubmitEvent } from 'react'
import { useSetAtom } from 'jotai'
import { useImmer } from 'use-immer'
import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@shadcn/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator
} from '@shadcn/components/ui/field'
import { Button } from '@shadcn/components/ui/button'
import { Input } from '@shadcn/components/ui/input'
import { loginAction } from '@login/ui'
import { cn } from '@lib/template'
import { isAuthAtom, userAtom } from '@atoms'
import type { User } from '@domain'

import {
  handleEmailBlur,
  handleEmailChange,
  handleFormSubmit,
  handlePasswordBlur,
  handlePasswordChange
} from './form.handlers'
import type { LoginFormState } from './form.types'
import { loginFormState } from './form-state.data'

export function LoginForm(props: React.ComponentProps<'div'>) {
  const [formState, updateFormState] = useImmer<LoginFormState>(loginFormState)
  const setIsAuth = useSetAtom(isAuthAtom)
  const setUser = useSetAtom(userAtom)

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

    const response = await handleFormSubmit({
      loginAction,
      formState,
      updater: updateFormState
    })

    if (!response) return

    const payload = decodeJwtPayload(response.accessToken)
    const authId = payload?.sub

    if (!authId) return

    const profileResponse = await fetch(
      `/api/slim-shady/profile?authId=${encodeURIComponent(authId)}`,
      {
        method: 'GET',
        headers: { 'x-request-id': crypto.randomUUID() }
      }
    )

    if (!profileResponse.ok) return

    const profile = (await profileResponse.json()) as SlimShadyProfile

    setUser(mapProfileToUser(profile))
    setIsAuth(true)
  }

  return (
    <div className={cn('flex flex-col gap-6', props.className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-neon font-extrabold">
            Welcome back
          </CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} aria-busy={isPending}>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={onEmailChange}
                  onBlur={onEmailBlur}
                  required
                />
                {emailError && (
                  <FieldDescription className="text-destructive">
                    {emailError[0]}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={onPasswordChange}
                  onBlur={onPasswordBlur}
                  required
                />
                {passwordError && (
                  <FieldDescription className="text-destructive">
                    {passwordError[0]}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup"> Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{' '}
        <Link href="/terms">Terms of Service</Link> and{' '}
        <Link href="/privacy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  )
}

interface SlimShadyProfile {
  id: string
  authId: string
  email: string
  username: string | null
  profile: {
    displayName: string
    avatarUrl: string | null
    bio: string | null
  }
  preferences: {
    theme: 'dark' | 'light' | 'system'
    explicitContentFilter: boolean
    audioQuality: 'low' | 'normal' | 'high' | 'very_high'
    privateSession: boolean
  }
  country: string | null
  onboarding: {
    completed: boolean
    completedAt: string | null
  }
  profileCompleteness: number
}

function decodeJwtPayload(token: string): { sub?: string } | null {
  const parts = token.split('.')

  if (parts.length < 2) return null

  try {
    const base64Url = parts[1] ?? ''
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    )
    const payload = atob(padded)
    return JSON.parse(payload) as { sub?: string }
  } catch {
    return null
  }
}

function mapProfileToUser(profile: SlimShadyProfile): User {
  return {
    profileId: profile.id,
    authId: profile.authId,
    email: profile.email,
    username: profile.username,
    profile: {
      displayName: profile.profile.displayName,
      avatarUrl: profile.profile.avatarUrl,
      bio: profile.profile.bio
    },
    preferences: profile.preferences,
    country: profile.country,
    onboarding: {
      completed: profile.onboarding.completed,
      completedAt: profile.onboarding.completedAt
        ? new Date(profile.onboarding.completedAt)
        : null
    },
    profileCompleteness: profile.profileCompleteness,
    avatar: {
      imageUrl:
        profile.profile.avatarUrl ??
        `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.profile.displayName)}`
    }
  }
}
