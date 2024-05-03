import { type Document, Schema, type Model, model } from 'mongoose'

export interface AdminSettingsDocument extends Document {
  invitationCode: string
  calendarRegex: string
}

const adminSchema = new Schema<AdminSettingsDocument>({
  invitationCode: String,
  calendarRegex: String
})

export const AdminSettings: Model<AdminSettingsDocument> = model<AdminSettingsDocument>('AdminSettings', adminSchema)
