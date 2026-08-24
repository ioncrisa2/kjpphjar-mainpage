import { Branch } from '~/server/models/Branch'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')

  const branch = await Branch.findByIdAndDelete(id)
  if (!branch) {
    throw createError({ statusCode: 404, statusMessage: 'Cabang tidak ditemukan' })
  }

  return { success: true, message: 'Cabang berhasil dihapus' }
})
