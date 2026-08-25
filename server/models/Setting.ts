import mongoose, { Schema, type Document } from 'mongoose'
import { DEFAULT_APP_SETTINGS } from '~/types/settings'

export interface ISetting extends Document {
  key: 'global'
  siteName: string
  footerAddress: {
    headOffice: string
    googleMapsEmbedUrl: string
    googleMapsUrl: string
  }
  socialMedia: {
    instagram: string
    linkedin: string
    facebook: string
    youtube: string
  }
  generalContacts: {
    email: string
    phone: string
    whatsapp: string
  }
  copyrightText: string
  maintenanceMode: {
    isActive: boolean
    message: string
    expectedEndTime: Date | null
  }
  createdAt: Date
  updatedAt: Date
}

function isHttpsUrl(value: string) {
  if (!value) return true

  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function isGoogleMapsEmbedUrl(value: string) {
  if (!value) return true

  try {
    const url = new URL(value)
    const googleHost = url.hostname === 'google.com' || url.hostname.endsWith('.google.com')
    return url.protocol === 'https:' && googleHost && url.pathname.includes('/maps/embed')
  } catch {
    return false
  }
}

const FooterAddressSchema = new Schema(
  {
    headOffice: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: DEFAULT_APP_SETTINGS.footerAddress.headOffice,
    },
    googleMapsEmbedUrl: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
      validate: {
        validator: isGoogleMapsEmbedUrl,
        message: 'URL embed harus berupa URL HTTPS Google Maps yang valid.',
      },
    },
    googleMapsUrl: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
      validate: {
        validator: isHttpsUrl,
        message: 'URL Google Maps harus menggunakan HTTPS.',
      },
    },
  },
  { _id: false }
)

const SocialMediaSchema = new Schema(
  {
    instagram: { type: String, trim: true, maxlength: 2000, default: '', validate: isHttpsUrl },
    linkedin: { type: String, trim: true, maxlength: 2000, default: '', validate: isHttpsUrl },
    facebook: { type: String, trim: true, maxlength: 2000, default: '', validate: isHttpsUrl },
    youtube: { type: String, trim: true, maxlength: 2000, default: '', validate: isHttpsUrl },
  },
  { _id: false }
)

const GeneralContactsSchema = new Schema(
  {
    email: { type: String, trim: true, lowercase: true, maxlength: 254, default: '' },
    phone: { type: String, trim: true, maxlength: 40, default: '' },
    whatsapp: {
      type: String,
      trim: true,
      maxlength: 20,
      default: DEFAULT_APP_SETTINGS.generalContacts.whatsapp,
    },
  },
  { _id: false }
)

const MaintenanceModeSchema = new Schema(
  {
    isActive: { type: Boolean, default: false },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: DEFAULT_APP_SETTINGS.maintenanceMode.message,
    },
    expectedEndTime: { type: Date, default: null },
  },
  { _id: false }
)

const SettingSchema = new Schema<ISetting>(
  {
    key: {
      type: String,
      enum: ['global'],
      default: 'global',
      unique: true,
      immutable: true,
      required: true,
    },
    siteName: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 160,
      default: DEFAULT_APP_SETTINGS.siteName,
    },
    footerAddress: { type: FooterAddressSchema, default: () => ({}) },
    socialMedia: { type: SocialMediaSchema, default: () => ({}) },
    generalContacts: { type: GeneralContactsSchema, default: () => ({}) },
    copyrightText: {
      type: String,
      trim: true,
      maxlength: 300,
      default: DEFAULT_APP_SETTINGS.copyrightText,
    },
    maintenanceMode: { type: MaintenanceModeSchema, default: () => ({}) },
  },
  { strict: true, timestamps: true, minimize: false }
)

export const Setting =
  mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema)
