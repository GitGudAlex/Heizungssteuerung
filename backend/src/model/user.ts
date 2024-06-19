import { type Document, Schema, type Model, model } from 'mongoose'

export interface UserDocument extends Document {
  username: string
  password: string
  room: string
  isAdmin: boolean
  sepiaMode: boolean
  fontSize: string
  temperature: number
}

const userSchema = new Schema<UserDocument>({
  username: String,
  password: String,
  room: String,
  isAdmin: { type: Boolean, default: false },
  sepiaMode: { type: Boolean, default: false },
  fontSize: { type: String, default: 'medium' },
  temperature: { type: Number, default: 18 }
})

export const User: Model<UserDocument> = model<UserDocument>('User', userSchema)
