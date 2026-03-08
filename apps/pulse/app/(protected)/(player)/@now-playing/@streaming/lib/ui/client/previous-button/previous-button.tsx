'use client'

import { TrackPreviousIcon } from '@radix-ui/react-icons'

export function PreviousButton() {
  return (
    <button
      aria-label="Previous track"
      className="rounded-md p-1 outline-none ring-ring/50 focus-visible:ring-2 cursor-pointer"
      type="button"
    >
      <TrackPreviousIcon height={20} width={20} />
    </button>
  )
}
