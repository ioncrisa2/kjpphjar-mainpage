import { ContactSubmission } from '~/server/models/ContactSubmission'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async () => {
  await connectDB()
  const unread = await ContactSubmission.countDocuments({ isRead: false })
  return { unread }
})
