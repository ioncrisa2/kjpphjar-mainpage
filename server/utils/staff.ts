import mongoose from 'mongoose'
import { Branch } from '~/server/models/Branch'
import { sanitizePlainText } from '~/server/utils/blog'

export async function readStaffInput(body: unknown) {
  const input = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>
  const name = sanitizePlainText(input.name, 200)
  const position = sanitizePlainText(input.position, 200)
  const mappiNumber = sanitizePlainText(input.mappiNumber, 100)
  const branchId = String(input.branchId ?? '')

  if (!name) throw createError({ statusCode: 400, statusMessage: 'Nama staff wajib diisi.' })
  if (!position) throw createError({ statusCode: 400, statusMessage: 'Jabatan wajib diisi.' })
  if (!mongoose.isValidObjectId(branchId) || !await Branch.exists({ _id: branchId })) {
    throw createError({ statusCode: 400, statusMessage: 'Kantor penempatan tidak ditemukan.' })
  }

  return { name, position, branchId, mappiNumber }
}
