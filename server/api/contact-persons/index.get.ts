import { ContactPerson } from '~/server/models/ContactPerson'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  
  const query = getQuery(event)
  const filter: any = {}
  
  if (query.activeOnly === 'true') {
    filter.isActive = true
  }

  const contacts = await ContactPerson.find(filter).sort({ order: 1, createdAt: 1 })
  
  return contacts
})
