<script setup lang="ts">
import lightGallery from 'lightgallery'
import lgZoom from 'lightgallery/plugins/zoom'
import { COMPANY_DATA, sanitizeJsonLd } from '~/shared/company-data'
import { buildBlogArticleWithToc } from '~/utils/blog-content'

const route = useRoute()
const slug = route.params.slug as string
const { data: article, pending, error } = await useFetch(`/api/blog/${slug}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
}

if (article.value?.redirectedFromSlug && article.value?.slug && article.value.slug !== slug) {
  await navigateTo(`/blog/${article.value.slug}`, { redirectCode: 301 })
}

const { data: relatedData } = await useFetch(`/api/blog/${slug}/related`)
const relatedArticles = computed(() => relatedData.value?.items || [])
const config = useRuntimeConfig()
const baseUrl = String(config.public.baseUrl || 'https://kjpp-hjar.co.id').replace('://www.', '://').replace(/\/$/, '')
const canonicalUrl = computed(() => `${baseUrl}/blog/${article.value?.slug || slug}`)
const defaultOgImage = `${baseUrl}/assets/images/og-default.jpg`
const absoluteCover = computed(() => {
  const cover = article.value?.coverImageUrl || ''
  if (!cover) return defaultOgImage
  return /^https?:\/\//i.test(cover) ? cover : `${baseUrl}${cover.startsWith('/') ? '' : '/'}${cover}`
})
const seoTitle = computed(() => {
  const raw = String(article.value?.metaTitle || article.value?.title || 'Blog').trim()
  return raw.replace(/\s*[|–-]\s*(?:KJPP\s+)?HJA['’]R\s*$/i, '').trim() || 'Blog'
})
const seoDescription = computed(() => article.value?.metaDescription || article.value?.excerpt || '')
const parsedArticle = computed(() => buildBlogArticleWithToc(article.value?.content || ''))
const articleHtml = computed(() => parsedArticle.value.html)
const articleToc = computed(() => parsedArticle.value.toc)
const articleWordCount = computed(() => {
  const text = String(article.value?.content || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(?:#x?[0-9a-f]+|[a-z]+);/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text ? text.split(' ').length : 0
})

useSeoMeta({
  title: () => `${seoTitle.value} | KJPP HJA'R`,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogImage: () => absoluteCover.value,
  ogUrl: () => canonicalUrl.value,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage: () => absoluteCover.value,
})

useHead({
  link: [{ key: 'canonical', rel: 'canonical', href: canonicalUrl }],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => {
        if (!article.value) return ''
        const leader = article.value.leader
        const publishedIso = new Date(article.value.publishedAt || article.value.createdAt).toISOString()
        const modifiedIso = new Date(article.value.updatedAt || article.value.publishedAt || article.value.createdAt).toISOString()
        const authorObj = leader
          ? {
              '@type': 'Person',
              name: leader.name,
              jobTitle: leader.position || 'Penilai Publik',
              description: leader.bio || undefined,
              image: leader.photoUrl ? (leader.photoUrl.startsWith('http') ? leader.photoUrl : `${baseUrl}${leader.photoUrl}`) : undefined,
              url: `${baseUrl}/pimpinan/${leader.slug || leader._id}`,
              worksFor: {
                '@type': 'Organization',
                name: COMPANY_DATA.name,
                url: baseUrl,
              },
            }
          : {
              '@type': 'Person',
              name: article.value.author || 'Admin',
              worksFor: {
                '@type': 'Organization',
                name: COMPANY_DATA.name,
                url: baseUrl,
              },
            }

        return JSON.stringify(
          sanitizeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.value.title,
            image: [absoluteCover.value || defaultOgImage],
            datePublished: publishedIso,
            dateModified: modifiedIso,
            author: [authorObj],
            publisher: {
              '@type': 'Organization',
              name: COMPANY_DATA.name,
              logo: { '@type': 'ImageObject', url: `${baseUrl}/assets/images/h-logo.png` },
            },
            description: seoDescription.value || article.value.title,
            mainEntityOfPage: canonicalUrl.value,
            articleSection: article.value.category?.name || undefined,
            keywords: article.value.tags?.length ? article.value.tags.join(', ') : undefined,
            wordCount: articleWordCount.value > 0 ? articleWordCount.value : undefined,
          })
        ).replace(/</g, '\\u003c')
      }),
    },
  ],
})

