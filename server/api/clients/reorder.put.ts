import { Client } from '~/server/models/Client'
import { connectDB } from '~/server/utils/db'
import { requirePermission } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  // Mengurutkan menyentuh semua klien, termasuk milik orang lain.
  await requirePermission(event, 'clients.manage_all')
  await connectDB()
  const body = await readBody(event)

  if (!body.clientIds || !Array.isArray(body.clientIds)) {
    throw createError({ statusCode: 400, statusMessage: 'clientIds array is required' })
  }

  // Update order for each client based on their index in the array
  const updates = body.clientIds.map((id: string, index: number) => {
    return Client.findByIdAndUpdate(id, { order: index })
  })

  await Promise.all(updates)

  return { success: true, message: 'Urutan berhasil diperbarui' }
})
