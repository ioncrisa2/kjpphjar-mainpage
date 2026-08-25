import { ContactPerson } from '~/server/models/ContactPerson'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID kontak tidak ditemukan' })
  }

  const body = await readBody(event)
  
  const contact = await ContactPerson.findByIdAndUpdate(id, body, { new: true })
  if (!contact) {
    throw createError({ statusCode: 404, statusMessage: 'Kontak tidak ditemukan' })
  }
  
  return contact
})
