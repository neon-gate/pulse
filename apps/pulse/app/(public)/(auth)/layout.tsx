import { Header, Logo, Main } from '@lib/ui'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout(props: AuthLayoutProps) {
  const { children } = props

  return (
    <div className="flex flex-col bg-neon-cool h-screen text-foreground">
      <Main className="flex items-center justify-center h-full">
        {children}
      </Main>
    </div>
  )
}
