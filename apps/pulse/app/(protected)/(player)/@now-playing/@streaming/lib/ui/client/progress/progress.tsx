'use client'

import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import * as Progress from '@radix-ui/react-progress'

import { metadataAtom, progressAtom } from '@atoms'
import { cn, msToTime } from '@lib/template'

export function ProgressBar() {
  const metadata = useAtomValue(metadataAtom)
  const progress = useAtomValue(progressAtom)
  const setProgress = useSetAtom(progressAtom)
  const duration = metadata?.duration ?? 0

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => ({ milliseconds: prev.milliseconds + 1000 }))
    }, 1000)

    if (progress.milliseconds > duration - 1000) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [setProgress, duration, progress.milliseconds])

  if (!metadata) return null

  const percentage = (progress.milliseconds / duration) * 100
  

  return (
    <div className="grid grid-cols-[48px_1fr_48px] items-center gap-3">
      <span className="h-4 text-right text-sm leading-4 text-background-muted">
        {msToTime(progress.milliseconds)}
      </span>
      <Progress.Root
        aria-label="Playback progress"
        className="h-2 overflow-hidden rounded-full bg-background"
        value={progress.milliseconds}
        max={duration}
      >
        <Progress.Indicator
          className={cn('h-full bg-neon-warm transition-all ')}
          style={{ width: `${percentage}%`, transition: "width 100ms linear" }}
        />
      </Progress.Root>
      <span className="h-4 text-sm leading-4 text-background">
        {msToTime(duration)}
      </span>
    </div>
  )
}
