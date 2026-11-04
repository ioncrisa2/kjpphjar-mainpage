import mongoose from 'mongoose'
import { Staff } from '~/server/models/Staff'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Staff tidak ditemukan' })
  }

  const staff = await Staff.findByIdAndDelete(id)
  if (!staff) {
    throw createError({ statusCode: 404, statusMessage: 'Staff tidak ditemukan' })
  }

  return { success: true, message: 'Staff berhasil dihapus' }
})
