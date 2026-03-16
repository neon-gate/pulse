import { Avatar } from './avatar.domain'

export interface User {
  profileId: string
  authId: string
  email: string
  username: string | null
  profile: {
    displayName: string
    avatarUrl: string | null
    bio: string | null
  }
  preferences: {
    theme: 'dark' | 'light' | 'system'
    explicitContentFilter: boolean
    audioQuality: 'low' | 'normal' | 'high' | 'very_high'
    privateSession: boolean
  }
  country: string | null
  onboarding: {
    completed: boolean
    completedAt: Date | null
  }
  profileCompleteness: number
  avatar: Avatar
}
