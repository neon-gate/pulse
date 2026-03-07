'use client'

import { isPausedAtom } from '@lib/atoms'
import { PauseIcon, PlayIcon } from '@radix-ui/react-icons'
import { useAtomValue, useSetAtom } from 'jotai'

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
