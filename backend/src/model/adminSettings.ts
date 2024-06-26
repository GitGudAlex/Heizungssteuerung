import { type Document, Schema, type Model, model } from 'mongoose'

export interface AdminSettingsDocument extends Document {
  invitationCode: string
  defaultTemp: number
  buildingOfInterest: string
  preheatingMinutesPerDegree: number
  isSyncActive: boolean
}

const adminSchema = new Schema<AdminSettingsDocument>({
  invitationCode: String,
  defaultTemp: Number,
  buildingOfInterest: String,
  preheatingMinutesPerDegree: Number,
  isSyncActive: Boolean
})

export const AdminSettings: Model<AdminSettingsDocument> = model<AdminSettingsDocument>('AdminSettings', adminSchema)
