import { AggregateRoot, UniqueEntityId } from '@repo/kernel'

export interface UserProps {
  email: string
  passwordHash: string
  createdAt: Date
  refreshTokenHash?: string | null
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
    return this.props.passwordHash
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get refreshTokenHash(): string | null {
    return this.props.refreshTokenHash ?? null
  }

  setRefreshTokenHash(hash: string | null): void {
    this.props.refreshTokenHash = hash
  }

  toJSON(): UserProps & { id: string } {
    return { ...this.props, id: this.idString }
  }
}
