import mongoose, { Schema, type Document } from 'mongoose'

export interface IBranch extends Document {
  name: string
  city: string
  phone: string
  email: string
  address: string
  latitude: number
  longitude: number
  mapsUrl?: string
  isActive: boolean
  order: number
}

const BranchSchema = new Schema<IBranch>(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    mapsUrl: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { strict: true, timestamps: true }
)

export const Branch =
  mongoose.models.Branch || mongoose.model<IBranch>('Branch', BranchSchema)
