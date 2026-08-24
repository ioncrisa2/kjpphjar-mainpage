import nodemailer from 'nodemailer'

interface ContactData {
  fullname: string
  email: string
  phone?: string
  city?: string
  message: string
  submittedAt: Date
}

function createTransporter() {
  const config = useRuntimeConfig()
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: config.smtpSecure === 'true',
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  })
}

export async function sendContactNotification(data: ContactData) {
  const config = useRuntimeConfig()

  // Skip in dev if SMTP not configured
  if (!config.smtpHost || !config.smtpUser) {
    console.warn('[Mailer] SMTP not configured, skipping email send')
    return
  }

  const transporter = createTransporter()

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #47BDFF; padding: 20px; border-radius: 12px 12px 0 0;">
        <h2 style="color: #08111F; margin: 0;">Pesan Kontak Baru — KJPP HJA'R</h2>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; font-weight: bold; width: 130px; color: #555;">Nama</td>
            <td style="padding: 10px 0;">: ${data.fullname}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #555;">Email</td>
            <td style="padding: 10px 0;">: <a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #555;">Telepon</td>
            <td style="padding: 10px 0;">: ${data.phone || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #555;">Kota</td>
            <td style="padding: 10px 0;">: ${data.city || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #555; vertical-align: top;">Pesan</td>
            <td style="padding: 10px 0;">:<br/><br/>${data.message.replace(/\n/g, '<br/>')}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #555;">Waktu</td>
            <td style="padding: 10px 0;">: ${new Date(data.submittedAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
        <p style="color: #999; font-size: 12px; margin: 0;">
          Email ini dikirim otomatis dari form kontak website KJPP HJA'R.
          Balas langsung ke email pengirim untuk merespons.
        </p>
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"KJPP HJA'R Website" <${config.smtpUser}>`,
    to: config.mailTo,
    replyTo: data.email,
    subject: `[Kontak Website] Pesan dari ${data.fullname}`,
    html,
  })

  console.log(`[Mailer] Notification sent to ${config.mailTo}`)
}
