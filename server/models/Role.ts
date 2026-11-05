import mongoose, { Schema, type Model } from 'mongoose'

export interface IRole {
  /** Disimpan di User.role. Tidak bisa diubah setelah dibuat. */
  key: string
  name: string
  description?: string
  permissions: string[]
  /** Role sistem (super admin) tidak bisa diubah atau dihapus. */
  isSystem: boolean
  createdAt: Date
  updatedAt: Date
}

const RoleSchema = new Schema<IRole>(
  {
    key: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 40 },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 300, default: '' },
    permissions: { type: [String], default: [] },
    isSystem: { type: Boolean, default: false },
  },
  { strict: true, timestamps: true }
)

export const Role =
  (mongoose.models.Role as Model<IRole> | undefined) || mongoose.model<IRole>('Role', RoleSchema)
