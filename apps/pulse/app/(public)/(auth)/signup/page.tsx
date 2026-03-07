import { Metadata } from 'next'

import { Main } from '@lib/ui'

export const metadata: Metadata = {
  title: 'Pulse - Signup',
  description: 'The app that hates your > 2000s songs. 😤',
  robots: {
    index: false,
    follow: false
  }
}

export default function SignupPage() {
  return <Main className="flex items-center justify-center">SignupForm</Main>
}
