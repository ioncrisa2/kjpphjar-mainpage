import { hasPermission, type SessionUser } from '~/server/utils/require-auth'
import type { Permission } from '~/shared/permissions'

interface OwnedRecord {
  createdBy?: unknown
}

/** Data lama tanpa createdBy dianggap milik admin, bukan milik siapa pun. */
export function isRecordOwner(user: SessionUser, record: OwnedRecord | null | undefined) {
  return Boolean(record?.createdBy) && String(record?.createdBy) === user.id
}

export function canManageRecord(
  user: SessionUser,
  record: OwnedRecord | null | undefined,
  manageAllPermission: Permission,
) {
  return hasPermission(user, manageAllPermission) || isRecordOwner(user, record)
}

export function assertCanManageRecord(
  user: SessionUser,
  record: OwnedRecord | null | undefined,
  manageAllPermission: Permission,
  message = 'Anda hanya dapat mengelola data milik sendiri.',
) {
  if (!canManageRecord(user, record, manageAllPermission)) {
    throw createError({ statusCode: 403, statusMessage: message })
  }
}

/** Filter daftar: semua data bagi pemegang manage_all, selain itu milik sendiri. */
export function ownedRecordsFilter(
  user: SessionUser,
  manageAllPermission: Permission,
): Record<string, unknown> {
  return hasPermission(user, manageAllPermission) ? {} : { createdBy: user.id }
}

/** Field kepemilikan tidak perlu terlihat di respons publik. */
export const OWNERSHIP_FIELDS_EXCLUSION = '-createdBy -updatedBy'
