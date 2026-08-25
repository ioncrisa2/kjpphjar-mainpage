import { ContactSubmission } from '~/server/models/ContactSubmission'
import { connectDB } from '~/server/utils/db'
import { sendContactNotification } from '~/server/utils/mailer'
import xss from 'xss'

export default defineEventHandler(async (event) => {
  await connectDB()

  const body = await readBody(event)
  const { fullname, email, message, phone, city, branch } = body

  // Type casting to prevent NoSQL Injection and XSS sanitization
  const safeFullname = xss(String(fullname || '')).trim()
  const safeEmail = xss(String(email || '')).trim().toLowerCase()
  const safeMessage = xss(String(message || '')).trim()
  const safePhone = phone ? xss(String(phone)).trim() : undefined
  const safeCity = city ? xss(String(city)).trim() : undefined
  const safeBranch = branch ? xss(String(branch)).trim() : undefined

  // Validation
  if (!safeFullname) throw createError({ statusCode: 400, statusMessage: 'Nama lengkap wajib diisi' })
  if (!safeEmail) throw createError({ statusCode: 400, statusMessage: 'Email wajib diisi' })
  if (!safeMessage) throw createError({ statusCode: 400, statusMessage: 'Pesan wajib diisi' })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(safeEmail)) throw createError({ statusCode: 400, statusMessage: 'Format email tidak valid' })

  const submittedAt = new Date()

  const submission = await ContactSubmission.create({
    fullname: safeFullname,
    email: safeEmail,
    message: safeMessage,
    phone: safePhone,
    city: safeCity,
    branch: safeBranch,
    submittedAt,
    isRead: false,
  })

  // Send email notification (non-blocking — don't fail the request if email fails)
  sendContactNotification({
    fullname: safeFullname,
    email: safeEmail,
    phone: safePhone,
    city: safeCity,
    message: safeMessage,
    submittedAt
  }).catch((err) => {
    console.error('[Contacts] Failed to send email notification:', err)
  })

  return {
    success: true,
    message: 'Pesan Anda telah berhasil dikirim. Kami akan segera menghubungi Anda.',
  }
})
