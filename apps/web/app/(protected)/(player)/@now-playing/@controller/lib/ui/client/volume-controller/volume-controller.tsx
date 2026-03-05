import { MAX_PROGRESS_VALUE } from '@now-playing/lib/state'
import * as Slider from '@radix-ui/react-slider'
import { Volume } from './volume-controller.enum'
import { getIconByVolume } from './volume-controller.utils'

interface VolumeControllerProps {
  volume: Volume
}

export function VolumeController(props: VolumeControllerProps) {
  const { volume } = props

  const icon = getIconByVolume(volume)

  return (
    <form className="flex items-center sm:gap-2 gap-1">
      {icon}
      <Slider.Root
        className="relative flex h-5 w-36 touch-none select-none items-center"
        defaultValue={[Number(volume)]}
        max={MAX_PROGRESS_VALUE}
        step={1}
      >
        <Slider.Track className="relative h-[4px] grow rounded-full bg-background">
          <Slider.Range className="absolute h-full rounded-full bg-neon" />
        </Slider.Track>
        <Slider.Thumb
          className="block size-4 rounded-[10px] bg-foreground shadow-[0_2px_4px] shadow-neon hover:bg-neon focus:shadow-[0_0_0_1px] focus:outline-none"
          aria-label="Volume"
        />
      </Slider.Root>
    </form>
  )
}
