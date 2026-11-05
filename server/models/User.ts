import mongoose, { Schema, type Model, type Types } from 'mongoose'

export interface IUser {
  username: string
  password: string
  name: string
  /** Role.key. Nilai 'admin' adalah super admin. */
  role: string
  isActive: boolean
  /** Data Pimpinan milik user, dipakai sebagai penulis artikel. */
  leaderId?: Types.ObjectId | null
  /** Dinaikkan untuk mencabut semua sesi (reset password, nonaktif). */
  tokenVersion: number
  lastLoginAt?: Date | null
  createdBy?: Types.ObjectId | null
  createdAt: Date
  updatedAt: Date
}

const schema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: 'Administrator'
    },
    role: {
      type: String,
      default: 'admin'
    },
    isActive: { type: Boolean, default: true },
    leaderId: { type: Schema.Types.ObjectId, ref: 'Leader', default: null },
    tokenVersion: { type: Number, default: 0 },
    lastLoginAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  {
    timestamps: true
  }
)

export const User =
  (mongoose.models.User as Model<IUser> | undefined) || mongoose.model<IUser>('User', schema)
