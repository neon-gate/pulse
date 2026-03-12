import { Metadata } from 'next'

import { LoginForm } from './lib/ui'
import { Logo } from '@lib/ui'
import Link from 'next/link'

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
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center">
          <Logo width="60" height="60" noText />
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}
