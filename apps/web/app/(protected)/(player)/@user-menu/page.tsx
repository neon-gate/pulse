import { Suspense } from 'react'
import { UserDropdown } from './lib/ui/client'
import UserMenuLoading from './loading'

export default function UserMenuSlot() {
  return (
    <Suspense fallback={<UserMenuLoading />}>
      <nav>
        <UserDropdown />
      </nav>
    </Suspense>
  )
}
