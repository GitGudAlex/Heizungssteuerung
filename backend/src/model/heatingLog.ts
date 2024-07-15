import { type Model, Schema, model, type Document } from 'mongoose'

export interface HeatingLogDocument extends Document {
  heater: string
  temperature: number
  deviceStats: any
  timestamp: Date
}

const heatingLogSchema: Schema = new Schema<HeatingLogDocument>({
  heater: { type: String, required: true },
  temperature: { type: Number, required: true },
  deviceStats: { type: Schema.Types.Mixed, required: true },
  timestamp: { type: Date, required: true }
})

// Create and export the Mongoose model
export const HeatingLog: Model<HeatingLogDocument> = model<HeatingLogDocument>(
  'HeatingLog',
  heatingLogSchema
)
