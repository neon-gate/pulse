import { CurrentTrack } from '@domain'

export interface StartResponse {
  streamUrl: string
  track: CurrentTrack
}
