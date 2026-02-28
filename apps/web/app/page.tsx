import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Header } from '@lib/ui/server'

export const metadata: Metadata = {
  title: 'Neon Gate FM - Signup',
  description: 'The app that hates your > 2000s songs. 😤',
  robots: {
    index: false,
    follow: false
  }
}

export default async function PlayerPage() {
  const isAuthenticated = false // TODO: replace with actual authentication check

  if (!isAuthenticated) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main
        id="main-home"
        className="flex flex-1 justify-center items-center screen-padding"
      >
        <div className="max-w-md w-full">Player</div>
      </main>
    </div>
  )
}
