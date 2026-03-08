import {
  SpeakerLoudIcon,
  SpeakerModerateIcon,
  SpeakerOffIcon,
  SpeakerQuietIcon
} from '@radix-ui/react-icons'

import { Volume } from '@domain'

export function getIconByVolume(volume: Volume) {
  const icon = {
    [Volume.Loud]: <SpeakerLoudIcon />,
    [Volume.Moderate]: <SpeakerModerateIcon />,
    [Volume.Quiet]: <SpeakerQuietIcon />,
    [Volume.Off]: <SpeakerOffIcon />
  }[volume]

  return icon ?? <SpeakerModerateIcon />
}
