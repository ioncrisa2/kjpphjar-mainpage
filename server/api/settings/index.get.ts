import { getPublicSettings } from '~/server/utils/settings'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Cache-Control': 'private, no-store, max-age=0',
    Pragma: 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  })

  return getPublicSettings()
})
