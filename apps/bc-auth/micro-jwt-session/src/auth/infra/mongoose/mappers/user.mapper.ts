import { UniqueEntityId } from '@repo/kernel'

import { User } from '@domain/entities'
import { type UserDocument } from '@infra/mongoose'

export const userMapper = {
  toDomain(doc: UserDocument): User {
    const props = {
      email: doc.email,
      passwordHash: doc.passwordHash,
      createdAt: doc.createdAt,
      refreshTokenHash: doc.refreshTokenHash
    }
    return User.create(props, new UniqueEntityId(doc._id.toString()))
  },

  toPersistence(user: User) {
    return {
      _id: user.idString,
      email: user.email,
      passwordHash: user.passwordHash,
      refreshTokenHash: user.refreshTokenHash
    }
  }
}
