import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { buildBlogArticleWithToc } from '../utils/blog-content.ts'

describe('buildBlogArticleWithToc', () => {
  it('menormalkan H1 ke H2 dan menghasilkan anchor id unik untuk TOC', () => {
    const input = '<h1>Pendahuluan</h1><p>Isi</p><h2>Metode Penilaian</h2><h3>Pendekatan Pasar</h3><h2>Metode Penilaian</h2>'
    const { html, toc } = buildBlogArticleWithToc(input)

    assert.equal(toc.length, 4)
    assert.deepEqual(toc, [
      { id: 'pendahuluan', text: 'Pendahuluan', level: 2 },
      { id: 'metode-penilaian', text: 'Metode Penilaian', level: 2 },
      { id: 'pendekatan-pasar', text: 'Pendekatan Pasar', level: 3 },
      { id: 'metode-penilaian-2', text: 'Metode Penilaian', level: 2 },
    ])
    assert.ok(html.includes('<h2 id="pendahuluan">Pendahuluan</h2>'))
    assert.ok(html.includes('<h2 id="metode-penilaian-2">Metode Penilaian</h2>'))
    assert.ok(!/<h1\b/i.test(html))
  })

  it('menaikkan H3 ke H2 dan H4 ke H3 bila artikel belum memiliki H2', () => {
    const input = '<h3>Bagian A</h3><h4>Sub Bagian</h4>'
    const { html, toc } = buildBlogArticleWithToc(input)

    assert.deepEqual(toc, [
      { id: 'bagian-a', text: 'Bagian A', level: 2 },
      { id: 'sub-bagian', text: 'Sub Bagian', level: 3 },
    ])
    assert.ok(html.includes('<h2 id="bagian-a">Bagian A</h2>'))
    assert.ok(html.includes('<h3 id="sub-bagian">Sub Bagian</h3>'))
  })
})
