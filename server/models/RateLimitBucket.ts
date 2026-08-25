import mongoose, { Schema, type Model } from 'mongoose'

export interface IRateLimitBucket {
  _id: string
  count: number
  expiresAt: Date
}

const RateLimitBucketSchema = new Schema<IRateLimitBucket>(
  {
    _id: { type: String, required: true },
    count: { type: Number, default: 0, min: 0, required: true },
    expiresAt: { type: Date, required: true },
  },
  { versionKey: false },
)

RateLimitBucketSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'rate_limit_ttl' })

export const RateLimitBucket =
  (mongoose.models.RateLimitBucket as Model<IRateLimitBucket> | undefined) ||
  mongoose.model<IRateLimitBucket>('RateLimitBucket', RateLimitBucketSchema)
