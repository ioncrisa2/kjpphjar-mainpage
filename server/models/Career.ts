import mongoose, { Schema, type Document } from 'mongoose'

export interface ICareer extends Document {
  title: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Internship'
  description: string
  postedAt: Date
  requirements: string[]
  closingDate?: Date
  isActive: boolean
}

const CareerSchema = new Schema<ICareer>(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['Full-time', 'Part-time', 'Internship'],
    },
    description: { type: String, required: true },
    postedAt: { type: Date, default: Date.now },
    requirements: { type: [String], default: [] },
    closingDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { strict: true, timestamps: true }
)

export const Career =
  mongoose.models.Career || mongoose.model<ICareer>('Career', CareerSchema)