const articleRef = ref<HTMLElement | null>(null)
let galleryInstance: any = null

function setupGallery() {
  if (!articleRef.value) return
  const images = articleRef.value.querySelectorAll('img')
  images.forEach((image) => {
    if (image.parentElement?.matches('a[data-src]')) return
    const anchor = document.createElement('a')
    anchor.href = image.src
    anchor.setAttribute('data-src', image.src)
    image.parentNode?.insertBefore(anchor, image)
    anchor.appendChild(image)
    image.style.cursor = 'zoom-in'
  })
  galleryInstance = lightGallery(articleRef.value, {
    plugins: [lgZoom],
    speed: 400,
    selector: 'a[data-src]',
    download: false,
  })
}

async function countView() {
  if (!article.value) return
  const storageKey = `kjpphjar:blog-view:${article.value.slug}`
  if (sessionStorage.getItem(storageKey)) return
  try {
    const result = await $fetch<{ views: number }>(`/api/blog/${article.value.slug}/view`, { method: 'PATCH' })
    article.value.views = result.views
    sessionStorage.setItem(storageKey, '1')
  } catch {
    // View counting must never interrupt reading.
  }
}

onMounted(async () => {
  await nextTick()
  setupGallery()
  await countView()
})
onBeforeUnmount(() => galleryInstance?.destroy?.())

