import { ContactSubmission } from '~/server/models/ContactSubmission'
import { connectDB } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/require-admin'

function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '""'
  const str = String(val).replace(/"/g, '""')
  return `"${str}"`
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  await connectDB()

  const items = await ContactSubmission.find().sort({ submittedAt: -1 }).lean()

  const headers = [
    'No',
    'Tanggal Kirim',
    'Waktu (WIB)',
    'Nama Pengirim',
    'Email',
    'Telepon',
    'Kota/Lokasi',
    'Isi Pesan',
    'Status',
  ]

  const rows = items.map((item, index) => {
    const date = new Date(item.submittedAt)
    const dateStr = date.toLocaleDateString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    const timeStr = date.toLocaleTimeString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
    })

    return [
      escapeCsvCell(index + 1),
      escapeCsvCell(dateStr),
      escapeCsvCell(timeStr),
      escapeCsvCell(item.fullname),
      escapeCsvCell(item.email),
      escapeCsvCell(item.phone || '-'),
      escapeCsvCell(item.city || '-'),
      escapeCsvCell(item.message),
      escapeCsvCell(item.isRead ? 'Sudah Dibaca' : 'Belum Dibaca'),
    ].join(',')
  })

  // \uFEFF is UTF-8 BOM to ensure Excel opens Indonesian accents/symbols without garbling
  const csvContent = '\uFEFF' + [headers.map(escapeCsvCell).join(','), ...rows].join('\r\n')

  const now = new Date()
  const fileDate = now.toISOString().slice(0, 10)
  const filename = `inbox-kontak-kjpphjar-${fileDate}.csv`

  setResponseHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)
  setResponseHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')

  return csvContent
})
