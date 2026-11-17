import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  await connectDB()

  const rows = await BlogPost.aggregate([
    { $unwind: '$tags' },
    { $match: { tags: { $type: 'string', $ne: '' } } },
    {
      $group: {
        _id: { $toLower: '$tags' },
        name: { $first: '$tags' },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1, name: 1 } },
    { $limit: 50 },
    { $project: { _id: 0, name: 1, count: 1 } },
  ])

  return { items: rows }
})
