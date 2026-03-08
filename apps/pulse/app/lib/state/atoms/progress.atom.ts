import { atom } from 'jotai'

import type { Progress } from '@domain'

export const progressAtom = atom<Progress>({ milliseconds: 0 })
