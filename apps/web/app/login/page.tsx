import { Metadata } from 'next'

import { LoginForm } from '@login/ui/client/form'

export const metadata: Metadata = {
  title: 'Neon Gate FM - Login',
  description: 'The app that hates your > 2000s songs. 😤',
  robots: {
    index: false,
    follow: false
  }
}

export default function Page() {
  return (
    <main
      id="main-login"
      className="flex min-h-svh w-full items-center justify-center p-6 md:p-10"
    >
      <h1 className="sr-only">Login</h1>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  )
}
