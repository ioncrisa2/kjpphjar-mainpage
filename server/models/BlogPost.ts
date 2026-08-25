import mongoose, { Schema, Types, type Document, type Model } from 'mongoose'

export type BlogPostStatus = 'draft' | 'published' | 'scheduled'

export interface IBlogPost extends Document {
  title: string
  slug: string
  content: string
  publishedAt?: Date | null
  excerpt?: string
  coverImageUrl?: string
  tags: string[]
  categoryId?: Types.ObjectId | null
  isFeatured: boolean
  views: number
  readingTime: number
  metaTitle?: string
  metaDescription?: string
  status: BlogPostStatus
  /** Legacy compatibility flag. Use status for all new behavior. */
  isPublished: boolean
  leaderId?: Types.ObjectId | null
  author?: string
  createdAt: Date
  updatedAt: Date
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 180 },
    content: { type: String, required: true },
    publishedAt: { type: Date, default: null },
    excerpt: { type: String, maxlength: 400 },
    coverImageUrl: { type: String, maxlength: 500 },
    tags: { type: [String], default: [] },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null, index: true },
    leaderId: { type: Schema.Types.ObjectId, ref: 'Leader', default: null, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    views: { type: Number, default: 0, min: 0 },
    readingTime: { type: Number, default: 1, min: 1 },
    metaTitle: { type: String, maxlength: 70 },
    metaDescription: { type: String, maxlength: 180 },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'draft',
      index: true,
    },
    isPublished: { type: Boolean, default: false },
    author: { type: String, maxlength: 100 },
  },
  { strict: true, timestamps: true }
)

BlogPostSchema.index({ status: 1, publishedAt: -1 })
BlogPostSchema.index({ categoryId: 1, status: 1, publishedAt: -1 })
BlogPostSchema.index({ leaderId: 1, status: 1, publishedAt: -1 })
BlogPostSchema.index({ isFeatured: 1, status: 1, publishedAt: -1 })
BlogPostSchema.index({ tags: 1, publishedAt: -1 })

export const BlogPost: Model<IBlogPost> =
  (mongoose.models.BlogPost as Model<IBlogPost>) || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema)
