import mongoose, { Schema, type Document } from 'mongoose'

export interface IClient extends Document {
  name: string
  logoUrl: string
  category?: string
  order: number
  isActive: boolean
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
    category: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { strict: true, timestamps: true }
)

export const Client =
  mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema)
