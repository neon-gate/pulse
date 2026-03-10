import { cn } from '@lib/template'

interface HeaderProps {
  children?: React.ReactNode
  className?: string
}

export function Header(props: HeaderProps) {
  const { children, className = '' } = props

  const tw = cn(
    'sticky top-0 items-center h-16 grid items-center grid-cols-[170px_auto_32px] px-2',
    className
  )

  if (!children) {
    return <header className={tw} />
  }

  return <header className={tw}>{children}</header>
}
