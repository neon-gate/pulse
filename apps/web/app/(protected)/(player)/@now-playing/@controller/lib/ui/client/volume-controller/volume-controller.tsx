import { SpeakerModerateIcon } from '@radix-ui/react-icons'
import * as Slider from '@radix-ui/react-slider'
import { Volume } from './volume-controller.enum'
import { getIconByVolume } from './volume-controller.utils'

interface VolumeControllerProps {
  volume: Volume
}

export function VolumeController(props: VolumeControllerProps) {
  const { volume } = props

  const icon = getIconByVolume(volume) ?? <SpeakerModerateIcon />

  return (
    <form className="flex items-center place-content-end gap-2 text-neon">
      {icon}
      <Slider.Root
        className="relative flex h-5 w-[200px] touch-none select-none items-center"
        defaultValue={[50]}
        max={100}
        step={1}
      >
        <Slider.Track className="relative h-[4px] grow rounded-full bg-blackA7">
          <Slider.Range className="absolute h-full rounded-full bg-neon" />
        </Slider.Track>
        <Slider.Thumb
          className="block size-3.5 rounded-[10px] bg-white shadow-[0_2px_10px] shadow-blackA4 hover:bg-violet3 focus:shadow-[0_0_0_5px] focus:shadow-blackA5 focus:outline-none"
          aria-label="Volume"
        />
      </Slider.Root>
    </form>
  )
}
