// Toolbar ringkas untuk jawaban FAQ: tanpa heading (bentrok dengan judul pertanyaan) dan tanpa gambar
export const FAQ_EDITOR_TOOLBAR = [
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link'],
  ['clean'],
]

// Quill menyimpan editor kosong sebagai "<p></p>", jadi cek isi teksnya
export const hasRichTextContent = (html: string): boolean =>
  html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length > 0
