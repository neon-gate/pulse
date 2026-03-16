import { atom } from 'jotai'

import { ThemePreference } from '@domain'

export const themePreferenceAtom = atom<ThemePreference>('system')
