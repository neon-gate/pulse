import { atom } from 'jotai'

import type { Progress } from '@domain'
import { progressMock } from '@mocks'

export const progressAtom = atom<Progress>(progressMock)
