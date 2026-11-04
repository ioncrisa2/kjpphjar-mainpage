import { Branch } from '~/server/models/Branch'
import { Staff } from '~/server/models/Staff'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async () => {
  await connectDB()
  const staff = await Staff.find()
    .populate({ path: 'branchId', model: Branch, select: 'name city' })
    .sort({ name: 1 })
    .lean()
  return staff
})
