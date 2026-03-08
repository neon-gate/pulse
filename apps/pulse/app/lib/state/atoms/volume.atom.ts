import { atom } from 'jotai'

import { Volume } from '@domain'

export const volumeAtom = atom<Volume>(Volume.Moderate)
