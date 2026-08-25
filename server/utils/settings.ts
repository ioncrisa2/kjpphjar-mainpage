import type { AppSettings, PublicAppSettings } from '~/types/settings'
import { createDefaultAppSettings } from '~/types/settings'
import { Setting } from '~/server/models/Setting'
import { connectDB } from '~/server/utils/db'

const CACHE_TTL_MS = 5_000

let settingsCache: { value: PublicAppSettings; expiresAt: number } | null = null

type UnknownRecord = Record<string, unknown>

type PersistedSettingsInput = Omit<AppSettings, 'maintenanceMode'> & {
  maintenanceMode: Omit<AppSettings['maintenanceMode'], 'expectedEndTime'> & {
    expectedEndTime: Date | null
  }
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function assertAllowedKeys(value: UnknownRecord, allowed: readonly string[], path: string) {
  const unsupported = Object.keys(value).filter((key) => !allowed.includes(key))
  if (unsupported.length) {
    throw createError({
      statusCode: 400,
      statusMessage: `Field tidak didukung pada ${path}: ${unsupported.join(', ')}`,
    })
  }
}

function readString(value: unknown, field: string, maxLength: number, required = false) {
  if (typeof value !== 'string') {
    throw createError({ statusCode: 400, statusMessage: `${field} harus berupa teks.` })
  }

  const normalized = value.trim()
  if (required && !normalized) {
    throw createError({ statusCode: 400, statusMessage: `${field} wajib diisi.` })
  }
  if (normalized.length > maxLength) {
    throw createError({
      statusCode: 400,
      statusMessage: `${field} maksimal ${maxLength} karakter.`,
    })
  }

  return normalized
}

function readBoolean(value: unknown, field: string) {
  if (typeof value !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: `${field} harus berupa boolean.` })
  }
  return value
}

function readHttpsUrl(value: unknown, field: string, googleMapsEmbed = false) {
  const normalized = readString(value, field, 2000)
  if (!normalized) return ''

  let url: URL
  try {
    url = new URL(normalized)
  } catch {
    throw createError({ statusCode: 400, statusMessage: `${field} bukan URL yang valid.` })
  }

  if (url.protocol !== 'https:') {
    throw createError({ statusCode: 400, statusMessage: `${field} harus menggunakan HTTPS.` })
  }

  if (googleMapsEmbed) {
    const googleHost = url.hostname === 'google.com' || url.hostname.endsWith('.google.com')
    if (!googleHost || !url.pathname.includes('/maps/embed')) {
      throw createError({
        statusCode: 400,
        statusMessage: `${field} harus berupa URL embed Google Maps.`,
      })
    }
  }

  return url.toString()
}

function readEmail(value: unknown) {
  const email = readString(value, 'Email', 254).toLowerCase()
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Format email tidak valid.' })
  }
  return email
}

function readPhone(value: unknown, field: string, whatsapp = false) {
  const phone = readString(value, field, whatsapp ? 20 : 40)
  if (!phone) return ''

  if (!/^[+\d()\s.-]+$/.test(phone)) {
    throw createError({ statusCode: 400, statusMessage: `${field} mengandung karakter tidak valid.` })
  }

  if (whatsapp) {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 8 || digits.length > 15) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nomor WhatsApp harus terdiri dari 8-15 digit termasuk kode negara.',
      })
    }
    return digits
  }

  return phone
}

function readExpectedEndTime(value: unknown) {
  if (value === null || value === '') return null
  if (typeof value !== 'string' && !(value instanceof Date)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Estimasi selesai maintenance tidak valid.',
    })
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Estimasi selesai maintenance tidak valid.',
    })
  }
  return parsed
}

export function sanitizeSettingsInput(value: unknown): PersistedSettingsInput {
  if (!isRecord(value)) {
    throw createError({ statusCode: 400, statusMessage: 'Payload pengaturan tidak valid.' })
  }

  assertAllowedKeys(
    value,
    [
      'siteName',
      'footerAddress',
      'socialMedia',
      'generalContacts',
      'copyrightText',
      'maintenanceMode',
      'updatedAt',
    ],
    'pengaturan'
  )

  if (!isRecord(value.footerAddress)) {
    throw createError({ statusCode: 400, statusMessage: 'Data alamat footer tidak valid.' })
  }
  if (!isRecord(value.socialMedia)) {
    throw createError({ statusCode: 400, statusMessage: 'Data media sosial tidak valid.' })
  }
  if (!isRecord(value.generalContacts)) {
    throw createError({ statusCode: 400, statusMessage: 'Data kontak umum tidak valid.' })
  }
  if (!isRecord(value.maintenanceMode)) {
    throw createError({ statusCode: 400, statusMessage: 'Data maintenance tidak valid.' })
  }

  assertAllowedKeys(
    value.footerAddress,
    ['headOffice', 'googleMapsEmbedUrl', 'googleMapsUrl'],
    'alamat footer'
  )
  assertAllowedKeys(
    value.socialMedia,
    ['instagram', 'linkedin', 'facebook', 'youtube'],
    'media sosial'
  )
  assertAllowedKeys(value.generalContacts, ['email', 'phone', 'whatsapp'], 'kontak umum')
  assertAllowedKeys(
    value.maintenanceMode,
    ['isActive', 'message', 'expectedEndTime'],
    'maintenance'
  )

  const isActive = readBoolean(value.maintenanceMode.isActive, 'Status maintenance')
  const message = readString(value.maintenanceMode.message, 'Pesan maintenance', 1000, isActive)

  return {
    siteName: readString(value.siteName, 'Nama situs', 160, true),
    footerAddress: {
      headOffice: readString(value.footerAddress.headOffice, 'Alamat kantor pusat', 1000),
      googleMapsEmbedUrl: readHttpsUrl(
        value.footerAddress.googleMapsEmbedUrl,
        'URL embed Google Maps',
        true
      ),
      googleMapsUrl: readHttpsUrl(value.footerAddress.googleMapsUrl, 'URL Google Maps'),
    },
    socialMedia: {
      instagram: readHttpsUrl(value.socialMedia.instagram, 'URL Instagram'),
      linkedin: readHttpsUrl(value.socialMedia.linkedin, 'URL LinkedIn'),
      facebook: readHttpsUrl(value.socialMedia.facebook, 'URL Facebook'),
      youtube: readHttpsUrl(value.socialMedia.youtube, 'URL YouTube'),
    },
    generalContacts: {
      email: readEmail(value.generalContacts.email),
      phone: readPhone(value.generalContacts.phone, 'Nomor telepon'),
      whatsapp: readPhone(value.generalContacts.whatsapp, 'Nomor WhatsApp', true),
    },
    copyrightText: readString(value.copyrightText, 'Teks copyright', 300),
    maintenanceMode: {
      isActive,
      message,
      expectedEndTime: readExpectedEndTime(value.maintenanceMode.expectedEndTime),
    },
  }
}

