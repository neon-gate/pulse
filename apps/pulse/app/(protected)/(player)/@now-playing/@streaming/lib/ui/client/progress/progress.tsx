'use client'

import { useAtomValue } from 'jotai'
import * as Progress from '@radix-ui/react-progress'

import { metadataAtom, progressAtom } from '@atoms'
import { cn } from '@lib/template'

export function ProgressBar() {
  const metadata = useAtomValue(metadataAtom)
  const progress = useAtomValue(progressAtom)

  if (!metadata) return null

  const percentage = (progress.seconds / metadata.duration) * 100

  return (
    <div className="grid grid-cols-[48px_1fr_48px] items-center gap-3">
      <span className="h-4 text-right text-sm leading-4 text-background-muted">
        {progress.seconds}
      </span>
      <Progress.Root
        aria-label="Playback progress"
        className="h-2 overflow-hidden rounded-full bg-background"
        max={metadata.duration}
        value={progress.seconds}
      >
        <Progress.Indicator
          className={cn(
            'h-full bg-neon-warm transition-transform',
            `translateX(-${percentage}%)`
          )}
        />
      </Progress.Root>
      <span className="h-4 text-sm leading-4 text-background">
        {metadata.duration}
      </span>
    </div>
  )
}
