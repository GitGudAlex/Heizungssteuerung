import { type Document, Schema, type Model, model } from 'mongoose'

export interface UserDocument extends Document {
  username: string
  password: string
  isAdmin: boolean
  sepiaMode: boolean
  temperature: number
}

const userSchema = new Schema<UserDocument>({
  username: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
  sepiaMode: { type: Boolean, default: false },
  temperature: { type: Number, default: 18 }
})

export const User: Model<UserDocument> = model<UserDocument>('User', userSchema)
