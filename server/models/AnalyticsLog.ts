import mongoose, { Schema, type Model } from 'mongoose'

export type AnalyticsDevice = 'desktop' | 'mobile' | 'tablet' | 'other'
export type AnalyticsBrowser =
  | 'chrome'
  | 'safari'
  | 'edge'
  | 'firefox'
  | 'opera'
  | 'samsung-internet'
  | 'other'
export type AnalyticsSource = 'direct' | 'organic' | 'social' | 'referral' | 'internal'

export interface IAnalyticsLog {
  eventId: string
  path: string
  referrer: string
  source: AnalyticsSource
  isEntry: boolean
  device: AnalyticsDevice
  browser: AnalyticsBrowser
  ipHash?: string
  visitedAt: Date
}

const AnalyticsLogSchema = new Schema<IAnalyticsLog>(
  {
    eventId: { type: String, required: true, unique: true },
    path: { type: String, required: true, maxlength: 300 },
    referrer: { type: String, default: '', maxlength: 253 },
    source: {
      type: String,
      enum: ['direct', 'organic', 'social', 'referral', 'internal'],
      default: 'direct',
    },
    isEntry: { type: Boolean, default: true },
    device: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'other'],
      default: 'other',
    },
    browser: {
      type: String,
      enum: ['chrome', 'safari', 'edge', 'firefox', 'opera', 'samsung-internet', 'other'],
      default: 'other',
    },
    ipHash: { type: String, maxlength: 64 },
    visitedAt: { type: Date, default: Date.now, required: true },
  },
  {
    strict: true,
    versionKey: false,
  }
)

// MongoDB's TTL monitor removes raw page-view logs after 90 days. The index also
// supports all reporting queries, which begin with a visitedAt range filter.
AnalyticsLogSchema.index(
  { visitedAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60, name: 'analytics_ttl_90_days' }
)

export const AnalyticsLog =
  (mongoose.models.AnalyticsLog as Model<IAnalyticsLog> | undefined) ||
  mongoose.model<IAnalyticsLog>('AnalyticsLog', AnalyticsLogSchema)
