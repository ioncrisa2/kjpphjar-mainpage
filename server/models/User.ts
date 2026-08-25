import mongoose, { Schema, type Model } from 'mongoose'

export interface IUser {
  username: string
  password: string
  name: string
  role: string
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
      default: 'admin' // in case we want to add multiple roles later
    }
  },
  {
    timestamps: true
  }
)

export const User =
  (mongoose.models.User as Model<IUser> | undefined) || mongoose.model<IUser>('User', schema)
