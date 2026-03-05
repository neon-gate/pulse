'use client'

import { Avatar } from '@lib/ui/server'
import {
  Volume,
  VolumeController
} from '@now-playing/@controller/lib/ui/client'
import SongInfoPage from '@now-playing/@song-info/page'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronUpIcon } from '@radix-ui/react-icons'

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
          className="min-w-56 origin-[var(--radix-dropdown-menu-content-transform-origin)] rounded-md bg-[canvas] py-1 text-gray-900 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 data-[side=bottom]:animate-in data-[side=bottom]:fade-in-0 data-[side=bottom]:zoom-in-95 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300"
          sideOffset={18}
        >
          <DropdownMenu.Arrow asChild>
            <div className="translate-x-[83px] translate-y-0.5">
              <ChevronUpIcon />
            </div>
          </DropdownMenu.Arrow>
          <DropdownMenu.Item className="dropdown-menu-item data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900">
            Add a song to your library
          </DropdownMenu.Item>
          <DropdownMenu.Item className="dropdown-menu-item data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900">
            Check out your songs
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="dropdown-menu-item-separator" />
          <DropdownMenu.Item className="dropdown-menu-item data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900">
            Log out
          </DropdownMenu.Item>
          <span className="mobile-visible">
            <DropdownMenu.Separator className="dropdown-menu-item-separator" />
            <DropdownMenu.Item className="dropdown-menu-item">
              <VolumeController volume={Volume.Quiet} />
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="dropdown-menu-item-separator" />
            <DropdownMenu.Item className="dropdown-menu-item">
              {/* TODO: Dont a page here, just a component */}
              <SongInfoPage />
            </DropdownMenu.Item>
          </span>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
