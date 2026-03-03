import { cn } from '@lib/ui/helpers'

interface MainProps {
  children: React.ReactNode
  className?: string
}

export function Main(props: MainProps) {
  const { children, className = '' } = props

  return (
    <main className={cn('screen-side-padding flex-1', className)}>
      {children}
    </main>
  )
}
