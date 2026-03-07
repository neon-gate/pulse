import { atom } from 'jotai'
import { Volume } from './volume.enum'

export const volumeAtom = atom<Volume>(Volume.Moderate)
