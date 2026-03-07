import { atom } from 'jotai'
import { Volume } from '../domain/volume.enum'

export const volumeAtom = atom<Volume>(Volume.Moderate)
