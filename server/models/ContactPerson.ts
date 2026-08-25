import mongoose, { Schema, type Document } from 'mongoose'

export interface IContactPerson extends Document {
  name: string
  phone: string
  isActive: boolean
  order: number
}

const ContactPersonSchema = new Schema<IContactPerson>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { strict: true, timestamps: true }
)

export const ContactPerson =
  mongoose.models.ContactPerson || mongoose.model<IContactPerson>('ContactPerson', ContactPersonSchema)
