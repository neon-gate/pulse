import { Metadata } from 'next'
import Link from 'next/link'

import { SignupForm } from '@signup/ui'
import { Logo } from '@lib/ui'

export const metadata: Metadata = {
  title: 'Pulse - Signup',
  description: 'The app that hates your > 2000s songs. 😤',
  robots: {
    index: false,
    follow: false
  }
}

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link href="/" className="flex items-center gap-2 self-center font-medium">
        <Logo width="60" height="60" />
      </Link>
      <SignupForm />
      </div>
    </div>
  )
}
