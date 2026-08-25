<script setup lang="ts">
const props = withDefaults(defineProps<{
  initialValue?: Record<string, any> | null
  saving?: boolean
  submitLabel?: string
}>(), {
  initialValue: null,
  saving: false,
  submitLabel: 'Simpan Artikel',
})

const emit = defineEmits<{ submit: [payload: FormData] }>()
const { data: categoryData } = await useFetch('/api/admin/categories')
const categories = computed(() => categoryData.value?.items || [])

const { data: leadersData } = await useFetch('/api/leaders')
const leaders = computed(() => leadersData.value || [])

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  categoryId: '',
  leaderId: '',
  tags: [] as string[],
  metaTitle: '',
  metaDescription: '',
  status: 'draft',
  publishedAt: '',
  isFeatured: false,
  author: 'Admin',
})

const coverInput = ref<HTMLInputElement | null>(null)
const contentEditor = ref<{ getSemanticHtml: () => string } | null>(null)
const selectedCover = ref<File | null>(null)
const coverPreview = ref('')
const removeCover = ref(false)
const hydratedKey = ref('')

function toLocalDateTime(value: unknown) {
  if (!value) return ''
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return ''
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

function onLeaderChange() {
  if (form.leaderId) {
    const selected = leaders.value.find((l: any) => l._id === form.leaderId)
    if (selected) {
      form.author = selected.name
    }
  }
}

watch(() => props.initialValue, (article) => {
  if (!article) return
  const key = `${article._id || 'new'}-${article.updatedAt || ''}`
  if (hydratedKey.value === key) return
  hydratedKey.value = key
  form.title = article.title || ''
  form.slug = article.slug || ''
  form.excerpt = article.excerpt || ''
  form.content = article.content || ''
  form.categoryId = article.categoryId || ''
  form.leaderId = article.leaderId || article.leader?._id || ''
  form.tags = Array.isArray(article.tags) ? [...article.tags] : []
  form.metaTitle = article.metaTitle || ''
  form.metaDescription = article.metaDescription || ''
  form.status = article.status || (article.isPublished ? 'published' : 'draft')
  form.publishedAt = toLocalDateTime(article.publishedAt)
  form.isFeatured = Boolean(article.isFeatured)
  form.author = article.author || 'Admin'
}, { immediate: true })

onBeforeUnmount(() => {
  if (coverPreview.value) URL.revokeObjectURL(coverPreview.value)
})

const suggestedSlug = computed(() => (form.slug || form.title)
  .toLocaleLowerCase('id-ID')
  .normalize('NFKD')
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/[\s-]+/g, '-'))

const readingTime = computed(() => {
  const words = form.content.replace(/<[^>]*>/g, ' ').replace(/&\w+;/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
})

const existingCover = computed(() => removeCover.value ? '' : props.initialValue?.coverImageUrl || '')
const shownCover = computed(() => coverPreview.value || existingCover.value)

function selectCover(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] || null
  if (coverPreview.value) URL.revokeObjectURL(coverPreview.value)
  selectedCover.value = file
  coverPreview.value = file ? URL.createObjectURL(file) : ''
  if (file) removeCover.value = false
}

function clearCover() {
  if (coverPreview.value) URL.revokeObjectURL(coverPreview.value)
  coverPreview.value = ''
  selectedCover.value = null
  removeCover.value = true
  if (coverInput.value) coverInput.value.value = ''
}

function submitForm() {
  if (form.status === 'scheduled' && !form.publishedAt) {
    alert('Pilih tanggal dan waktu terbit untuk artikel terjadwal.')
    return
  }

  const payload = new FormData()
  if (selectedCover.value) payload.append('image', selectedCover.value)
  payload.append('title', form.title)
  payload.append('slug', form.slug)
  payload.append('excerpt', form.excerpt)
  payload.append('content', contentEditor.value?.getSemanticHtml() || form.content)
  payload.append('categoryId', form.categoryId)
  payload.append('leaderId', form.leaderId)
  payload.append('tags', JSON.stringify(form.tags))
  payload.append('metaTitle', form.metaTitle)
  payload.append('metaDescription', form.metaDescription)
  payload.append('status', form.status)
  payload.append('publishedAt', form.publishedAt ? new Date(form.publishedAt).toISOString() : '')
  payload.append('isFeatured', String(form.isFeatured))
  payload.append('author', form.author)
  payload.append('removeCover', String(removeCover.value))
  emit('submit', payload)
}
</script>

