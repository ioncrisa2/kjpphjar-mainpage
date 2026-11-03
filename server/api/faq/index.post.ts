import { Faq } from '~/server/models/Faq'
import { connectDB } from '~/server/utils/db'
import { readFaqInput } from '~/server/utils/faq'

export default defineEventHandler(async (event) => {
  await connectDB()

  const input = readFaqInput(await readBody(event))

  // Get max order
  const lastFaq = await Faq.findOne().sort({ order: -1 }).select('order').lean()
  const order = lastFaq ? (lastFaq.order || 0) + 1 : 0

  const faq = await Faq.create({ ...input, order })
  return faq
})
