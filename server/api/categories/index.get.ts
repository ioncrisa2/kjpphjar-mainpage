import { Category } from '~/server/models/Category'
import { connectDB } from '~/server/utils/db'
import { toCategoryDto } from '~/server/utils/blog'

export default defineEventHandler(async () => {
  await connectDB()
  const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean()
  return { items: categories.map((category) => toCategoryDto(category as any)) }
})
