'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronUpIcon } from '@radix-ui/react-icons'
import { TrackMetadata } from '@track-metadata/ui'
import { Avatar } from '@user-menu/ui'
import { VolumeBar } from '@volume-bar/ui'

export function UserDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="Open user menu"
          className="rounded-full outline-none ring-ring/50 focus-visible:ring-2"
          type="button"
        >
          <Avatar />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="radix-crap-content-utility"
          sideOffset={18}
        >
          <DropdownMenu.Arrow asChild>
            <div className="translate-x-[83px] translate-y-0.5">
              <ChevronUpIcon />
            </div>
          </DropdownMenu.Arrow>
          <DropdownMenu.Item className="dropdown-menu-item radix-crap-item-utility">
            Add a song to your library
          </DropdownMenu.Item>
          <DropdownMenu.Item className="dropdown-menu-item radix-crap-item-utility">
            Check out your songs
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="dropdown-menu-item-separator" />
          <DropdownMenu.Item className="dropdown-menu-item radix-crap-item-utility">
            Log out
          </DropdownMenu.Item>
          <span className="mobile-visible">
            <DropdownMenu.Separator className="dropdown-menu-item-separator" />
            <DropdownMenu.Item className="dropdown-menu-item">
              <VolumeBar />
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="dropdown-menu-item-separator" />
            <DropdownMenu.Item className="dropdown-menu-item">
              <TrackMetadata />
            </DropdownMenu.Item>
          </span>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
