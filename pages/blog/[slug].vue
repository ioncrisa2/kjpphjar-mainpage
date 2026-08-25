<script setup lang="ts">
import lightGallery from 'lightgallery'
import lgZoom from 'lightgallery/plugins/zoom'

const route = useRoute()
const slug = route.params.slug as string
const { data: article, pending, error } = await useFetch(`/api/blog/${slug}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
}

const { data: relatedData } = await useFetch(`/api/blog/${slug}/related`)
const relatedArticles = computed(() => relatedData.value?.items || [])
const config = useRuntimeConfig()
const baseUrl = String(config.public.baseUrl || 'https://kjpphjar.com').replace(/\/$/, '')
const canonicalUrl = computed(() => `${baseUrl}/blog/${article.value?.slug || slug}`)
const absoluteCover = computed(() => {
  const cover = article.value?.coverImageUrl || ''
  if (!cover) return ''
  return /^https?:\/\//i.test(cover) ? cover : `${baseUrl}${cover.startsWith('/') ? '' : '/'}${cover}`
})
const seoTitle = computed(() => article.value?.metaTitle || article.value?.title || 'Blog')
const seoDescription = computed(() => article.value?.metaDescription || article.value?.excerpt || '')
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
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => {
        if (!article.value) return ''
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.value.title,
          image: absoluteCover.value ? [absoluteCover.value] : [],
          datePublished: article.value.publishedAt || article.value.createdAt,
          dateModified: article.value.updatedAt || article.value.createdAt,
          author: [{ '@type': 'Person', name: article.value.author || 'Admin' }],
          publisher: {
            '@type': 'Organization',
            name: 'KJPP Henricus Judi Adrianto dan Rekan',
            logo: { '@type': 'ImageObject', url: `${baseUrl}/assets/images/h-logo.png` },
          },
          description: seoDescription.value,
          mainEntityOfPage: canonicalUrl.value,
          articleSection: article.value.category?.name || undefined,
          keywords: article.value.tags.join(', '),
          wordCount: articleWordCount.value,
        }).replace(/</g, '\\u003c')
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
    { label: 'WhatsApp', icon: 'ph:whatsapp-logo-bold', href: `https://wa.me/?text=${title}%20${url}`, class: 'hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-400/15 dark:hover:text-green-300' },
    { label: 'LinkedIn', icon: 'ph:linkedin-logo-bold', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, class: 'hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-blue-400/15 dark:hover:text-blue-200' },
    { label: 'X', icon: 'ph:x-logo-bold', href: `https://twitter.com/intent/tweet?url=${url}&text=${title}`, class: 'hover:bg-slate-100 hover:text-black dark:hover:bg-white/10 dark:hover:text-white' },
    { label: 'Facebook', icon: 'ph:facebook-logo-bold', href: `https://www.facebook.com/sharer/sharer.php?u=${url}`, class: 'hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-400/15 dark:hover:text-blue-200' },
  ]
})

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div v-if="pending" class="min-h-screen bg-white pt-[106px] dark:bg-gray-dark" aria-label="Memuat artikel">
    <div class="bg-black px-4 py-20 sm:py-24">
      <div class="mx-auto max-w-4xl space-y-5 text-center">
        <div class="mx-auto h-7 w-32 animate-pulse rounded-full bg-white/10"></div>
        <div class="mx-auto h-10 max-w-2xl animate-pulse rounded-lg bg-white/10 sm:h-14"></div>
        <div class="mx-auto h-6 max-w-xl animate-pulse rounded bg-white/10"></div>
        <div class="mx-auto h-5 w-80 max-w-full animate-pulse rounded bg-white/10"></div>
      </div>
    </div>
    <div class="mx-auto max-w-4xl space-y-5 px-4 py-14 sm:px-6">
      <div class="h-5 w-40 animate-pulse rounded bg-slate-100 dark:bg-white/10"></div>
      <div v-for="width in ['100%', '94%', '98%', '78%', '96%', '88%']" :key="width" class="h-5 animate-pulse rounded bg-slate-100 dark:bg-white/10" :style="{ width }"></div>
      <div class="h-56 animate-pulse rounded-xl bg-slate-100 dark:bg-white/10"></div>
    </div>
  </div>
  <div v-else-if="article" class="bg-white dark:bg-gray-dark">
    <header class="relative overflow-hidden bg-black pt-[110px] sm:pt-[130px]">
      <div v-if="article.coverImageUrl" class="absolute inset-0">
        <img :src="article.coverImageUrl" alt="" class="h-full w-full object-cover opacity-25">
        <div class="absolute inset-0 bg-black/45"></div>
      </div>
      <div class="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <NuxtLink v-if="article.category" :to="{ path: '/blog', query: { category: article.category.slug } }" class="inline-flex rounded-full bg-primary/15 px-3 py-1.5 text-sm font-bold text-primary transition hover:bg-primary/25">{{ article.category.name }}</NuxtLink>
        <h1 class="mx-auto mt-5 max-w-4xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">{{ article.title }}</h1>
        <p v-if="article.excerpt" class="mx-auto mt-5 max-w-3xl text-base leading-7 text-white/70 sm:text-lg">{{ article.excerpt }}</p>
        <div class="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/65">
          <span class="inline-flex items-center gap-1.5"><Icon name="ph:calendar-blank-bold" /> {{ formatDate(article.publishedAt || article.createdAt) }}</span>
          <span class="inline-flex items-center gap-1.5"><Icon name="ph:clock-bold" /> {{ article.readingTime }} menit baca</span>
          <span class="inline-flex items-center gap-1.5"><Icon name="ph:eye-bold" /> {{ article.views.toLocaleString('id-ID') }} views</span>
          <span v-if="article.author" class="inline-flex items-center gap-1.5"><Icon name="ph:user-circle-bold" /> {{ article.author }}</span>
        </div>
      </div>
    </header>

    <main class="py-14 sm:py-20">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/blog" class="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:text-blue-700">
          <Icon name="ph:arrow-left-bold" /> Kembali ke semua artikel
        </NuxtLink>

        <article ref="articleRef" class="blog-article prose prose-lg prose-blue mx-auto mt-10 max-w-none text-gray-900 prose-headings:font-extrabold prose-headings:text-black prose-a:text-primary prose-img:rounded-xl dark:prose-invert dark:text-slate-200 dark:prose-headings:text-white" v-html="article.content"></article>

        <div v-if="article.tags.length" class="mt-12 flex flex-wrap items-center gap-2 border-t border-gray/10 pt-8 dark:border-white/10">
          <span class="mr-1 text-sm font-bold text-black dark:text-white">Topik:</span>
          <NuxtLink v-for="tag in article.tags" :key="tag" :to="{ path: '/blog', query: { tag } }" class="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-800 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-blue-400/15 dark:hover:text-blue-200">#{{ tag }}</NuxtLink>
        </div>

        <section class="mt-10 flex flex-col gap-4 border-y border-gray/10 py-6 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between" aria-labelledby="share-heading">
          <div>
            <h2 id="share-heading" class="font-extrabold text-black dark:text-white">Bagikan artikel</h2>
            <p class="mt-1 text-sm text-gray dark:text-slate-300">Kirim wawasan ini kepada rekan Anda.</p>
          </div>
          <div class="flex gap-2">
            <a v-for="item in shareLinks" :key="item.label" :href="item.href" target="_blank" rel="noopener noreferrer" class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition dark:bg-white/5 dark:text-slate-300" :class="item.class" :aria-label="`Bagikan ke ${item.label}`">
              <Icon :name="item.icon" />
            </a>
          </div>
        </section>
      </div>

      <section v-if="relatedArticles.length" class="mx-auto mt-16 max-w-7xl border-t border-gray/10 px-4 pt-14 dark:border-white/10 sm:px-6 lg:px-8" aria-labelledby="related-heading">
        <div class="flex items-end justify-between gap-4">
          <div>
            <h2 id="related-heading" class="text-2xl font-extrabold text-black dark:text-white sm:text-3xl">Artikel terkait</h2>
            <p class="mt-2 text-sm text-gray dark:text-slate-300">Bacaan lanjutan berdasarkan kategori dan topik serupa.</p>
          </div>
          <NuxtLink to="/blog" class="hidden text-sm font-bold text-primary hover:underline sm:inline">Lihat semua</NuxtLink>
        </div>
        <div class="mt-8 grid gap-7 md:grid-cols-3">
          <NuxtLink v-for="related in relatedArticles" :key="related._id" :to="`/blog/${related.slug}`" class="group overflow-hidden rounded-xl border border-gray/15 transition hover:border-primary/60 dark:border-white/10 dark:bg-slate-900">
            <div class="h-44 overflow-hidden bg-slate-100 dark:bg-white/5">
              <img v-if="related.coverImageUrl" :src="related.coverImageUrl" :alt="related.title" loading="lazy" class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]">
              <div v-else class="flex h-full items-center justify-center text-slate-300"><Icon name="ph:image-bold" class="text-4xl" /></div>
            </div>
            <div class="p-5">
              <p class="text-xs font-semibold text-primary">{{ related.category?.name || 'Artikel' }} · {{ related.readingTime }} menit</p>
              <h3 class="mt-2 line-clamp-2 text-lg font-extrabold leading-snug text-black transition group-hover:text-primary dark:text-white">{{ related.title }}</h3>
              <p class="mt-3 line-clamp-2 text-sm leading-6 text-gray dark:text-slate-300">{{ related.excerpt }}</p>
            </div>
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
.blog-article li[data-list='bullet'] {
  list-style-type: disc;
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
