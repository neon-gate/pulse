import { cn } from '@lib/template'

interface MainProps {
  children: React.ReactNode
  className?: string
}

export function Main(props: MainProps) {
  const { children, className = '' } = props

  return <main className={cn('flex-1', className)}>{children}</main>
}
