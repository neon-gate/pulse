import { Header, Logo } from '@lib/ui/server'
import { UserDropdown } from '@user-menu/ui/client'

interface PlayerLayoutProps {
  children: React.ReactNode
}

export default async function PlayerLayout(props: PlayerLayoutProps) {
  const { children } = props

  return (
    <div className="flex flex-col">
      <Header className="flex flex-row justify-between items-center">
        <Logo />
        <UserDropdown />
      </Header>
      <main>{children}</main>
    </div>
  )
}
