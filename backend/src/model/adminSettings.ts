import { type Document, Schema, type Model, model } from 'mongoose'

export interface AdminSettingsDocument extends Document {
  invitationCode: string
  defaultTemp: number
  buildingOfInterest: string
}

const adminSchema = new Schema<AdminSettingsDocument>({
  invitationCode: String,
  defaultTemp: Number,
  buildingOfInterest: String
})

export const AdminSettings: Model<AdminSettingsDocument> = model<AdminSettingsDocument>('AdminSettings', adminSchema)
