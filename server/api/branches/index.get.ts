import { Branch } from '~/server/models/Branch'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const branches = await Branch.find({ isActive: true }).sort({ order: 1 }).lean()
  return branches
})
