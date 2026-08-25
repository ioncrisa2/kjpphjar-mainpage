import { ContactPerson } from '~/server/models/ContactPerson'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID kontak tidak ditemukan' })
  }

  const contact = await ContactPerson.findByIdAndDelete(id)
  if (!contact) {
    throw createError({ statusCode: 404, statusMessage: 'Kontak tidak ditemukan' })
  }
  
  return { message: 'Kontak berhasil dihapus' }
})
