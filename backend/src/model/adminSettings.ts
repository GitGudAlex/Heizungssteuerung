import { type Document, Schema, type Model, model } from 'mongoose'

export interface AdminSettingsDocument extends Document {
  invitationCode: string
  defaultTemp: number
  preheatingMinutesPerDegree: number
  isSyncActive: boolean
  nightlyShutoff: { off: number, on: number }
}

const adminSchema = new Schema<AdminSettingsDocument>({
  invitationCode: String,
  defaultTemp: Number,
  preheatingMinutesPerDegree: Number,
  isSyncActive: Boolean,
  nightlyShutoff: {
    off: Number,
    on: Number
  }
})

export const AdminSettings: Model<AdminSettingsDocument> =
  model<AdminSettingsDocument>('AdminSettings', adminSchema)
