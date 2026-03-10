import { Avatar } from './avatar.domain'

export interface User {
  id: string
  name: string
  surname: string
  email: string
  libraryId: string
  avatar: Avatar
}
