<script setup lang="ts">
defineProps<{
  article: {
    slug: string
    title: string
    excerpt?: string
    coverImageUrl?: string
    readingTime?: number
    category?: { name: string } | null
  }
}>()
</script>

<template>
  <NuxtLink :to="`/blog/${article.slug}`" class="group flex flex-col overflow-hidden rounded-[2px] border border-[var(--rule)] bg-[var(--surface)] transition-colors duration-150 hover:border-[var(--brand-navy)]">
    <div class="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-white/5">
      <img v-if="article.coverImageUrl" :src="article.coverImageUrl" :alt="`Ilustrasi artikel: ${article.title}`" loading="lazy" decoding="async" class="h-full w-full object-cover">
      <div v-else class="flex h-full items-center justify-center text-slate-300"><Icon name="ph:image-bold" class="text-4xl" /></div>
    </div>
    <div class="flex flex-1 flex-col p-5">
      <p class="text-[13px] font-bold tabular-nums text-[var(--brand-navy)]">{{ article.category?.name || 'Artikel' }} · {{ article.readingTime }} menit baca</p>
      <h3 class="pub-serif mt-2 text-[20px] leading-snug text-[var(--ink)] group-hover:text-[var(--brand-navy)]">{{ article.title }}</h3>
      <p class="mt-2.5 text-[15px] leading-[1.6] text-[var(--muted)]">{{ article.excerpt }}</p>
    </div>
  </NuxtLink>
</template>
