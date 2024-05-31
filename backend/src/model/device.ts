import { type Model, Schema, model, type Document } from 'mongoose'

export interface DeviceDocument extends Document {
  name: string
  type: string
  identifier: string
  heaterMap: string
  roomMap: string
  enabled: boolean
}

const deviceSchema: Schema = new Schema<DeviceDocument>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  identifier: { type: String, required: true },
  heaterMap: { type: String, required: true },
  roomMap: { type: String, required: true },
  enabled: { type: Boolean, default: true, required: false }
})

// Create and export the Mongoose model
export const Device: Model<DeviceDocument> = model<DeviceDocument>('Device', deviceSchema)
