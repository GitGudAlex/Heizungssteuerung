import { type Document, Schema, type Model, model } from 'mongoose'

export interface UserDocument extends Document {
  username: string
  password: string
  room: string
  isAdmin: boolean
  sepiaMode: boolean
  fontSize: string
  lineHeight: number
  calString: string
  temperature: number
}

const userSchema = new Schema<UserDocument>({
  username: { type: String, unique: true },
  calString: { type: String, unique: true },
  password: String,
  room: String,
  isAdmin: { type: Boolean, default: false },
  sepiaMode: { type: Boolean, default: false },
  fontSize: { type: String, default: 'medium' },
  lineHeight: { type: Number, default: 1.5 },
  temperature: { type: Number, default: 18 }
})

export const User: Model<UserDocument> = model<UserDocument>('User', userSchema)
