'use client'

import { PlayIcon, PauseIcon } from 'lucide-react'

import { isPausedAtom } from '@atoms'
import { Button } from '@shadcn/components/ui/button'
import { useAtom } from 'jotai'

export function PlayPauseButton() {
  const [isPaused, setIsPaused] = useAtom(isPausedAtom)

  function handlePlayPause() {
    setIsPaused((prev) => !prev)
  }

  return (
    <Button
      className="cursor-pointer"
      variant="ghost"
      aria-label="Play/Pause button"
      onClick={handlePlayPause}
      size="icon"
    >
      {!isPaused ? (
        <PauseIcon height={24} width={24} />
      ) : (
        <PlayIcon height={24} width={24} />
      )}
    </Button>
  )
}
