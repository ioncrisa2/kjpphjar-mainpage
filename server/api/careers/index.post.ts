import { Career } from '~/server/models/Career'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const body = await readBody(event)
  
  if (body.requirements && typeof body.requirements === 'string') {
    body.requirements = body.requirements.split('\n').filter((line: string) => line.trim())
  }
  
  const career = new Career({
    ...body,
    postedAt: new Date()
  })

  await career.save()
  return career
})
