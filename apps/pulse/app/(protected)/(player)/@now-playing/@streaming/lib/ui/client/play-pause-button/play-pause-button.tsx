'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons'

import { isPausedAtom } from '@atoms'

export function PlayPauseButton() {
  const isPaused = useAtomValue(isPausedAtom)
  const setIsPaused = useSetAtom(isPausedAtom)

  function handlePlayPause() {
    setIsPaused((prev) => !prev)
  }

  return (
    <button
      aria-label="Play/Pause"
      className="rounded-full p-1 outline-none ring-ring/50 focus-visible:ring-2 cursor-pointer"
      onClick={handlePlayPause}
      type="button"
    >
      {!isPaused ? (
        <PauseIcon height={24} width={24} />
      ) : (
        <PlayIcon height={24} width={24} />
      )}
    </button>
  )
}
