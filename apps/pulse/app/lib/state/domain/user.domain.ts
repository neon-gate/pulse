import { Session } from './session.domain'
import { UserPreferences } from './user-preferences.domain'
import { Profile } from './profile.domain'

export interface User {
  id: string
  session: Session
  email: string
  username: string | null
  profile: Profile
  preferences: UserPreferences
}
