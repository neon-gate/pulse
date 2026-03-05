import {
  Volume,
  VolumeController
} from '@now-playing/@controller/lib/ui/client'

export default function ControllerSlot() {
  return (
    <div className="flex items-center justify-end">
      <VolumeController volume={Volume.Moderate} />
    </div>
  )
}
