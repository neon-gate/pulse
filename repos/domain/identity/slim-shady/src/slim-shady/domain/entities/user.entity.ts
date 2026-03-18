import { AggregateRoot, UniqueEntityId } from '@pack/kernel'

export type ThemePreference = 'dark' | 'light' | 'system'
export type AudioQualityPreference = 'low' | 'normal' | 'high' | 'very_high'
export type AccountStatus = 'active' | 'suspended' | 'deactivated'

export interface UserProfileProps {
  displayName: string
  avatarUrl: string | null
  bio: string | null
}

export interface UserPreferencesProps {
  theme: ThemePreference
  explicitContentFilter: boolean
  audioQuality: AudioQualityPreference
  privateSession: boolean
}

export interface UserOnboardingProps {
  completed: boolean
  completedAt: Date | null
}

export interface UserProps {
  authId: string
  email: string
  username: string | null
  profile: UserProfileProps
  preferences: UserPreferencesProps
  country: string | null
  account: {
    status: AccountStatus
  }
  onboarding: UserOnboardingProps
  createdAt: Date
  updatedAt: Date
}

interface UpdateProfileInput {
  username?: string | null
  displayName?: string
  avatarUrl?: string | null
  bio?: string | null
  country?: string | null
}

interface UpdatePreferencesInput {
  theme?: ThemePreference
  explicitContentFilter?: boolean
  audioQuality?: AudioQualityPreference
  privateSession?: boolean
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

  get authId(): string {
    return this.props.authId
  }

  get email(): string {
    return this.props.email
  }

  get username(): string | null {
    return this.props.username
  }

  get displayName(): string {
    return this.props.profile.displayName
  }

  get avatarUrl(): string | null {
    return this.props.profile.avatarUrl
  }

  get bio(): string | null {
    return this.props.profile.bio
  }

  get preferences(): UserPreferencesProps {
    return this.props.preferences
  }

  get country(): string | null {
    return this.props.country
  }

  get accountStatus(): AccountStatus {
    return this.props.account.status
  }

  get onboarding(): UserOnboardingProps {
    return this.props.onboarding
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  get profileCompleteness(): number {
    const checks = [
      Boolean(this.username),
      Boolean(this.displayName.trim()),
      Boolean(this.avatarUrl),
      Boolean(this.bio),
      Boolean(this.country)
    ]
    const done = checks.filter(Boolean).length
    return Math.round((done / checks.length) * 100)
  }

  updateProfile(input: UpdateProfileInput): string[] {
    const changedFields: string[] = []

    if (Object.hasOwn(input, 'username') && input.username !== this.props.username) {
      this.props.username = input.username ?? null
      changedFields.push('username')
    }

    if (
      Object.hasOwn(input, 'displayName') &&
      input.displayName &&
      input.displayName !== this.props.profile.displayName
    ) {
      this.props.profile.displayName = input.displayName
      changedFields.push('profile.displayName')
    }

    if (
      Object.hasOwn(input, 'avatarUrl') &&
      input.avatarUrl !== this.props.profile.avatarUrl
    ) {
      this.props.profile.avatarUrl = input.avatarUrl ?? null
      changedFields.push('profile.avatarUrl')
    }

    if (Object.hasOwn(input, 'bio') && input.bio !== this.props.profile.bio) {
      this.props.profile.bio = input.bio ?? null
      changedFields.push('profile.bio')
    }

    if (Object.hasOwn(input, 'country') && input.country !== this.props.country) {
      this.props.country = input.country ?? null
      changedFields.push('country')
    }

    if (changedFields.length > 0) {
      this.props.updatedAt = new Date()
    }

    return changedFields
  }

  updatePreferences(input: UpdatePreferencesInput): string[] {
    const changedFields: string[] = []

    if (input.theme && input.theme !== this.props.preferences.theme) {
      this.props.preferences.theme = input.theme
      changedFields.push('preferences.theme')
    }

    if (
      Object.hasOwn(input, 'explicitContentFilter') &&
      input.explicitContentFilter !== this.props.preferences.explicitContentFilter
    ) {
      this.props.preferences.explicitContentFilter = input.explicitContentFilter ?? false
      changedFields.push('preferences.explicitContentFilter')
    }

    if (
      input.audioQuality &&
      input.audioQuality !== this.props.preferences.audioQuality
    ) {
      this.props.preferences.audioQuality = input.audioQuality
      changedFields.push('preferences.audioQuality')
    }

    if (
      Object.hasOwn(input, 'privateSession') &&
      input.privateSession !== this.props.preferences.privateSession
    ) {
      this.props.preferences.privateSession = input.privateSession ?? false
      changedFields.push('preferences.privateSession')
    }

    if (changedFields.length > 0) {
      this.props.updatedAt = new Date()
    }

    return changedFields
  }

  completeOnboarding(completed: boolean): string[] {
    const changedFields: string[] = []

    if (this.props.onboarding.completed !== completed) {
      this.props.onboarding.completed = completed
      this.props.onboarding.completedAt = completed ? new Date() : null
      changedFields.push('onboarding.completed', 'onboarding.completedAt')
      this.props.updatedAt = new Date()
    }

    return changedFields
  }

  toJSON(): UserProps & { id: string; profileCompleteness: number } {
    return {
      ...this.props,
      id: this.idString,
      profileCompleteness: this.profileCompleteness
    }
  }
}
