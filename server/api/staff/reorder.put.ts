import mongoose from 'mongoose'
import { Staff } from '~/server/models/Staff'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const body = await readBody(event)

  let ids: string[] = []
  if (Array.isArray(body?.staffIds)) {
    ids = body.staffIds.map((id: unknown) => String(id))
  } else if (Array.isArray(body?.items)) {
    ids = body.items.map((item: any) => String(item._id || item.id || item))
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Payload staffIds atau items array diperlukan.' })
  }

  const validIds = ids.filter((id) => mongoose.isValidObjectId(id))
  if (validIds.length === 0) {
    return { success: true, message: 'Tidak ada data staff untuk diperbarui.' }
  }

  const bulkOps = validIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { order: index } },
    },
  }))

  await Staff.bulkWrite(bulkOps)

  return { success: true, message: 'Urutan staff berhasil diperbarui.' }
})
