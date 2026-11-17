<script setup lang="ts">
const props = defineProps<{
  title: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  slug: string
}>()

const config = useRuntimeConfig()
const baseUrl = computed(() =>
  String(config.public.baseUrl || 'https://kjpp-hjar.co.id')
    .replace('://www.', '://')
    .replace(/\/$/, '')
)
const previewTitle = computed(() => props.metaTitle.trim() || props.title.trim() || 'Judul artikel')
const previewDescription = computed(() => props.metaDescription.trim() || props.excerpt.trim() || 'Deskripsi artikel akan tampil di sini.')
const previewUrl = computed(() => `${baseUrl.value}/blog/${props.slug.trim() || 'slug-artikel'}`)
</script>

<template>
  <div class="rounded-xl border border-gray/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/70" aria-label="Preview hasil pencarian Google">
    <p class="mb-1 truncate text-sm text-emerald-800 dark:text-emerald-400">{{ previewUrl }}</p>
    <p class="line-clamp-1 text-xl font-medium text-[#1a0dab] dark:text-blue-400">{{ previewTitle }}</p>
    <p class="mt-1 line-clamp-2 max-w-[70ch] text-sm leading-6 text-slate-700 dark:text-slate-300">{{ previewDescription }}</p>
  </div>
</template>
