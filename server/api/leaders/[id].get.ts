import mongoose from 'mongoose'
import { Leader } from '~/server/models/Leader'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Pimpinan tidak ditemukan' })
  }

  // Pimpinan nonaktif disembunyikan dari publik, sama seperti daftar di halaman Tentang Kami
  const leader = await Leader.findOne({ _id: id, isActive: true }).lean()
  if (!leader) {
    throw createError({ statusCode: 404, statusMessage: 'Pimpinan tidak ditemukan' })
  }

  return leader
})
