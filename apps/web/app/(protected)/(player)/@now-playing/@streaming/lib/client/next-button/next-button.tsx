'use client'

import { TrackNextIcon } from '@radix-ui/react-icons'

export function NextButton() {
  return (
    <button
      aria-label="Next track"
      className="rounded-md p-1 outline-none ring-ring/50 focus-visible:ring-2 cursor-pointer"
      type="button"
    >
      <TrackNextIcon height={20} width={20} />
    </button>
  )
}
