import { requirePermission } from '~/server/utils/require-auth'
import { updatePublicSettings } from '~/server/utils/settings'

export default defineEventHandler(async (event) => {
  await requirePermission(event, 'settings.manage')
  const body = await readBody(event)
  const settings = await updatePublicSettings(body)

  setResponseHeaders(event, {
    'Cache-Control': 'private, no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff',
  })

  return {
    success: true,
    message: 'Pengaturan berhasil disimpan.',
    settings,
  }
})
