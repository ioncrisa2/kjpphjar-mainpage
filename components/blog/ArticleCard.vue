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
  <NuxtLink :to="`/blog/${article.slug}`" class="group overflow-hidden rounded-xl border border-gray/15 bg-white transition hover:border-primary/60 dark:border-white/10 dark:bg-slate-900">
    <div class="h-44 overflow-hidden bg-slate-100 dark:bg-white/5">
      <img v-if="article.coverImageUrl" :src="article.coverImageUrl" :alt="article.title" loading="lazy" decoding="async" class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]">
      <div v-else class="flex h-full items-center justify-center text-slate-300"><Icon name="ph:image-bold" class="text-4xl" /></div>
    </div>
    <div class="p-5">
      <p class="text-xs font-semibold text-primary">{{ article.category?.name || 'Artikel' }} · {{ article.readingTime }} menit</p>
      <h3 class="mt-2 line-clamp-2 text-lg font-extrabold leading-snug text-black transition group-hover:text-primary dark:text-white">{{ article.title }}</h3>
      <p class="mt-3 line-clamp-2 text-sm leading-6 text-gray dark:text-slate-300">{{ article.excerpt }}</p>
    </div>
  </NuxtLink>
</template>
