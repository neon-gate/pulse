import { atom } from 'jotai'
import { Metadata } from './metadata.type'

export const metadataAtom = atom<Metadata | null>(null)
