import slugify from 'slugify'
import mongoose from 'mongoose'
import { Leader, type ILeader } from '~/server/models/Leader'

export function toLeaderSlug(name?: string | null, existingSlug?: string | null): string {
  const candidate = (existingSlug || '').trim()
  if (candidate && !mongoose.isValidObjectId(candidate)) {
    return slugify(candidate, { lower: true, strict: true, trim: true })
  }
  return slugify(String(name || ''), { lower: true, strict: true, trim: true })
}

export function withLeaderSlug<T extends { name?: string; slug?: string }>(leader: T): T & { slug: string } {
  return {
    ...leader,
    slug: toLeaderSlug(leader.name, leader.slug),
  }
}

export async function findActiveLeaderByParam(param: string): Promise<(ILeader & { _id: any; slug: string }) | null> {
  const cleanParam = String(param || '').trim()
  if (!cleanParam) return null

  if (mongoose.isValidObjectId(cleanParam)) {
    const byId = await Leader.findOne({ _id: cleanParam, isActive: true }).lean()
    if (byId) return withLeaderSlug(byId as any)
  }

  const normalizedSlug = slugify(cleanParam, { lower: true, strict: true, trim: true })
  if (!normalizedSlug) return null

  const bySlug = await Leader.findOne({ slug: normalizedSlug, isActive: true }).lean()
  if (bySlug) return withLeaderSlug(bySlug as any)

  const activeLeaders = await Leader.find({ isActive: true }).lean()
  const matched = activeLeaders.find((item: any) => toLeaderSlug(item.name, item.slug) === normalizedSlug)
  return matched ? withLeaderSlug(matched as any) : null
}