function normalizeSettings(value?: UnknownRecord | null): PublicAppSettings {
  const defaults = createDefaultAppSettings()
  const footerAddress = isRecord(value?.footerAddress) ? value.footerAddress : {}
  const socialMedia = isRecord(value?.socialMedia) ? value.socialMedia : {}
  const generalContacts = isRecord(value?.generalContacts) ? value.generalContacts : {}
  const maintenanceMode = isRecord(value?.maintenanceMode) ? value.maintenanceMode : {}
  const expectedEndTime = maintenanceMode.expectedEndTime
  const updatedAt = value?.updatedAt

  return {
    siteName: typeof value?.siteName === 'string' ? value.siteName : defaults.siteName,
    footerAddress: {
      headOffice:
        typeof footerAddress.headOffice === 'string'
          ? footerAddress.headOffice
          : defaults.footerAddress.headOffice,
      googleMapsEmbedUrl:
        typeof footerAddress.googleMapsEmbedUrl === 'string'
          ? footerAddress.googleMapsEmbedUrl
          : defaults.footerAddress.googleMapsEmbedUrl,
      googleMapsUrl:
        typeof footerAddress.googleMapsUrl === 'string'
          ? footerAddress.googleMapsUrl
          : defaults.footerAddress.googleMapsUrl,
    },
    socialMedia: {
      instagram:
        typeof socialMedia.instagram === 'string'
          ? socialMedia.instagram
          : defaults.socialMedia.instagram,
      linkedin:
        typeof socialMedia.linkedin === 'string'
          ? socialMedia.linkedin
          : defaults.socialMedia.linkedin,
      facebook:
        typeof socialMedia.facebook === 'string'
          ? socialMedia.facebook
          : defaults.socialMedia.facebook,
      youtube:
        typeof socialMedia.youtube === 'string' ? socialMedia.youtube : defaults.socialMedia.youtube,
    },
    generalContacts: {
      email:
        typeof generalContacts.email === 'string'
          ? generalContacts.email
          : defaults.generalContacts.email,
      phone:
        typeof generalContacts.phone === 'string'
          ? generalContacts.phone
          : defaults.generalContacts.phone,
      whatsapp:
        typeof generalContacts.whatsapp === 'string'
          ? generalContacts.whatsapp
          : defaults.generalContacts.whatsapp,
    },
    copyrightText:
      typeof value?.copyrightText === 'string' ? value.copyrightText : defaults.copyrightText,
    maintenanceMode: {
      isActive:
        typeof maintenanceMode.isActive === 'boolean'
          ? maintenanceMode.isActive
          : defaults.maintenanceMode.isActive,
      message:
        typeof maintenanceMode.message === 'string'
          ? maintenanceMode.message
          : defaults.maintenanceMode.message,
      expectedEndTime:
        expectedEndTime instanceof Date
          ? expectedEndTime.toISOString()
          : typeof expectedEndTime === 'string' && !Number.isNaN(Date.parse(expectedEndTime))
            ? new Date(expectedEndTime).toISOString()
            : null,
    },
    updatedAt:
      updatedAt instanceof Date
        ? updatedAt.toISOString()
        : typeof updatedAt === 'string' && !Number.isNaN(Date.parse(updatedAt))
          ? new Date(updatedAt).toISOString()
          : null,
  }
}

export function invalidateSettingsCache() {
  settingsCache = null
}

export async function getPublicSettings(options: { fresh?: boolean } = {}) {
  const now = Date.now()
  if (!options.fresh && settingsCache && settingsCache.expiresAt > now) {
    return settingsCache.value
  }

  await connectDB()
  const document = await Setting.findOne({ key: 'global' }).lean()
  const value = normalizeSettings(document as unknown as UnknownRecord | null)
  settingsCache = { value, expiresAt: now + CACHE_TTL_MS }
  return value
}

export async function updatePublicSettings(input: unknown) {
  const settings = sanitizeSettingsInput(input)
  await connectDB()

  const document = await Setting.findOneAndUpdate(
    { key: 'global' },
    {
      $set: {
        siteName: settings.siteName,
        footerAddress: settings.footerAddress,
        socialMedia: settings.socialMedia,
        generalContacts: settings.generalContacts,
        copyrightText: settings.copyrightText,
        maintenanceMode: settings.maintenanceMode,
      },
      $setOnInsert: { key: 'global' },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  ).lean()

  invalidateSettingsCache()
  return normalizeSettings(document as unknown as UnknownRecord)
}
