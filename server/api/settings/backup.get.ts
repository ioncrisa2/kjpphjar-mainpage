import { createHash } from 'node:crypto'
import { createLogicalBackup } from '~/server/utils/database-backup'
import { requireAdmin } from '~/server/utils/require-admin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const backup = await createLogicalBackup()
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_')
  const filename = `kjpphjar-backup_${timestamp}.json`
  const checksum = createHash('sha256').update(backup).digest('hex')

  setResponseHeaders(event, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-Length': String(Buffer.byteLength(backup)),
    'Cache-Control': 'private, no-store, max-age=0',
    Pragma: 'no-cache',
    Expires: '0',
    'X-Content-Type-Options': 'nosniff',
    'X-Backup-SHA256': checksum,
  })

  return backup
})
