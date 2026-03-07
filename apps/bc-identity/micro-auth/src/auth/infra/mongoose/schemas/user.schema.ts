import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

@Schema({
  _id: false,
  collection: 'users',
  timestamps: true
})
export class User {
  @Prop({ type: String, required: true })
  _id!: string

  @Prop({ required: true, unique: true })
  email!: string

  @Prop({ required: true })
  passwordHash!: string

  @Prop({ type: String, default: null })
  refreshTokenHash!: string | null

  @Prop({ type: Date })
  createdAt!: Date

  @Prop({ type: Date })
  updatedAt!: Date
}

export type UserDocument = HydratedDocument<User>

export const UserSchemaDefinition = SchemaFactory.createForClass(User)
