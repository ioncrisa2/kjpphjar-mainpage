import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { buildDownloadFilename } from '../utils/download.ts'

describe('buildDownloadFilename', () => {
  it('membentuk nama file bersih dari judul dengan ekstensi asli', () => {
    const name = buildDownloadFilename({
      title: 'Rapat Tahunan: KJPP HJA\'R / 2026',
      filename: '170000-photo.webp',
      url: '/uploads/gallery/original/170000-photo.webp',
    })
    assert.equal(name, "rapat-tahunan-kjpp-hja'r-2026.webp")
  })

  it('memakai filename asli jika judul kosong atau hanya karakter terlarang', () => {
    assert.equal(
      buildDownloadFilename({
        title: '   ',
        filename: 'abc-123.png',
        url: '/uploads/gallery/original/abc-123.png',
      }),
      'abc-123.png'
    )
    assert.equal(
      buildDownloadFilename({
        title: '///:::',
        filename: 'abc-123.jpg',
      }),
      'abc-123.jpg'
    )
  })

  it('memakai fallbackBase jika judul dan filename kosong', () => {
    assert.equal(
      buildDownloadFilename({
        url: '/uploads/gallery/original/foto.webp?v=1',
        fallbackBase: 'galeri-42',
      }),
      'galeri-42.webp'
    )
  })
})
