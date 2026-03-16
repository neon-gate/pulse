'use client'

import { useImmerAtom } from 'jotai-immer'
import { AudioLinesIcon, UploadIcon, LogOutIcon } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@shadcn/components/ui/avatar'
import { Button } from '@shadcn/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@shadcn/components/ui/dropdown-menu'
import { toInitials } from '@lib/template'
import { VolumeBar } from '@volume-bar/ui'
import { userAtom } from '@atoms'
import { TrackMetadata } from '@track-metadata/ui'

export function UserDropdown() {
  const [user] = useImmerAtom(userAtom)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
          <Avatar>
            <AvatarImage
              src={user?.profile.avatarUrl ?? user?.avatar.imageUrl}
              alt={`${user?.profile.displayName} avatar`}
            />
            <AvatarFallback>
              {toInitials(`${user?.profile.displayName}`)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <AudioLinesIcon />
            Library
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UploadIcon />
            Upload
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon />
          Sign Out
        </DropdownMenuItem>
        <DropdownMenuSeparator className="mobile-visible" />
        <DropdownMenuItem className="mobile-visible hover:bg-transparent">
          <VolumeBar />
        </DropdownMenuItem>
        <DropdownMenuSeparator className="mobile-visible" />
        <DropdownMenuItem inert className="mobile-visible">
          <TrackMetadata />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
