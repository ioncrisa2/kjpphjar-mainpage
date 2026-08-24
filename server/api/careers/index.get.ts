import { Career } from '~/server/models/Career'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async () => {
  await connectDB()
  // Hanya ambil lowongan yang aktif dan batas waktu belum lewat (jika ada batas waktu)
  const today = new Date()
  const items = await Career.find({
    isActive: true,
    $or: [
      { closingDate: { $exists: false } },
      { closingDate: null },
      { closingDate: { $gte: today } }
    ]
  }).sort({ postedAt: -1 }).lean()

  return items
})
