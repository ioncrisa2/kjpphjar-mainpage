import { ContactPerson } from '~/server/models/ContactPerson'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const body = await readBody(event)
  
  // Set default order to be the last one if not provided
  if (body.order === undefined) {
    const lastContact = await ContactPerson.findOne().sort({ order: -1 })
    body.order = lastContact ? (lastContact.order || 0) + 1 : 0
  }
  
  const contact = new ContactPerson(body)
  await contact.save()
  
  return contact
})
