import { atom } from 'jotai'

import type { User } from '@domain'
import { userMock } from '@mocks'

export const userAtom = atom<User | null>(userMock)
