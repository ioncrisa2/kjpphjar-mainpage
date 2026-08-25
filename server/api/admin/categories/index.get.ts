import { Category } from '~/server/models/Category'
import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'
import { toCategoryDto } from '~/server/utils/blog'

export default defineEventHandler(async () => {
  await connectDB()
  const [categories, counts] = await Promise.all([
    Category.find({}).sort({ name: 1 }).lean(),
    BlogPost.aggregate<{ _id: string; count: number }>([
      { $match: { categoryId: { $ne: null } } },
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    ]),
  ])
  const countById = new Map(counts.map((item) => [String(item._id), item.count]))

  return {
    items: categories.map((category) => ({
      ...toCategoryDto(category as any),
      articleCount: countById.get(String(category._id)) || 0,
    })),
  }
})
