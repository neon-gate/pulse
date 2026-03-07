import { atom } from 'jotai'

import type { Metadata } from '@domain'

export const metadataAtom = atom<Metadata | null>(null)
