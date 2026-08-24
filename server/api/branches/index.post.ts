import { Branch } from '~/server/models/Branch'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const body = await readBody(event)
  
  const branch = new Branch(body)
  await branch.save()
  
  return branch
})
