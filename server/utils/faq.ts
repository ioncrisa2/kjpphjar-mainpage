import { sanitizeBlogContent, sanitizePlainText, stripHtml } from '~/server/utils/blog'

const htmlTagPattern = /<\/?[a-z][^>]*>/i

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Jawaban lama tersimpan sebagai teks biasa dengan baris kosong sebagai pemisah paragraf
function plainTextToHtml(value: string) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

export function sanitizeFaqAnswer(value: unknown) {
  const source = String(value ?? '').replace(/\r\n?/g, '\n').trim()
  return sanitizeBlogContent(htmlTagPattern.test(source) ? source : plainTextToHtml(source))
}

export function readFaqInput(body: unknown) {
  const input = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>
  const question = sanitizePlainText(input.question)
  const answer = sanitizeFaqAnswer(input.answer)

  if (!question) throw createError({ statusCode: 400, statusMessage: 'Pertanyaan wajib diisi.' })
  if (!stripHtml(answer)) throw createError({ statusCode: 400, statusMessage: 'Jawaban wajib diisi.' })

  return {
    question,
    answer,
    isActive: typeof input.isActive === 'boolean' ? input.isActive : true,
  }
}
