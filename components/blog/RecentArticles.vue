<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  categoryTitle?: string
  eyebrow?: string
  description?: string
  category?: string
  limit?: number
  minItems?: number
  centered?: boolean
}>(), {
  title: 'Artikel Terbaru',
  limit: 3,
  minItems: 1,
  centered: false,
})

const cacheKey = `recent-articles:${props.category || 'all'}:${props.limit}:${props.minItems}`

const { data } = await useAsyncData(cacheKey, async () => {
  if (props.category) {
    const byCategory = await $fetch('/api/blog', { query: { category: props.category, limit: props.limit } })
    if (byCategory.items.length >= props.minItems) return { items: byCategory.items, byCategory: true }
  }
  const latest = await $fetch('/api/blog', { query: { limit: props.limit } })
  return { items: latest.items, byCategory: false }
})

const articles = computed(() => data.value?.items || [])
const isByCategory = computed(() => Boolean(data.value?.byCategory))
const heading = computed(() => (isByCategory.value && props.categoryTitle) || props.title)
const moreLink = computed(() => isByCategory.value ? { path: '/blog', query: { category: props.category } } : '/blog')
const headingId = `recent-articles-${props.category || 'all'}`
</script>

<template>
  <section v-if="articles.length >= minItems" :aria-labelledby="headingId">
    <div class="container">
      <div v-if="centered" class="heading text-center">
        <p v-if="eyebrow" class="subtitle">{{ eyebrow }}</p>
        <h2 :id="headingId">{{ heading }}</h2>
        <p v-if="description" class="mx-auto mt-4 max-w-2xl text-gray dark:text-slate-300">{{ description }}</p>
      </div>
      <div v-else class="mb-8 flex items-end justify-between gap-4">
        <div>
          <p v-if="eyebrow" class="mb-2 text-sm font-bold text-[var(--brand-navy)]">{{ eyebrow }}</p>
          <h2 :id="headingId" class="pub-serif text-2xl text-[var(--ink)] sm:text-[32px]">{{ heading }}</h2>
          <p v-if="description" class="mt-2 text-[16px] text-[var(--muted)]">{{ description }}</p>
        </div>
        <NuxtLink :to="moreLink" class="pub-link hidden shrink-0 text-sm font-bold sm:inline">Lihat semua →</NuxtLink>
      </div>

      <div class="grid gap-7 md:grid-cols-3">
        <BlogArticleCard v-for="article in articles" :key="article._id" :article="article" />
      </div>

      <div v-if="centered" class="mt-10 text-center">
        <NuxtLink :to="moreLink" class="btn">Lihat Semua Artikel</NuxtLink>
      </div>
      <NuxtLink v-else :to="moreLink" class="pub-link mt-6 inline-block text-sm font-bold sm:hidden">Lihat semua artikel →</NuxtLink>
    </div>
  </section>
</template>
