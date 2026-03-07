import { Metadata } from 'next'

import { Main } from '@lib/ui'

import { LoginForm } from './lib/ui'

export const metadata: Metadata = {
  title: 'Pulse - Login',
  description: 'The app that hates your > 2000s songs. 😤',
  robots: {
    index: false,
    follow: false
  }
}

export default function LoginPage() {
  return (
    <Main className="flex items-center justify-center">
      <LoginForm />
    </Main>
  )
}
