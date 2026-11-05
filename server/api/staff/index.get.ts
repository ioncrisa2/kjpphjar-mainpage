import { Branch } from '~/server/models/Branch'
import { Staff } from '~/server/models/Staff'
import { connectDB } from '~/server/utils/db'
import { listPublicStaffByBranch } from '~/server/utils/staff'

export default defineEventHandler(async (event) => {
  await connectDB()

  // Panel admin (dijaga middleware admin-auth: staff.view): semua staff, termasuk nonaktif.
  if (getQuery(event).admin === 'true') {
    return Staff.find()
      .populate({ path: 'branchId', model: Branch, select: 'name city' })
      .sort({ order: 1, name: 1 })
      .lean()
  }

  return listPublicStaffByBranch()
})
