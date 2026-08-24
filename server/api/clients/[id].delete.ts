import { Client } from '~/server/models/Client'
import { connectDB } from '~/server/utils/db'
import { deleteFile } from '~/server/utils/image'
import path from 'path'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')

  const client = await Client.findByIdAndDelete(id)
  if (!client) {
    throw createError({ statusCode: 404, statusMessage: 'Klien tidak ditemukan' })
  }

  if (client.logoUrl) {
    deleteFile(path.join(process.cwd(), 'public', client.logoUrl))
  }

  return { success: true, message: 'Klien berhasil dihapus' }
})
