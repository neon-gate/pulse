import { UserPreferences, Volume } from '@domain'

export const userPreferencesMock = {
  theme: 'system',
  audioQuality: Volume.Quiet
} satisfies UserPreferences
