import { Main } from '@lib/ui'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Neon Gate FM - Signup',
  description: 'The app that hates your > 2000s songs. 😤',
  robots: {
    index: false,
    follow: false
  }
}

export default function SignupPage() {
  return <Main className="flex items-center justify-center">SignupForm</Main>
}
