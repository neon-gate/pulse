import { Profile } from '@domain'
import { avatarMock } from './avatar.mock'

export const profileMock = {
  displayName: 'John Doe',
  avatar: avatarMock
} satisfies Profile
