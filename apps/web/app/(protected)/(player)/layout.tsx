import { Header, Logo, Main } from '@lib/ui/server'
import { Suspense } from 'react'
import LibraryLoading from './@library/loading'
import LibrarySlot from './@library/page'
import NowPlayingSlot from './@now-playing/page'
import UploaderSlot from './@uploader/page'
import UserMenuSlot from './@user-menu/page'

export default async function PlayerLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header className="flex flex-row justify-between items-center mb-2">
        <Logo />
        <UserMenuSlot />
      </Header>
      <Main className="flex gap-2 justify-between">
        <Suspense fallback={<LibraryLoading />}>
          <LibrarySlot />
        </Suspense>
        <div>Inner Content</div>
        <UploaderSlot />
      </Main>
      <NowPlayingSlot />
    </div>
  )
}
