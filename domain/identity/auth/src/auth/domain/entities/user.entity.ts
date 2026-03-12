import { AggregateRoot, UniqueEntityId } from '@repo/kernel'

import { AuthProvider } from '@domain/value-objects'

export interface UserProps {
  email: string
  passwordHash?: string | null
  provider: AuthProvider
  providerUserId?: string | null
  name?: string | null
  createdAt: Date
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id)
  }

  static create(props: UserProps, id?: UniqueEntityId): User {
    return new User(props, id)
  }

  get idString(): string {
    return this._id.toString()
  }

  get email(): string {
    return this.props.email
  }

  get passwordHash(): string {
    return this.props.passwordHash ?? ''
  }

  get provider(): AuthProvider {
    return this.props.provider
  }

  get providerUserId(): string | null {
    return this.props.providerUserId ?? null
  }

  get name(): string | null {
    return this.props.name ?? null
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get hasPassword(): boolean {
    return Boolean(this.props.passwordHash)
  }

  toJSON(): UserProps & { id: string } {
    return { ...this.props, id: this.idString }
  }
}
