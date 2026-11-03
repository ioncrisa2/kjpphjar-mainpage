import { Faq } from '~/server/models/Faq'
import { connectDB } from '~/server/utils/db'
import { readFaqInput } from '~/server/utils/faq'

export default defineEventHandler(async (event) => {
  await connectDB()

  const id = getRouterParam(event, 'id')
  const input = readFaqInput(await readBody(event))

  const faq = await Faq.findByIdAndUpdate(id, input, { new: true })

  if (!faq) {
    throw createError({ statusCode: 404, statusMessage: 'FAQ not found' })
  }

  return faq
})
