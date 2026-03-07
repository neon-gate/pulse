import { atom } from 'jotai'

interface Progress {
  seconds: number
}

export const progressAtom = atom<Progress>({ seconds: 0 })
