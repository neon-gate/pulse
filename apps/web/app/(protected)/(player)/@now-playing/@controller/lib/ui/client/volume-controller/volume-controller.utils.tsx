import {
  SpeakerLoudIcon,
  SpeakerModerateIcon,
  SpeakerOffIcon,
  SpeakerQuietIcon
} from '@radix-ui/react-icons'
import { Volume } from './volume-controller.enum'

export function getIconByVolume(volume: Volume) {
  const icons = {
    [Volume.Loud]: <SpeakerLoudIcon />,
    [Volume.Moderate]: <SpeakerModerateIcon />,
    [Volume.Quiet]: <SpeakerQuietIcon />,
    [Volume.Off]: <SpeakerOffIcon />
  }

  return icons[volume]
}
