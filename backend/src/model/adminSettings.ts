import { type Document, Schema, type Model, model } from 'mongoose'

export interface AdminSettingsDocument extends Document {
  invitationCode: string
  defaultTemp: number
  buildingOfInterest: string
  preheatingMinutesPerDegree: number
}

const adminSchema = new Schema<AdminSettingsDocument>({
  invitationCode: String,
  defaultTemp: Number,
  buildingOfInterest: String,
  preheatingMinutesPerDegree: Number
})

export const AdminSettings: Model<AdminSettingsDocument> = model<AdminSettingsDocument>('AdminSettings', adminSchema)
