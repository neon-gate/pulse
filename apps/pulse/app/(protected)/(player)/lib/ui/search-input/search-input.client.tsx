'use client'

import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

export function SearchInput() {
  const [value, setValue] = useState('')

  return (
    <div className="relative flex items-center mobile-hidden">
      <MagnifyingGlassIcon className="absolute left-3 size-4 text-muted-foreground" />
      <input
        type="search"
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="
          h-9 w-full rounded-md border border-border bg-background
          pl-9 pr-8 text-sm outline-none
          placeholder:text-muted-foreground
          focus-visible:ring-2 focus-visible:ring-ring
          transition
        "
      />
    </div>
  )
}
