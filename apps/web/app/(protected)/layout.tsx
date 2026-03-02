import { redirect } from 'next/navigation'

interface ProtectLayoutProps {
  children: React.ReactNode
}

export default async function ProtectLayout(props: ProtectLayoutProps) {
  const { children } = props

  const isAuthenticated = true // TODO: replace with actual authentication check

  if (!isAuthenticated) {
    redirect('/login')
  }

  return children
}
