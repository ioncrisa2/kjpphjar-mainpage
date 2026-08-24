import { Leader } from '~/server/models/Leader'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const leaders = await Leader.find({ isActive: true }).sort({ order: 1 }).lean()
  return leaders
})
