import mongoose from 'mongoose'

const schema = new mongoose.Schema(
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

export const User = mongoose.models.User || mongoose.model('User', schema)
