import mongoose, { Schema, type Document } from 'mongoose'

export interface IGallery extends Document {
  filename: string
  imageUrl: string
  thumbnailUrl: string
  uploadedAt: Date
  title?: string
  category?: string
  isFeatured: boolean
  order: number
}

const GallerySchema = new Schema<IGallery>(
  {
    filename: { type: String, required: true },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    uploadedAt: { type: Date, required: true, default: Date.now },
    title: { type: String },
    category: { type: String },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { strict: true, timestamps: true }
)

export const Gallery =
  mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema)
