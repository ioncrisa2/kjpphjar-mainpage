import mongoose from 'mongoose'
import { Client } from '~/server/models/Client'
import { connectDB } from '~/server/utils/db'
import { deleteAsset } from '~/server/utils/media-storage'
import { assertCanManageRecord } from '~/server/utils/ownership'
import { requireAuth } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  await connectDB()
  const id = getRouterParam(event, 'id')
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Klien tidak ditemukan' })
  }

  const client = await Client.findById(id)
  if (!client) {
    throw createError({ statusCode: 404, statusMessage: 'Klien tidak ditemukan' })
  }
  assertCanManageRecord(user, client, 'clients.manage_all', 'Anda hanya dapat menghapus klien milik sendiri.')
  await client.deleteOne()

  if (client.logoUrl) {
    await deleteAsset(client.logoUrl).catch((cleanupError) => {
      console.error('Gagal membersihkan logo klien yang dihapus:', cleanupError)
    })
  }

  return { success: true, message: 'Klien berhasil dihapus' }
})