<template>
  <form class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]" @submit.prevent="submitForm">
    <div class="space-y-6">
      <section class="admin-card space-y-5" aria-labelledby="article-content-heading">
        <div>
          <h2 id="article-content-heading" class="text-lg font-extrabold text-black dark:text-white">Isi artikel</h2>
          <p class="mt-1 text-sm text-gray">Susun judul, ringkasan, dan konten utama yang akan dibaca publik.</p>
        </div>

        <div>
          <label for="blog-title" class="admin-label">Judul artikel</label>
          <input id="blog-title" v-model="form.title" type="text" maxlength="180" required class="admin-input" placeholder="Judul yang spesifik dan mudah dipahami">
        </div>

        <div>
          <label for="blog-slug" class="admin-label">Slug URL</label>
          <div class="flex overflow-hidden rounded-xl border border-gray/20 bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:bg-gray-dark">
            <span class="hidden items-center border-r border-gray/20 bg-slate-50 px-3 text-sm text-gray sm:flex">/blog/</span>
            <input id="blog-slug" v-model="form.slug" type="text" maxlength="180" class="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-black outline-none dark:text-white" :placeholder="suggestedSlug || 'otomatis-dari-judul'">
          </div>
        </div>

        <div>
          <div class="flex items-end justify-between gap-4">
            <label for="blog-excerpt" class="admin-label">Ringkasan</label>
            <span class="mb-1.5 text-xs text-gray">{{ form.excerpt.length }}/400</span>
          </div>
          <textarea id="blog-excerpt" v-model="form.excerpt" rows="3" maxlength="400" class="admin-input resize-y" placeholder="Jika kosong, ringkasan dibuat otomatis dari konten."></textarea>
        </div>

        <div>
          <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
            <label class="admin-label !mb-0">Konten lengkap</label>
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray">
              <Icon name="ph:clock-bold" /> Perkiraan {{ readingTime }} menit baca
            </span>
          </div>
          <UiWysiwygEditor
            ref="contentEditor"
            v-model="form.content"
            image-upload-url="/api/admin/blog/upload-image"
            aria-label="Konten lengkap artikel"
          />
        </div>
      </section>

      <section class="admin-card space-y-5" aria-labelledby="seo-heading">
        <div>
          <h2 id="seo-heading" class="text-lg font-extrabold text-black dark:text-white">SEO & preview pencarian</h2>
          <p class="mt-1 text-sm text-gray">Kosongkan field SEO untuk memakai judul dan ringkasan artikel.</p>
        </div>
        <div>
          <div class="flex items-end justify-between gap-4">
            <label for="meta-title" class="admin-label">Meta title</label>
            <span class="mb-1.5 text-xs" :class="form.metaTitle.length > 60 ? 'text-amber-700' : 'text-gray'">{{ form.metaTitle.length }}/70</span>
          </div>
          <input id="meta-title" v-model="form.metaTitle" type="text" maxlength="70" class="admin-input" placeholder="Idealnya 50-60 karakter">
        </div>
        <div>
          <div class="flex items-end justify-between gap-4">
            <label for="meta-description" class="admin-label">Meta description</label>
            <span class="mb-1.5 text-xs" :class="form.metaDescription.length > 160 ? 'text-amber-700' : 'text-gray'">{{ form.metaDescription.length }}/180</span>
          </div>
          <textarea id="meta-description" v-model="form.metaDescription" rows="3" maxlength="180" class="admin-input resize-y" placeholder="Idealnya 140-160 karakter"></textarea>
        </div>
        <AdminBlogSeoPreview
          :title="form.title"
          :excerpt="form.excerpt"
          :meta-title="form.metaTitle"
          :meta-description="form.metaDescription"
          :slug="suggestedSlug"
        />
      </section>
    </div>

    <aside class="space-y-6 lg:sticky lg:top-6">
      <section class="admin-card space-y-5" aria-labelledby="publish-heading">
        <h2 id="publish-heading" class="text-lg font-extrabold text-black dark:text-white">Publikasi</h2>
        <div>
          <label for="blog-status" class="admin-label">Status</label>
          <select id="blog-status" v-model="form.status" class="admin-input">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Terjadwal</option>
          </select>
        </div>
        <div v-if="form.status !== 'draft'">
          <label for="published-at" class="admin-label">Tanggal & waktu terbit</label>
          <input id="published-at" v-model="form.publishedAt" type="datetime-local" :required="form.status === 'scheduled'" class="admin-input">
          <p class="mt-1.5 text-xs text-gray">Zona waktu mengikuti perangkat admin.</p>
        </div>
        <label class="flex cursor-pointer items-start gap-3 rounded-xl bg-blue-50 p-3 text-sm text-slate-800">
          <input v-model="form.isFeatured" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
          <span><strong class="block">Artikel unggulan</strong>Tampil pada banner utama halaman blog.</span>
        </label>
      </section>

      <section class="admin-card space-y-5" aria-labelledby="classification-heading">
        <div class="flex items-center justify-between gap-3">
          <h2 id="classification-heading" class="text-lg font-extrabold text-black dark:text-white">Klasifikasi</h2>
          <NuxtLink to="/admin/blog/categories" class="text-xs font-bold text-primary hover:underline">Kelola</NuxtLink>
        </div>
        <div>
          <label for="blog-category" class="admin-label">Kategori</label>
          <select id="blog-category" v-model="form.categoryId" class="admin-input">
            <option value="">Tanpa kategori</option>
            <option v-for="category in categories" :key="category._id" :value="category._id">
              {{ category.name }}{{ category.isActive ? '' : ' (nonaktif)' }}
            </option>
          </select>
        </div>
        <div>
          <label class="admin-label">Tags</label>
          <AdminBlogTagInput v-model="form.tags" />
        </div>
        <div>
          <label for="blog-leader" class="admin-label">Penulis (Pimpinan Rekan)</label>
          <select id="blog-leader" v-model="form.leaderId" class="admin-input" @change="onLeaderChange">
            <option value="">Nama Manual / Tim Redaksi</option>
            <option v-for="leader in leaders" :key="leader._id" :value="leader._id">
              {{ leader.name }} — {{ leader.position }}
            </option>
          </select>
        </div>
        <div>
          <label for="blog-author" class="admin-label">Nama Tampilan Penulis</label>
          <input id="blog-author" v-model="form.author" type="text" maxlength="100" class="admin-input" placeholder="Contoh: Admin / Tim Redaksi / Nama Penulis">
        </div>
      </section>

      <section class="admin-card space-y-4" aria-labelledby="cover-heading">
        <h2 id="cover-heading" class="text-lg font-extrabold text-black dark:text-white">Cover artikel</h2>
        <div v-if="shownCover" class="overflow-hidden rounded-xl bg-slate-100">
          <img :src="shownCover" alt="Preview cover artikel" class="aspect-[16/10] w-full object-cover">
        </div>
        <input
          ref="coverInput"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="block w-full text-sm text-gray file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-blue-800 hover:file:bg-blue-100"
          @change="selectCover"
        >
        <p class="text-xs leading-5 text-gray">JPG, PNG, atau WebP. Maksimal 4 MB; server otomatis mengoptimalkan gambar.</p>
        <button v-if="shownCover" type="button" class="text-sm font-semibold text-red-600 hover:text-red-800" @click="clearCover">
          Hapus cover
        </button>
      </section>

      <div class="flex gap-3">
        <NuxtLink to="/admin/blog" class="admin-btn-ghost flex-1 justify-center">Batal</NuxtLink>
        <button type="submit" :disabled="saving" class="admin-btn-primary flex-1 justify-center disabled:cursor-not-allowed disabled:opacity-50">
          <Icon v-if="saving" name="ph:spinner-gap-bold" class="animate-spin" />
          {{ saving ? 'Menyimpan…' : submitLabel }}
        </button>
      </div>
    </aside>
  </form>
</template>
