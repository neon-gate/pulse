import { atom } from 'jotai'

import type { Metadata } from '@domain'

const mockMetadata: Metadata = {
  title: 'Papercut',
  artist: 'Linkin Park',
  album: {
    name: 'Hybrid Theory',
    cover: 'https://i.scdn.co/image/ab67616d000048512cd7568f8895a3c031c2e2fb'
  },
  duration: 185_000
}

export const metadataAtom = atom<Metadata | null>(mockMetadata)
