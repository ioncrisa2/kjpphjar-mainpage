import mongoose, { Schema, type Document } from 'mongoose'

export interface IFaq extends Document {
  question: string
  answer: string
  isActive: boolean
  order: number
}

const FaqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { strict: true, timestamps: true }
)

export const Faq =
  mongoose.models.Faq || mongoose.model<IFaq>('Faq', FaqSchema)
