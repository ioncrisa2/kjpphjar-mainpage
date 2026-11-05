import mongoose, { Schema, type Document, type Types } from 'mongoose'

export interface IGallery extends Document {
  filename: string
  imageUrl: string
  thumbnailUrl: string
  uploadedAt: Date
  title?: string
  category?: string
  isFeatured: boolean
  order: number
  /** User pembuat. Data lama tanpa createdBy dianggap milik admin. */
  createdBy?: Types.ObjectId | null
  updatedBy?: Types.ObjectId | null
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
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { strict: true, timestamps: true }
)

export const Gallery =
  mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema)
