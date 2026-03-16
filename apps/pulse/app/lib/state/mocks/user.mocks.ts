import { User } from '@domain'

import { avatarMock } from './avatar.mock'

export const userMock = {
  profileId: 'usr_550e8400-e29b-41d4-a716-446655440000',
  authId: 'auth_550e8400-e29b-41d4-a716-446655440000',
  email: 'dev.jonatas@gmail.com',
  username: 'jonaras',
  profile: {
    displayName: 'Jonatas Sales',
    avatarUrl: avatarMock.imageUrl,
    bio: null
  },
  preferences: {
    theme: 'dark',
    explicitContentFilter: false,
    audioQuality: 'high',
    privateSession: false
  },
  country: 'BR',
  onboarding: {
    completed: false,
    completedAt: null
  },
  profileCompleteness: 80,
  avatar: avatarMock
} satisfies User
