import { Main } from '@lib/ui'
import { LoginForm } from '@login/ui/form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Neon Gate FM - Login',
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
