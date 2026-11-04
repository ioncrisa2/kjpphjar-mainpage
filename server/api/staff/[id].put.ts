import mongoose from 'mongoose'
import { Staff } from '~/server/models/Staff'
import { connectDB } from '~/server/utils/db'
import { readStaffInput } from '~/server/utils/staff'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Staff tidak ditemukan' })
  }

  const input = await readStaffInput(await readBody(event))
  const updated = await Staff.findByIdAndUpdate(id, input, { new: true, runValidators: true })
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Staff tidak ditemukan' })
  }

  return updated
})
