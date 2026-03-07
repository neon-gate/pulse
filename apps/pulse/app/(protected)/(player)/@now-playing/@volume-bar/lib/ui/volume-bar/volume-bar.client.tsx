import { Volume, volumeAtom } from '@lib/atoms'
import * as Slider from '@radix-ui/react-slider'
import { useAtomValue } from 'jotai'
import { getIconByVolume } from './get-icon-by-volume.mapper'

export function VolumeBar() {
  const volume = useAtomValue(volumeAtom)
  const icon = getIconByVolume(volume)

  return (
    <form className="flex items-center sm:gap-2 gap-1">
      {icon}
      <Slider.Root
        className="relative flex h-5 w-36 touch-none select-none items-center"
        defaultValue={[Number(volume)]}
        max={Number(Volume.Loud)}
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
