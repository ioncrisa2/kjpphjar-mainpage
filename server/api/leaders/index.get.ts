import { Leader } from '~/server/models/Leader'
import { connectDB } from '~/server/utils/db'
import { withLeaderSlug } from '~/server/utils/leader'

export default defineEventHandler(async () => {
  await connectDB()
  const leaders = await Leader.find({ isActive: true }).sort({ order: 1 }).lean()
  return leaders.map((leader: any) => withLeaderSlug(leader))
})
