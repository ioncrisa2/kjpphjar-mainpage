<script setup lang="ts">
import { buildBlogArticleWithToc } from '~/utils/blog-content'

const props = defineProps<{
  modelValue: boolean
  title: string
  excerpt: string
  content: string
  coverUrl: string
  categoryName?: string
  tags: string[]
  author: string
  readingTime: number
  statusLabel: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const parsedArticle = computed(() => buildBlogArticleWithToc(props.content))

function close() {
  emit('update:modelValue', false)
}

function onKeydown(event: KeyboardEvent) {
  if (props.modelValue && event.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  if (import.meta.client) window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  if (import.meta.client) window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-xs sm:p-6"
    role="dialog"
    aria-modal="true"
    aria-labelledby="blog-preview-title"
  >
    <div class="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gray/15 bg-white shadow-2xl dark:border-white/10 dark:bg-black">
      <div class="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray/15 bg-white/95 px-6 py-3.5 backdrop-blur-xs dark:border-white/10 dark:bg-slate-900/95">
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">Pratinjau</span>
          <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-300">{{ statusLabel }}</span>
          <p id="blog-preview-title" class="truncate text-sm font-bold text-black dark:text-white">
            {{ title || 'Judul artikel belum diisi' }}
          </p>
        </div>
        <button
          type="button"
          class="rounded-lg p-2 text-gray-500 transition hover:bg-slate-100 hover:text-black dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="Tutup pratinjau"
          @click="close"
        >
          <Icon name="ph:x-bold" class="h-4 w-4" />
        </button>
      </div>

      <div class="max-h-[calc(100vh-7rem)] overflow-y-auto">
        <header class="relative overflow-hidden bg-black px-6 py-14 text-center sm:px-10 sm:py-16">
          <div v-if="coverUrl" class="absolute inset-0">
            <img :src="coverUrl" alt="" class="h-full w-full object-cover opacity-25">
            <div class="absolute inset-0 bg-black/45"></div>
          </div>
          <div class="relative mx-auto max-w-3xl">
            <span v-if="categoryName" class="inline-flex rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
              {{ categoryName }}
            </span>
            <h1 class="mt-4 text-2xl font-extrabold leading-tight text-white sm:text-4xl">
              {{ title || 'Judul Artikel' }}
            </h1>
            <p v-if="excerpt" class="mt-4 text-sm leading-6 text-white/75 sm:text-base">
              {{ excerpt }}
            </p>
            <div class="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/70 sm:text-sm">
              <span class="inline-flex items-center gap-1.5"><Icon name="ph:clock-bold" /> {{ readingTime }} menit baca</span>
              <span v-if="author" class="inline-flex items-center gap-1.5"><Icon name="ph:user-circle-bold" /> {{ author }}</span>
            </div>
          </div>
        </header>

        <div class="mx-auto max-w-3xl px-6 py-10 sm:px-8">
          <nav
            v-if="parsedArticle.toc.length >= 2"
            aria-label="Daftar isi pratinjau"
            class="mb-8 rounded-xl border border-gray/15 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-900"
          >
            <p class="text-xs font-extrabold uppercase tracking-wider text-primary">Daftar Isi</p>
            <ol class="mt-3 space-y-1.5 text-sm">
              <li
                v-for="item in parsedArticle.toc"
                :key="item.id"
                :class="item.level === 3 ? 'pl-4 text-gray-600 dark:text-slate-400' : 'font-semibold text-black dark:text-white'"
              >
                {{ item.text }}
              </li>
            </ol>
          </nav>

          <article
            v-if="parsedArticle.html"
            class="blog-article prose prose-lg prose-blue mx-auto max-w-none text-gray-900 prose-headings:font-extrabold prose-headings:text-black prose-a:text-primary prose-img:rounded-xl dark:prose-invert dark:text-slate-200 dark:prose-headings:text-white"
            v-html="parsedArticle.html"
          ></article>
          <p v-else class="py-12 text-center text-sm text-gray">Konten artikel masih kosong.</p>

          <div v-if="tags.length" class="mt-10 flex flex-wrap items-center gap-2 border-t border-gray/10 pt-6 dark:border-white/10">
            <span class="mr-1 text-sm font-bold text-black dark:text-white">Topik:</span>
            <span
              v-for="tag in tags"
              :key="tag"
              class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
