import { cn } from '@lib/ui/helpers'

interface HeaderProps {
  children?: React.ReactNode
  className?: string
}

export function Header(props: HeaderProps) {
  const { children, className = '' } = props

  const tw = cn('sticky top-0 items-center py-3 screen-side-padding', className)

  if (!children) {
    return <header className={tw} />
  }

  return <header className={tw}>{children}</header>
}
