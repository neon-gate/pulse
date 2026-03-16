import { atom } from 'jotai'

import type { User } from '@domain'

export const userAtom = atom<User | null>(null)
