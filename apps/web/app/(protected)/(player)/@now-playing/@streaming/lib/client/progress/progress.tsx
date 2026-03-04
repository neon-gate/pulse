'use client'

import * as Progress from '@radix-ui/react-progress'

export const MAX_PROGRESS_VALUE = 100

interface ProgressBarProps {
  currentSeconds: string
  totalSeconds: string
  progressValue: number
}
export function ProgressBar(props: ProgressBarProps) {
  const { currentSeconds, totalSeconds, progressValue } = props

  const progressPercentage = (progressValue / MAX_PROGRESS_VALUE) * 100
  const percentageTransform = `translateX(-${progressPercentage}%)`

  return (
    <div className="grid grid-cols-[48px_1fr_48px] items-center gap-3">
      <span className="h-4 text-right text-sm leading-4 text-background-muted">
        {currentSeconds}
      </span>
      <Progress.Root
        aria-label="Playback progress"
        className="h-2 overflow-hidden rounded-full bg-neon-warm"
        max={MAX_PROGRESS_VALUE}
        value={progressValue}
      >
        <Progress.Indicator
          className="h-full bg-background transition-transform"
          style={{ transform: percentageTransform }}
        />
      </Progress.Root>
      <span className="h-4 text-sm leading-4 text-background">
        {totalSeconds}
      </span>
    </div>
  )
}
