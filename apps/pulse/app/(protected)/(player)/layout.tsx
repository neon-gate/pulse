import { redirect } from 'next/navigation'
// import { useAtomValue } from 'jotai'

// import { isAuthAtom } from '@atoms'
import { Header, Logo, Main } from '@lib/ui'

import { PlayerGrid } from './lib/ui'

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

  const isAuthenticated = true

  if (!isAuthenticated) {
    redirect('/login')
  }

  return (
    <PlayerGrid>
      <Header className="col-span-3">
        <Logo />
        <div>SearchInput</div>
        {userMenu}
      </Header>
      {library}
      <Main className="mobile-hidden overflow-y-auto">{children}</Main>
      {uploader}
      {nowPlaying}
    </PlayerGrid>
  )
}
