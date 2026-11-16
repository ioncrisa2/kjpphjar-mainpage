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
      'Ruko Terminal Sako No. 18, Jl. Sako Raya / Jl. Siaran, Sialang, Kec. Sako, Kota Palembang, Sumatera Selatan 30163',
    googleMapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.5997561!2d104.7884349!3d-2.9309659!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwNTUnNTEuNSJTIDEwNMKwNDcnMjYuMiJF!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
    googleMapsUrl:
      "https://www.google.com/maps/place/2%C2%B055'51.5%22S+104%C2%B047'26.2%22E/@-2.9310068,104.7887215,17.33z/data=!4m4!3m3!8m2!3d-2.9309659!4d104.7906236?entry=ttu",
  },
  socialMedia: {
    instagram: 'https://www.instagram.com/kjpphenricusdanrekan/',
    linkedin: '',
    facebook: '',
    youtube: '',
  },
  generalContacts: {
    email: 'henricusja@yahoo.com',
    phone: '(0711) 5615793',
    whatsapp: '628117101066',
  },
  copyrightText: 'KJPP Henricus Judi Adrianto & Rekan',
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
