import { ContactSubmission } from '~/server/models/ContactSubmission'
import { connectDB } from '~/server/utils/db'
import { sendContactNotification } from '~/server/utils/mailer'

export default defineEventHandler(async (event) => {
  await connectDB()

  const body = await readBody(event)
  const { fullname, email, message, phone, city, branch } = body

  // Validation
  if (!fullname?.trim()) throw createError({ statusCode: 400, statusMessage: 'Nama lengkap wajib diisi' })
  if (!email?.trim()) throw createError({ statusCode: 400, statusMessage: 'Email wajib diisi' })
  if (!message?.trim()) throw createError({ statusCode: 400, statusMessage: 'Pesan wajib diisi' })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) throw createError({ statusCode: 400, statusMessage: 'Format email tidak valid' })

  const submittedAt = new Date()

  const submission = await ContactSubmission.create({
    fullname: fullname.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
    phone: phone?.trim() || undefined,
    city: city?.trim() || undefined,
    branch: branch?.trim() || undefined,
    submittedAt,
    isRead: false,
  })

  // Send email notification (non-blocking — don't fail the request if email fails)
  sendContactNotification({ fullname, email, phone, city, message, submittedAt }).catch((err) => {
    console.error('[Contacts] Failed to send email notification:', err)
  })

  return {
    success: true,
    message: 'Pesan Anda telah berhasil dikirim. Kami akan segera menghubungi Anda.',
  }
})
