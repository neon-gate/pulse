'use client'

import { PauseIcon, PlayIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

export function PlayPauseButton() {
  const [isPlaying, setIsPlaying] = useState(false)

  function handlePlayPause() {
    setIsPlaying(!isPlaying)
  }

  return (
    <button
      aria-label="Play/Pause"
      className="rounded-full p-1 outline-none ring-ring/50 focus-visible:ring-2 cursor-pointer"
      onClick={handlePlayPause}
      type="button"
    >
      {isPlaying ? (
        <PauseIcon height={24} width={24} />
      ) : (
        <PlayIcon height={24} width={24} />
      )}
    </button>
  )
}
