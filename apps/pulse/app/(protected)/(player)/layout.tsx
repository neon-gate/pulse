import { isAuthAtom } from '@atoms'
import { Header, Logo, Main } from '@lib/ui'
import { useAtomValue } from 'jotai'
import { redirect } from 'next/navigation'
import { SearchInput } from './lib/ui'
import './lib/css/component.css'

interface PlayerLayoutProps {
  children: React.ReactNode
  'user-menu'?: React.ReactNode
  'now-playing'?: React.ReactNode
  library?: React.ReactNode
  uploader?: React.ReactNode
}

export default function PlayerLayout(props: PlayerLayoutProps) {
  const {
    children,
    library,
    uploader,
    ['now-playing']: nowPlaying,
    ['user-menu']: userMenu
  } = props

  const isAuthenticated = useAtomValue(isAuthAtom)

  if (!isAuthenticated) {
    redirect('/login')
  }

  return (
    <div className="sm:player-grid player-grid-mobile">
      <Header className="col-span-3">
        <Logo />
        <SearchInput />
        {userMenu}
      </Header>
      {library}
      <Main className="mobile-hidden overflow-y-auto">{children}</Main>
      {uploader}
      {nowPlaying}
    </div>
  )
}
