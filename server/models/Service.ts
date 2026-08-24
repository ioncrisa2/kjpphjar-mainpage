import mongoose, { Schema, type Document } from 'mongoose'

export interface IService extends Document {
  title: string
  titleEn: string
  slug: string
  description: string
  icon: string
  content?: string
  isActive: boolean
  order: number
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    titleEn: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    content: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { strict: true, timestamps: true }
)

export const Service =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema)
