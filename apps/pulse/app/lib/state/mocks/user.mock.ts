import { User } from '@domain'
import { sessionMock, profileMock, userPreferencesMock } from '@mocks'

export const userMock = {
  id: 'usr_550e8400-e29b-41d4-a716-446655440000',
  session: sessionMock,
  email: 'dev.jonatas@gmail.com',
  username: 'jonaras',
  profile: profileMock,
  preferences: userPreferencesMock
} satisfies User