const shareLinks = computed(() => {
  const url = encodeURIComponent(canonicalUrl.value)
  const title = encodeURIComponent(article.value?.title || '')
  return [
    { label: 'WhatsApp', icon: 'ph:whatsapp-logo-bold', href: `https://wa.me/?text=${title}%20${url}`, class: '' },
    { label: 'LinkedIn', icon: 'ph:linkedin-logo-bold', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, class: '' },
    { label: 'X', icon: 'ph:x-logo-bold', href: `https://twitter.com/intent/tweet?url=${url}&text=${title}`, class: '' },
    { label: 'Facebook', icon: 'ph:facebook-logo-bold', href: `https://www.facebook.com/sharer/sharer.php?u=${url}`, class: '' },
  ]
})

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div v-if="pending" class="min-h-screen bg-[var(--paper)]" aria-label="Memuat artikel">
    <div class="pub-page-banner">
      <div class="mx-auto max-w-4xl space-y-5 px-4 sm:px-6 lg:px-8">
        <div class="h-5 w-32 animate-pulse bg-white/10"></div>
        <div class="h-10 max-w-2xl animate-pulse bg-white/10 sm:h-14"></div>
        <div class="h-6 max-w-xl animate-pulse bg-white/10"></div>
      </div>
    </div>
    <div class="mx-auto max-w-4xl space-y-5 px-4 py-14 sm:px-6">
      <div v-for="width in ['100%', '94%', '98%', '78%', '96%', '88%']" :key="width" class="h-5 animate-pulse bg-[var(--rule)]/50" :style="{ width }"></div>
    </div>
  </div>
  <div v-else-if="article" class="bg-[var(--paper)]">
    <header class="pub-page-banner">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <NuxtLink v-if="article.category" :to="{ path: '/blog', query: { category: article.category.slug } }" class="pub-eyebrow hover:underline">{{ article.category.name }}</NuxtLink>
        <h1 class="pub-h1">{{ article.title }}</h1>
        <p v-if="article.excerpt" class="pub-lead">{{ article.excerpt }}</p>
        <div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#1E3A6E] pt-4 text-[14px] tabular-nums text-[#CBD5E1]">
          <span>{{ formatDate(article.publishedAt || article.createdAt) }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ article.readingTime }} menit baca</span>
          <span aria-hidden="true">·</span>
          <span>{{ article.views.toLocaleString('id-ID') }} views</span>
          <template v-if="article.author">
            <span aria-hidden="true">·</span>
            <span>{{ article.author }}</span>
          </template>
        </div>
      </div>
    </header>

    <main class="pub-section">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <UiBreadcrumbs
          :items="[
            { label: 'Blog', to: '/blog' },
            { label: article.title }
          ]"
        />

        <nav
          v-if="articleToc.length >= 2"
          aria-label="Daftar isi artikel"
          class="mt-8 border-y border-[var(--rule)] py-6"
        >
          <p class="text-[14px] font-bold text-[var(--brand-navy)]">Daftar isi</p>
          <ol class="mt-3 space-y-2 text-[16px]">
            <li
              v-for="item in articleToc"
              :key="item.id"
              :class="item.level === 3 ? 'pl-4' : ''"
            >
              <a
                :href="`#${item.id}`"
                class="inline-block transition-colors duration-150 hover:text-[var(--brand-navy)]"
                :class="item.level === 3 ? 'text-[var(--muted)]' : 'font-bold text-[var(--ink)]'"
              >
                {{ item.text }}
              </a>
            </li>
          </ol>
        </nav>

        <article ref="articleRef" class="blog-article prose prose-lg mx-auto mt-10 max-w-none text-[var(--ink)] prose-img:rounded-[2px] dark:prose-invert" v-html="articleHtml"></article>

        <div v-if="article.tags.length" class="mt-12 flex flex-wrap items-center gap-2 border-t border-[var(--rule)] pt-8">
          <span class="mr-1 text-[14px] font-bold text-[var(--ink)]">Topik:</span>
          <NuxtLink v-for="tag in article.tags" :key="tag" :to="{ path: '/blog', query: { tag } }" class="pub-chip pub-chip-idle">#{{ tag }}</NuxtLink>
        </div>

        <!-- Tautan Internal ke Layanan Terkait -->
        <section class="pub-box mt-10 p-6 sm:p-8" aria-labelledby="related-services-heading">
          <h2 id="related-services-heading" class="pub-serif text-[20px] leading-[1.3] text-[var(--ink)]">
            Layanan Penilaian &amp; Konsultasi Terkait di KJPP HJA'R
          </h2>
          <p class="mt-2 text-[16px] leading-[1.6] text-[var(--muted)]">
            Butuh bantuan profesional terkait topik artikel ini? Pelajari ruang lingkup layanan kami atau <NuxtLink to="/contact-us" class="pub-link font-bold underline underline-offset-[3px]">hubungi Kantor Pusat Palembang</NuxtLink>:
          </p>
          <ul class="mt-4 border-t border-[var(--rule)]">
            <li class="border-b border-[var(--rule)]">
              <NuxtLink to="/layanan/penilaian-properti" class="flex items-center justify-between gap-4 py-3 text-[16px] font-bold text-[var(--ink)] transition-colors duration-150 hover:text-[var(--brand-navy)]">
                <span>Penilaian Properti (Tanah, Bangunan &amp; Mesin)</span>
                <span aria-hidden="true" class="text-[var(--brand-navy)]">→</span>
              </NuxtLink>
            </li>
            <li class="border-b border-[var(--rule)]">
              <NuxtLink to="/layanan/penilaian-bisnis" class="flex items-center justify-between gap-4 py-3 text-[16px] font-bold text-[var(--ink)] transition-colors duration-150 hover:text-[var(--brand-navy)]">
                <span>Penilaian Bisnis &amp; Saham</span>
                <span aria-hidden="true" class="text-[var(--brand-navy)]">→</span>
              </NuxtLink>
            </li>
            <li class="border-b border-[var(--rule)]">
              <NuxtLink to="/layanan/studi-kelayakan" class="flex items-center justify-between gap-4 py-3 text-[16px] font-bold text-[var(--ink)] transition-colors duration-150 hover:text-[var(--brand-navy)]">
                <span>Studi Kelayakan Proyek (Feasibility Study)</span>
                <span aria-hidden="true" class="text-[var(--brand-navy)]">→</span>
              </NuxtLink>
            </li>
            <li class="border-b border-[var(--rule)]">
              <NuxtLink to="/layanan/pengawasan-proyek" class="flex items-center justify-between gap-4 py-3 text-[16px] font-bold text-[var(--ink)] transition-colors duration-150 hover:text-[var(--brand-navy)]">
                <span>Pengawasan Proyek (Project Monitoring)</span>
                <span aria-hidden="true" class="text-[var(--brand-navy)]">→</span>
              </NuxtLink>
            </li>
          </ul>
        </section>

        <section class="mt-10 flex flex-col gap-4 border-y border-[var(--rule)] py-6 sm:flex-row sm:items-center sm:justify-between" aria-labelledby="share-heading">
          <div>
            <h2 id="share-heading" class="font-bold text-[var(--ink)]">Bagikan artikel</h2>
            <p class="mt-1 text-[14px] text-[var(--muted)]">Kirim wawasan ini kepada rekan Anda.</p>
          </div>
          <div class="flex gap-2">
            <a v-for="item in shareLinks" :key="item.label" :href="item.href" target="_blank" rel="noopener noreferrer" class="inline-flex h-10 w-10 items-center justify-center rounded-[2px] border border-[var(--rule)] text-[var(--muted)] transition-colors duration-150 hover:border-[var(--brand-navy)] hover:text-[var(--brand-navy)]" :aria-label="`Bagikan ke ${item.label}`">
              <Icon :name="item.icon" />
            </a>
          </div>
        </section>

        <!-- Author Bio Card (Pimpinan Rekan Penulis / Google E-E-A-T) -->
        <section
          v-if="article.leader"
          class="pub-box mt-12 p-6 sm:p-8"
          aria-labelledby="author-heading"
        >
          <div class="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div class="shrink-0">
              <img
                v-if="article.leader.photoUrl"
                :src="article.leader.photoUrl"
                :alt="`Foto ${article.leader.name}, ${article.leader.position} KJPP HJA'R`"
                width="96"
                height="96"
                class="h-24 w-24 rounded-[2px] object-cover"
                loading="lazy"
                decoding="async"
              />
              <div v-else class="pub-serif flex h-24 w-24 items-center justify-center rounded-[2px] bg-[#0B1640] text-[32px] text-white">
                {{ article.leader.name.charAt(0) }}
              </div>
            </div>
            <div class="flex-1">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p class="text-[14px] font-bold text-[var(--brand-navy)]">Penulis artikel</p>
                  <h3 id="author-heading" class="pub-serif mt-1 text-[24px] leading-[1.25] text-[var(--ink)]">
                    <NuxtLink :to="`/pimpinan/${article.leader.slug || article.leader._id}`" class="transition-colors duration-150 hover:text-[var(--brand-navy)]">
                      {{ article.leader.name }}
                    </NuxtLink>
                  </h3>
                  <p class="mt-1 text-[14px] text-[var(--muted)]">
                    {{ article.leader.position }} · KJPP HJA'R
                  </p>
                </div>
                <NuxtLink
                  :to="{ path: '/blog', query: { author: article.leader._id } }"
                  class="pub-link text-[14px] font-bold"
                >
                  Artikel lain dari penulis →
                </NuxtLink>
              </div>
              <p v-if="article.leader.bio" class="mt-3 text-[16px] leading-[1.6] text-[var(--muted)]">
                {{ article.leader.bio }}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section v-if="relatedArticles.length" class="container mt-16 border-t border-[var(--rule)] pt-14" aria-labelledby="related-heading">
        <div class="flex items-end justify-between gap-4">
          <div>
            <h2 id="related-heading" class="pub-h2">Artikel terkait</h2>
            <p class="mt-2 text-[16px] text-[var(--muted)]">Bacaan lanjutan berdasarkan kategori dan topik serupa.</p>
          </div>
          <NuxtLink to="/blog" class="pub-link hidden text-[14px] font-bold sm:inline">Lihat semua →</NuxtLink>
        </div>
        <div class="mt-8 grid gap-8 md:grid-cols-3">
          <BlogArticleCard v-for="related in relatedArticles" :key="related._id" :article="related" />
        </div>
      </section>
    </main>
  </div>
</template>

<style>
@import 'lightgallery/css/lightgallery.css';
@import 'lightgallery/css/lg-zoom.css';

.blog-article li[data-list='bullet'] {
  list-style-type: disc;
}

.blog-article h2,
.blog-article h3 {
  scroll-margin-top: 7.5rem;
}

.blog-article li[data-list='ordered'] {
  list-style-type: decimal;
}

.blog-article li[data-list] > .ql-ui {
  display: none;
}

.blog-article li.ql-indent-1 { margin-left: 1.5rem; }
.blog-article li.ql-indent-2 { margin-left: 3rem; }
.blog-article li.ql-indent-3 { margin-left: 4.5rem; }
.blog-article li.ql-indent-4 { margin-left: 6rem; }
.blog-article li.ql-indent-5 { margin-left: 7.5rem; }
.blog-article li.ql-indent-6 { margin-left: 9rem; }
.blog-article li.ql-indent-7 { margin-left: 10.5rem; }
.blog-article li.ql-indent-8 { margin-left: 12rem; }
</style>
