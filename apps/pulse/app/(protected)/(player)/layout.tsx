import { redirect } from 'next/navigation'
// import { useAtomValue } from 'jotai'

// import { isAuthAtom } from '@atoms'
import { Header, Logo, Main } from '@lib/ui'

import { PlayerGrid, Search } from './lib/ui'

interface PlayerLayoutProps {
  children: React.ReactNode
  'user-menu'?: React.ReactNode
  'now-playing'?: React.ReactNode
  library?: React.ReactNode
  uploader?: React.ReactNode
}

export default function PlayerLayout(props: PlayerLayoutProps) {
  const {
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
    <PlayerGrid className="bg-neon">
      <Header className="col-span-5">
        <Logo />
        <div className="flex items-center">
          <Search />
        </div>
        {userMenu}
      </Header>
      {library}
      {uploader}
      {nowPlaying}
    </PlayerGrid>
  )
}
