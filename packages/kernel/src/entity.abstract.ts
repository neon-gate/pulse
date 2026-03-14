import { UniqueEntityId } from './id.abstract'

/**
 * Base entity with identity and props.
 *
 * @example
 * class Track extends Entity<TrackProps> {}
 */
export abstract class Entity<Props> {
  protected readonly _id: UniqueEntityId
  protected props: Props

  protected constructor(props: Props, id?: UniqueEntityId) {
    this._id = id ?? UniqueEntityId.create()
    this.props = props
  }

  get id(): UniqueEntityId {
    return this._id
  }
}
