import { ThemePreference } from './theme.domain'
import { Volume } from './volume.enum'

export interface UserPreferences {
  theme: ThemePreference
  audioQuality: Volume
}
