import mongoose from 'mongoose'
import { Branch } from '~/server/models/Branch'
import { Staff } from '~/server/models/Staff'
import { sanitizePlainText } from '~/server/utils/blog'
import type { PublicStaffGroup, PublicStaffMember } from '~/types/staff'

const MAX_ORDER = 9999

export async function readStaffInput(body: unknown) {
  const input = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>
  const name = sanitizePlainText(input.name, 200)
  const position = sanitizePlainText(input.position, 200)
  const mappiNumber = sanitizePlainText(input.mappiNumber, 100)
  const branchId = String(input.branchId ?? '')
  const order = Number(input.order ?? 0)
  const isActive = input.isActive !== false && input.isActive !== 'false'

  if (!name) throw createError({ statusCode: 400, statusMessage: 'Nama staff wajib diisi.' })
  if (!position) throw createError({ statusCode: 400, statusMessage: 'Jabatan wajib diisi.' })
  if (!mongoose.isValidObjectId(branchId) || !await Branch.exists({ _id: branchId })) {
    throw createError({ statusCode: 400, statusMessage: 'Kantor penempatan tidak ditemukan.' })
  }
  if (!Number.isInteger(order) || order < 0 || order > MAX_ORDER) {
    throw createError({ statusCode: 400, statusMessage: `Urutan tampil harus bilangan bulat 0–${MAX_ORDER}.` })
  }

  return { name, position, branchId, mappiNumber, order, isActive }
}

/**
 * Staff aktif di kantor aktif, dikelompokkan per kantor sesuai urutan kantor.
 * Hanya kolom yang aman untuk publik yang dikirim.
 */
export async function listPublicStaffByBranch(): Promise<PublicStaffGroup[]> {
  const [branches, staff] = await Promise.all([
    Branch.find({ isActive: true }).select('name city').sort({ order: 1, name: 1 }).lean(),
    // Data lama belum punya isActive: anggap aktif.
    Staff.find({ isActive: { $ne: false } })
      .select('name position mappiNumber branchId')
      .sort({ order: 1, name: 1 })
      .lean(),
  ])

  const staffByBranch = new Map<string, PublicStaffMember[]>()
  for (const member of staff as any[]) {
    const key = String(member.branchId)
    const list = staffByBranch.get(key) ?? []
    list.push({
      _id: String(member._id),
      name: member.name,
      position: member.position,
      mappiNumber: member.mappiNumber || '',
    })
    staffByBranch.set(key, list)
  }

  return (branches as any[])
    .map((branch) => ({
      branch: { _id: String(branch._id), name: branch.name, city: branch.city },
      staff: staffByBranch.get(String(branch._id)) ?? [],
    }))
    .filter((group) => group.staff.length > 0)
}
