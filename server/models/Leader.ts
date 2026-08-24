import mongoose, { Schema, type Document } from 'mongoose'

export interface ILeader extends Document {
  name: string
  position: string
  photoUrl: string
  order: number
  bio?: string
  isActive: boolean
}

const LeaderSchema = new Schema<ILeader>(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    photoUrl: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    bio: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { strict: true, timestamps: true }
)

export const Leader =
  mongoose.models.Leader || mongoose.model<ILeader>('Leader', LeaderSchema)
