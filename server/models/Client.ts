import mongoose, { Schema, type Document, type Types } from 'mongoose'

export interface IClient extends Document {
  name: string
  logoUrl: string
  category?: string
  order: number
  isActive: boolean
  /** User pembuat. Data lama tanpa createdBy dianggap milik admin. */
  createdBy?: Types.ObjectId | null
  updatedBy?: Types.ObjectId | null
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
    category: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { strict: true, timestamps: true }
)

export const Client =
  mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema)
