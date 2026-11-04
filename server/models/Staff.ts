import mongoose, { Schema, type Document, type Types } from 'mongoose'

export interface IStaff extends Document {
  name: string
  position: string
  /** Kantor penempatan. Kantor pusat juga tercatat sebagai entri di koleksi Branch. */
  branchId: Types.ObjectId
  mappiNumber?: string
}

const StaffSchema = new Schema<IStaff>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    position: { type: String, required: true, trim: true, maxlength: 200 },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    mappiNumber: { type: String, trim: true, maxlength: 100, default: '' },
  },
  { strict: true, timestamps: true }
)

export const Staff =
  mongoose.models.Staff || mongoose.model<IStaff>('Staff', StaffSchema)
