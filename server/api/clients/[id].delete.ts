import { Client } from '~/server/models/Client'
import { connectDB } from '~/server/utils/db'
import { deleteAsset } from '~/server/utils/media-storage'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')

  const client = await Client.findByIdAndDelete(id)
  if (!client) {
    throw createError({ statusCode: 404, statusMessage: 'Klien tidak ditemukan' })
  }

  if (client.logoUrl) {
    await deleteAsset(client.logoUrl).catch((cleanupError) => {
      console.error('Gagal membersihkan logo klien yang dihapus:', cleanupError)
    })
  }

  return { success: true, message: 'Klien berhasil dihapus' }
})
