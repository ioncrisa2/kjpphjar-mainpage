import { Staff } from '~/server/models/Staff'
import { connectDB } from '~/server/utils/db'
import { readStaffInput } from '~/server/utils/staff'

export default defineEventHandler(async (event) => {
  await connectDB()
  const input = await readStaffInput(await readBody(event))
  const staff = await Staff.create(input)
  return staff
})
