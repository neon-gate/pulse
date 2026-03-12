import { UniqueEntityId } from '@repo/kernel'

import { User } from '@domain/entities'
import { AuthProvider } from '@domain/value-objects'
import { type UserDocument } from '@infra/mongoose'

export const userMapper = {
  toDomain(doc: UserDocument): User {
    const props = {
      email: doc.email,
      passwordHash: doc.passwordHash,
      provider: doc.provider as AuthProvider,
      providerUserId: doc.providerUserId,
      name: doc.name,
      createdAt: doc.createdAt
    }
    return User.create(props, UniqueEntityId.create(doc._id.toString()))
  },

  toPersistence(user: User) {
    return {
      _id: user.idString,
      email: user.email,
      passwordHash: user.hasPassword ? user.passwordHash : null,
      provider: user.provider,
      providerUserId: user.providerUserId,
      name: user.name
    }
  }
}
