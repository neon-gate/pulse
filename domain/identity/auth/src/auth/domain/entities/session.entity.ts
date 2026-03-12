import { AggregateRoot, UniqueEntityId } from '@repo/kernel'

import { AuthProvider } from '@domain/value-objects'

export interface SessionProps {
  userId: string
  refreshTokenHash: string
  expiresAt: Date
  createdAt: Date
  ipAddress?: string | null
  userAgent?: string | null
  provider: AuthProvider
}

export class Session extends AggregateRoot<SessionProps> {
  private constructor(props: SessionProps, id?: UniqueEntityId) {
    super(props, id)
  }

  static create(props: SessionProps, id?: UniqueEntityId): Session {
    return new Session(props, id)
  }

  get idString(): string {
    return this._id.toString()
  }

  get userId(): string {
    return this.props.userId
  }

  get refreshTokenHash(): string {
    return this.props.refreshTokenHash
  }

  get expiresAt(): Date {
    return this.props.expiresAt
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get ipAddress(): string | null {
    return this.props.ipAddress ?? null
  }

  get userAgent(): string | null {
    return this.props.userAgent ?? null
  }

  get provider(): AuthProvider {
    return this.props.provider
  }

  rotateRefreshToken(hash: string, expiresAt: Date): void {
    this.props.refreshTokenHash = hash
    this.props.expiresAt = expiresAt
  }

  toJSON(): SessionProps & { id: string } {
    return { ...this.props, id: this.idString }
  }
}
