import { Logo, Search } from '@lib/ui/client'
import { Header, Main } from '@lib/ui/server'
import LibraryLoading from '@library/loading'
import UserMenuLoading from '@user-menu/loading'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

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

  const isAuthenticated = true // TODO: replace with actual authentication check

  if (!isAuthenticated) {
    redirect('/login')
  }

  return (
    <div className="player-grid">
      <Header className="col-span-3">
        <Logo />
        <Search />
        <Suspense fallback={<UserMenuLoading />}>{userMenu}</Suspense>
      </Header>
      <aside className="overflow-y-auto player-section glassy-surface gap-x-2 ml-2">
        <Suspense fallback={<LibraryLoading />}>{library}</Suspense>
      </aside>
      <Main className="mobile-hidden overflow-y-auto">{children}</Main>
      <aside className="mobile-hidden overflow-y-auto player-section glassy-surface mr-2">
        {uploader}
      </aside>
      <aside className="col-span-3 now-playing-bar glassy-surface">
        {nowPlaying}
      </aside>
    </div>
  )
}
