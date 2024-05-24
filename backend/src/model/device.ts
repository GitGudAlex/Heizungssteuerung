import { type Model, Schema, model, type Document } from 'mongoose'

export interface DeviceDocument extends Document {
  name: string
  type: 'D301' | 'D302'
  identifier: string
  map: string
  enabled: boolean
}

const deviceSchema: Schema = new Schema<DeviceDocument>({
  name: { type: String, required: true },
  type: { type: String, enum: ['D301', 'D302'], required: true },
  identifier: { type: String, required: true },
  map: { type: String, required: true },
  enabled: { type: Boolean, default: true, required: false }
})

// Create and export the Mongoose model
export const Device: Model<DeviceDocument> = model<DeviceDocument>('Device', deviceSchema)
