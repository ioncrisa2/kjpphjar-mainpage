export interface FooterAddressSettings {
  headOffice: string
  googleMapsEmbedUrl: string
  googleMapsUrl: string
}

export interface SocialMediaSettings {
  instagram: string
  linkedin: string
  facebook: string
  youtube: string
}

export interface GeneralContactSettings {
  email: string
  phone: string
  whatsapp: string
}

export interface MaintenanceModeSettings {
  isActive: boolean
  message: string
  expectedEndTime: string | null
}

export interface AppSettings {
  siteName: string
  footerAddress: FooterAddressSettings
  socialMedia: SocialMediaSettings
  generalContacts: GeneralContactSettings
  copyrightText: string
  maintenanceMode: MaintenanceModeSettings
}

export interface PublicAppSettings extends AppSettings {
  updatedAt: string | null
}

export interface RestoreCollectionPreview {
  collection: string
  incoming: number
  existing: number
  inserts: number
  updates: number
}

export interface RestorePreviewResponse {
  success: true
  dryRun: boolean
  mode: 'merge'
  backupCreatedAt: string
  collections: RestoreCollectionPreview[]
  totalDocuments: number
  uploadNotice: string
}

export const SETTINGS_BACKUP_FORMAT = 'kjpphjar-logical-backup'
export const SETTINGS_BACKUP_VERSION = 1
// Keep browser-driven backup/restore memory and request usage bounded.
// Larger datasets must use native MongoDB backup tooling.
export const MAX_RESTORE_BYTES = 4 * 1024 * 1024
export const MAX_RESTORE_DOCUMENTS = 100_000

export const DEFAULT_APP_SETTINGS: AppSettings = {
  siteName: 'KJPP Henricus Judi Adrianto & Rekan',
  footerAddress: {
    headOffice:
      'Ruko Terminal, Jl. Sako Raya Jl. Siaran No.18, Sialang, Kec. Sako, Kota Palembang, Sumatera Selatan 30163',
    googleMapsEmbedUrl: '',
    googleMapsUrl: '',
  },
  socialMedia: {
    instagram: 'https://www.instagram.com/kjpphenricusdanrekan/',
    linkedin: '',
    facebook: '',
    youtube: '',
  },
  generalContacts: {
    email: '',
    phone: '',
    whatsapp: '628117101066',
  },
  copyrightText: 'KJPP Henricus Judi Adrianto dan Rekan',
  maintenanceMode: {
    isActive: false,
    message:
      'Website sedang dalam pemeliharaan rutin. Silakan kembali beberapa saat lagi.',
    expectedEndTime: null,
  },
}

export function createDefaultAppSettings(): AppSettings {
  return {
    ...DEFAULT_APP_SETTINGS,
    footerAddress: { ...DEFAULT_APP_SETTINGS.footerAddress },
    socialMedia: { ...DEFAULT_APP_SETTINGS.socialMedia },
    generalContacts: { ...DEFAULT_APP_SETTINGS.generalContacts },
    maintenanceMode: { ...DEFAULT_APP_SETTINGS.maintenanceMode },
  }
}

export function createDefaultPublicSettings(): PublicAppSettings {
  return {
    ...createDefaultAppSettings(),
    updatedAt: null,
  }
}
