import { VolumeBar } from '@volume-bar/ui'

import './lib/css/utilities.css'

export default function VolumeSlot() {
  return (
    <div className="flex items-center justify-end">
      <VolumeBar />
    </div>
  )
}
