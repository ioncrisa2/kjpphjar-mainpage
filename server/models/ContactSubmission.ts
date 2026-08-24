import mongoose, { Schema, type Document } from 'mongoose'

export interface IContactSubmission extends Document {
  fullname: string
  email: string
  message: string
  submittedAt: Date
  phone?: string
  city?: string
  isRead: boolean
  branch?: string
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    phone: { type: String },
    city: { type: String },
    isRead: { type: Boolean, default: false },
    branch: { type: String },
  },
  { strict: true, timestamps: true }
)

export const ContactSubmission =
  mongoose.models.ContactSubmission ||
  mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema)
