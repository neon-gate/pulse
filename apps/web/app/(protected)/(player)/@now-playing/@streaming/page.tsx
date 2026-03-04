import {
  NextButton,
  PlayPauseButton,
  PreviousButton,
  ProgressBar
} from '@now-playing/@streaming/lib/client'

export default function StreamingSlot() {
  return (
    <div>
      <div className="flex items-center justify-center gap-4">
        <PreviousButton />
        <PlayPauseButton />
        <NextButton />
      </div>
      <ProgressBar
        currentSeconds="02:33"
        totalSeconds="03:40"
        progressValue={45}
      />
    </div>
  )
}
