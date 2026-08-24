import mongoose, { Schema, type Document } from 'mongoose'

export interface IBlogPost extends Document {
  title: string
  slug: string
  content: string
  publishedAt: Date
  excerpt?: string
  coverImageUrl?: string
  tags: string[]
  isPublished: boolean
  author?: string
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
    excerpt: { type: String },
    coverImageUrl: { type: String },
    tags: { type: [String], default: [] },
    isPublished: { type: Boolean, default: false },
    author: { type: String },
  },
  { strict: true, timestamps: true }
)

export const BlogPost =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema)
