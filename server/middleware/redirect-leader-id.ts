import mongoose from 'mongoose'
import { Leader } from '~/server/models/Leader'
import { connectDB } from '~/server/utils/db'
import { toLeaderSlug } from '~/server/utils/leader'

const LEADER_ID_PATH_RE = /^\/pimpinan\/([a-f0-9]{24})\/?(?:\?(.*))?$/i

export default defineEventHandler(async (event) => {
  const reqUrl = event.node.req.url || ''
  const match = LEADER_ID_PATH_RE.exec(reqUrl)
  if (!match) return

  const leaderId = match[1]
  const queryString = match[2] ? `?${match[2]}` : ''
  if (!mongoose.isValidObjectId(leaderId)) return

  await connectDB()
  const leader = await Leader.findOne({ _id: leaderId, isActive: true }).select('name slug').lean()
  if (!leader) return

  const slug = toLeaderSlug((leader as any).name, (leader as any).slug)
  if (!slug) return

  return sendRedirect(event, `/pimpinan/${slug}${queryString}`, 301)
})
