import { User } from '@domain'

import { avatarMock } from './avatar.mock'

export const userMock = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Jonatas',
  surname: 'Sales',
  email: 'dev.jonatas@gmail.com',
  avatar: avatarMock,
  libraryId: 'd8710f35-9384-4967-98cf-ca2e6d8c8c3b'
} satisfies User
