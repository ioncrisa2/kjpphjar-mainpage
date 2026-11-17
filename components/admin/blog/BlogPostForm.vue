<script setup lang="ts">
import BlogPreviewModal from '~/components/admin/blog/BlogPreviewModal.vue'
import { BLOG_EDITOR_TOOLBAR } from '~/utils/blog-content'

const props = withDefaults(defineProps<{
  initialValue?: Record<string, any> | null
  saving?: boolean
  submitLabel?: string
}>(), {
  initialValue: null,
  saving: false,
  submitLabel: 'Simpan Artikel',
})

const emit = defineEmits<{ submit: [event: { payload: FormData; stay: boolean }] }>()

const { data: categoryData } = await useFetch('/api/admin/categories')
const categories = computed(() => categoryData.value?.items || [])

const { data: leadersData } = await useFetch('/api/leaders')
const leaders = computed(() => leadersData.value || [])

const { data: tagsData } = await useFetch<{ items: Array<{ name: string; count: number }> }>('/api/admin/blog/tags')
const tagSuggestions = computed(() => tagsData.value?.items || [])

const { data: featuredData } = await useFetch<{ activeFeatured?: { _id: string; title: string; slug: string } | null }>('/api/admin/blog', {
  query: { limit: 1 },
})
const currentActiveFeatured = computed(() => {
  const active = featuredData.value?.activeFeatured
  if (!active || active._id === props.initialValue?._id) return null
  return active
})

// Pembatasan berikut juga ditegakkan server; di sini hanya menyesuaikan tampilan.
const { can, session } = useAdminAuth()
const canPublish = computed(() => can('blog.publish'))
const canManageAll = computed(() => can('blog.manage_all'))
const lockedAuthor = computed(() => {
  const leader = leaders.value.find((l: any) => l._id === session.value?.leaderId)
  return leader ? `${leader.name} — ${leader.position}` : session.value?.name || ''
})

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
  editorialNote: '',
})

const contentEditor = ref<{ getSemanticHtml: () => string } | null>(null)
const selectedCover = ref<File | null>(null)
const removeCover = ref(false)
const hydratedKey = ref('')
const previewOpen = ref(false)
const allowLeave = ref(false)
const baselineSnapshot = ref('')

const draftStorageKey = computed(() => `kjpphjar:blog-draft:${props.initialValue?._id || 'new'}`)
const recoverableDraft = ref<{ savedAt: number; data: Record<string, any> } | null>(null)
const lastAutoSavedAt = ref<number | null>(null)

function toLocalDateTime(value: unknown) {
  if (!value) return ''
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return ''
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

function getFormSnapshot() {
  return JSON.stringify({
    title: form.title,
    slug: form.slug,
    excerpt: form.excerpt,
    content: form.content,
    categoryId: form.categoryId,
    leaderId: form.leaderId,
    tags: form.tags,
    metaTitle: form.metaTitle,
    metaDescription: form.metaDescription,
    status: form.status,
    publishedAt: form.publishedAt,
    isFeatured: form.isFeatured,
    author: form.author,
    editorialNote: form.editorialNote,
    hasNewCover: Boolean(selectedCover.value),
    removeCover: removeCover.value,
  })
}

const isDirty = computed(() => Boolean(baselineSnapshot.value) && getFormSnapshot() !== baselineSnapshot.value)

function onLeaderChange() {
  if (form.leaderId) {
    const selected = leaders.value.find((l: any) => l._id === form.leaderId)
    if (selected) {
      form.author = selected.name
    }
  }
}

watch(() => props.initialValue, (article) => {
  if (!article) {
    if (!baselineSnapshot.value) {
      baselineSnapshot.value = getFormSnapshot()
    }
    return
  }
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
  form.editorialNote = article.editorialNote || ''
  selectedCover.value = null
  removeCover.value = false
  nextTick(() => {
    baselineSnapshot.value = getFormSnapshot()
  })
}, { immediate: true })

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

const slugChangedOnPublished = computed(() => {
  const article = props.initialValue
  if (!article) return false
  const wasPublished = article.status === 'published' || article.isPublished || Boolean(article.publishedAt)
  return wasPublished && Boolean(article.slug) && suggestedSlug.value !== article.slug
})

const scheduledInPast = computed(() => {
  if (form.status !== 'scheduled' || !form.publishedAt) return false
  const target = new Date(form.publishedAt).getTime()
  return Number.isFinite(target) && target <= Date.now()
})

const existingCover = computed(() => removeCover.value ? '' : props.initialValue?.coverImageUrl || '')
const selectedCoverObjectUrl = ref('')

watch(selectedCover, (file) => {
  if (selectedCoverObjectUrl.value) {
    URL.revokeObjectURL(selectedCoverObjectUrl.value)
    selectedCoverObjectUrl.value = ''
  }
  if (file && import.meta.client) {
    selectedCoverObjectUrl.value = URL.createObjectURL(file)
  }
})

const previewCoverUrl = computed(() => selectedCoverObjectUrl.value || existingCover.value)
const selectedCategoryName = computed(() => categories.value.find((c: any) => c._id === form.categoryId)?.name || '')
const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    draft: 'Draft',
    in_review: 'Siap Review',
    published: 'Published',
    scheduled: 'Terjadwal',
  }
  return labels[form.status] || 'Draft'
})

function onCoverChange(file: File | null) {
  if (file) removeCover.value = false
}

function clearCover() {
  selectedCover.value = null
  removeCover.value = true
}

function checkRecoverableDraft() {
  if (!import.meta.client) return
  try {
    const raw = localStorage.getItem(draftStorageKey.value)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (!parsed?.data || !parsed?.savedAt) return
    const serverUpdated = props.initialValue?.updatedAt ? new Date(props.initialValue.updatedAt).getTime() : 0
    if (serverUpdated && parsed.savedAt <= serverUpdated) {
      localStorage.removeItem(draftStorageKey.value)
      return
    }
    const differs = JSON.stringify(parsed.data) !== JSON.stringify({
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      categoryId: form.categoryId,
      leaderId: form.leaderId,
      tags: form.tags,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      status: form.status,
      publishedAt: form.publishedAt,
      isFeatured: form.isFeatured,
      author: form.author,
      editorialNote: form.editorialNote,
    })
    if (differs) {
      recoverableDraft.value = parsed
    }
  } catch {
    // Abaikan data localStorage yang rusak.
  }
}

function restoreLocalDraft() {
  if (!recoverableDraft.value) return
  const draft = recoverableDraft.value.data
  form.title = draft.title || ''
  form.slug = draft.slug || ''
  form.excerpt = draft.excerpt || ''
  form.content = draft.content || ''
  form.categoryId = draft.categoryId || ''
  form.leaderId = draft.leaderId || ''
  form.tags = Array.isArray(draft.tags) ? [...draft.tags] : []
  form.metaTitle = draft.metaTitle || ''
  form.metaDescription = draft.metaDescription || ''
  form.status = draft.status || form.status
  form.publishedAt = draft.publishedAt || ''
  form.isFeatured = Boolean(draft.isFeatured)
  form.editorialNote = draft.editorialNote || ''
  if (draft.author) form.author = draft.author
  recoverableDraft.value = null
  toast.info('Draf lokal berhasil dipulihkan.')
}

function discardLocalDraft() {
  recoverableDraft.value = null
  clearLocalDraft()
}

function clearLocalDraft() {
  if (!import.meta.client) return
  try {
    localStorage.removeItem(draftStorageKey.value)
    lastAutoSavedAt.value = null
  } catch {
    // Ignore storage errors.
  }
}

function markSaved(enableLeave = false) {
  clearLocalDraft()
  baselineSnapshot.value = getFormSnapshot()
  if (enableLeave) allowLeave.value = true
}

defineExpose({ clearLocalDraft, markSaved })

let autoSaveTimer: ReturnType<typeof setTimeout> | null = null
watch(
  () => getFormSnapshot(),
  () => {
    if (!import.meta.client || !baselineSnapshot.value || !isDirty.value) return
    if (autoSaveTimer) clearTimeout(autoSaveTimer)
    autoSaveTimer = setTimeout(() => {
      try {
        const savedAt = Date.now()
        localStorage.setItem(draftStorageKey.value, JSON.stringify({
          savedAt,
          data: {
            title: form.title,
            slug: form.slug,
            excerpt: form.excerpt,
            content: contentEditor.value?.getSemanticHtml() || form.content,
            categoryId: form.categoryId,
            leaderId: form.leaderId,
            tags: form.tags,
            metaTitle: form.metaTitle,
            metaDescription: form.metaDescription,
            status: form.status,
            publishedAt: form.publishedAt,
            isFeatured: form.isFeatured,
            author: form.author,
            editorialNote: form.editorialNote,
          },
        }))
        lastAutoSavedAt.value = savedAt
      } catch {
        // Ignore quota errors.
      }
    }, 1500)
  },
)

const { ask } = useConfirm()
const toast = useToast()

function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (!isDirty.value || allowLeave.value) return
  event.preventDefault()
  event.returnValue = ''
}

function handleKeyboardShortcut(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault()
    if (!props.saving) submitForm(true)
  }
}

onMounted(() => {
  if (!import.meta.client) return
  if (!baselineSnapshot.value) baselineSnapshot.value = getFormSnapshot()
  checkRecoverableDraft()
  window.addEventListener('beforeunload', handleBeforeUnload)
  window.addEventListener('keydown', handleKeyboardShortcut)
})

onBeforeUnmount(() => {
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  if (selectedCoverObjectUrl.value) URL.revokeObjectURL(selectedCoverObjectUrl.value)
  if (import.meta.client) {
    window.removeEventListener('beforeunload', handleBeforeUnload)
    window.removeEventListener('keydown', handleKeyboardShortcut)
  }
})

onBeforeRouteLeave(async () => {
  if (!isDirty.value || allowLeave.value) return true
  const confirmed = await ask({
    title: 'Tinggalkan Halaman?',
    message: 'Masih ada perubahan yang belum disimpan ke server. Yakin ingin keluar dari editor?',
    confirmText: 'Ya, Keluar',
    cancelText: 'Tetap di Sini',
  })
  return confirmed
})

function submitForm(stay = false) {
  if (form.status === 'scheduled' && !form.publishedAt) {
    toast.error('Pilih tanggal dan waktu terbit untuk artikel terjadwal.')
    return
  }

  const latestHtml = contentEditor.value?.getSemanticHtml() || form.content
  form.content = latestHtml

  const payload = new FormData()
  if (selectedCover.value) payload.append('image', selectedCover.value)
  payload.append('title', form.title)
  payload.append('slug', form.slug)
  payload.append('excerpt', form.excerpt)
  payload.append('content', latestHtml)
  payload.append('categoryId', form.categoryId)
  payload.append('leaderId', form.leaderId)
  payload.append('tags', JSON.stringify(form.tags))
  payload.append('metaTitle', form.metaTitle)
  payload.append('metaDescription', form.metaDescription)
  payload.append('status', form.status)
  payload.append('publishedAt', form.publishedAt ? new Date(form.publishedAt).toISOString() : '')
  payload.append('isFeatured', String(form.isFeatured))
  payload.append('author', form.author)
  payload.append('editorialNote', form.editorialNote)
  payload.append('removeCover', String(removeCover.value))
  emit('submit', { payload, stay })
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="submitForm(false)">
    <!-- Banner pemulihan draf lokal -->
    <div
      v-if="recoverableDraft"
      class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3.5 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100"
      role="status"
    >
      <div class="flex items-center gap-2.5">
        <Icon name="ph:clock-counter-clockwise-bold" class="text-lg shrink-0 text-amber-700 dark:text-amber-300" />
        <span>
          Ditemukan draf lokal yang belum tersimpan ke server ({{ new Date(recoverableDraft.savedAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) }}).
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button type="button" class="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-amber-700" @click="restoreLocalDraft">
          Pulihkan draf
        </button>
        <button type="button" class="rounded-lg px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-200/60 dark:text-amber-200 dark:hover:bg-white/10" @click="discardLocalDraft">
          Abaikan
        </button>
      </div>
    </div>

    <!-- Catatan revisi dari editor untuk penulis -->
    <div
      v-if="form.editorialNote && !canPublish"
      class="flex items-start gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4 text-sm text-indigo-950 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-100"
    >
      <Icon name="ph:chat-centered-text-bold" class="mt-0.5 text-lg shrink-0 text-indigo-600 dark:text-indigo-300" />
      <div>
        <p class="font-bold">Catatan Revisi dari Editor</p>
        <p class="mt-1 leading-relaxed">{{ form.editorialNote }}</p>
      </div>
    </div>

    <div class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div class="space-y-6">
        <section class="admin-card space-y-5" aria-labelledby="article-content-heading">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="article-content-heading" class="text-lg font-extrabold text-black dark:text-white">Isi artikel</h2>
              <p class="mt-1 text-sm text-gray">Susun judul, ringkasan, dan konten utama yang akan dibaca publik.</p>
            </div>
            <div class="flex items-center gap-2">
              <span
                v-if="lastAutoSavedAt"
                class="hidden items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 sm:inline-flex"
              >
                <Icon name="ph:cloud-check-bold" /> Draf lokal tersimpan
              </span>
              <button
                type="button"
                class="admin-btn-ghost !py-2 !px-3.5 text-xs"
                @click="previewOpen = true"
              >
                <Icon name="ph:eye-bold" /> Pratinjau
              </button>
            </div>
          </div>

          <div>
            <label for="blog-title" class="admin-label">Judul artikel</label>
            <input id="blog-title" v-model="form.title" type="text" maxlength="180" required class="admin-input" placeholder="Judul yang spesifik dan mudah dipahami">
          </div>

          <div>
            <label for="blog-slug" class="admin-label">Slug URL</label>
            <div class="flex overflow-hidden rounded-xl border border-gray/20 bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/15 dark:bg-gray-dark">
              <span class="hidden items-center border-r border-gray/20 bg-slate-50 px-3 text-sm text-gray dark:border-white/15 dark:bg-white/5 dark:text-slate-300 sm:flex">/blog/</span>
              <input id="blog-slug" v-model="form.slug" type="text" maxlength="180" class="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-black outline-none dark:text-white" :placeholder="suggestedSlug || 'otomatis-dari-judul'">
            </div>
            <p
              v-if="slugChangedOnPublished"
              class="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300"
            >
              <Icon name="ph:warning-bold" class="shrink-0" />
              Slug artikel yang sudah terbit berubah. URL lama akan otomatis dialihkan (301) ke URL baru setelah disimpan.
            </p>
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
              :toolbar="BLOG_EDITOR_TOOLBAR"
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
              <span class="mb-1.5 text-xs" :class="form.metaTitle.length > 60 ? 'text-amber-700 dark:text-amber-300' : 'text-gray'">{{ form.metaTitle.length }}/70</span>
            </div>
            <input id="meta-title" v-model="form.metaTitle" type="text" maxlength="70" class="admin-input" placeholder="Idealnya 50-60 karakter">
          </div>
          <div>
            <div class="flex items-end justify-between gap-4">
              <label for="meta-description" class="admin-label">Meta description</label>
              <span class="mb-1.5 text-xs" :class="form.metaDescription.length > 160 ? 'text-amber-700 dark:text-amber-300' : 'text-gray'">{{ form.metaDescription.length }}/180</span>
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
          <div v-if="canPublish">
            <label for="blog-status" class="admin-label">Status</label>
            <select id="blog-status" v-model="form.status" class="admin-input">
              <option value="draft">Draft</option>
              <option value="in_review">Siap Review</option>
              <option value="published">Published</option>
              <option value="scheduled">Terjadwal</option>
            </select>
          </div>
          <div v-else class="space-y-2.5">
            <label for="blog-status-writer" class="admin-label">Status pengajuan</label>
            <select id="blog-status-writer" v-model="form.status" class="admin-input">
              <option value="draft">Draft (masih dikerjakan)</option>
              <option value="in_review">Siap Review (kirim ke editor)</option>
            </select>
            <p class="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
              Pilih <strong>Siap Review</strong> jika artikel sudah selesai ditulis agar editor meninjau dan menerbitkannya.
            </p>
          </div>

          <div v-if="canPublish && (form.status === 'published' || form.status === 'scheduled')">
            <label for="published-at" class="admin-label">Tanggal & waktu terbit</label>
            <input id="published-at" v-model="form.publishedAt" type="datetime-local" :required="form.status === 'scheduled'" class="admin-input">
            <p v-if="scheduledInPast" class="mt-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
              Waktu terbit sudah lewat; artikel akan langsung tampil ke publik saat disimpan.
            </p>
            <p v-else class="mt-1.5 text-xs text-gray">Zona waktu mengikuti perangkat admin.</p>
          </div>

          <div v-if="canPublish && (form.status === 'draft' || form.status === 'in_review')">
            <label for="editorial-note" class="admin-label">Catatan revisi editor (opsional)</label>
            <textarea
              id="editorial-note"
              v-model="form.editorialNote"
              rows="2"
              maxlength="500"
              class="admin-input resize-y text-xs"
              placeholder="Contoh: Tambahkan sumber regulasi SPI atau perbaiki ringkasan."
            ></textarea>
          </div>

          <div v-if="canManageAll" class="space-y-2">
            <label class="flex cursor-pointer items-start gap-3 rounded-xl bg-blue-50 p-3 text-sm text-slate-800 dark:bg-blue-500/10 dark:text-slate-100">
              <input v-model="form.isFeatured" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
              <span><strong class="block">Artikel unggulan</strong>Tampil pada banner utama halaman blog.</span>
            </label>
            <p v-if="form.isFeatured && currentActiveFeatured" class="text-xs text-amber-700 dark:text-amber-300">
              Info: Banner utama saat ini menampilkan <strong>{{ currentActiveFeatured.title }}</strong> (hanya 1 artikel unggulan terbaru yang tampil di banner).
            </p>
          </div>
        </section>

        <section class="admin-card space-y-5" aria-labelledby="classification-heading">
          <div class="flex items-center justify-between gap-3">
            <h2 id="classification-heading" class="text-lg font-extrabold text-black dark:text-white">Klasifikasi</h2>
            <NuxtLink v-if="can('blog.categories')" to="/admin/blog/categories" class="text-xs font-bold text-primary hover:underline">Kelola</NuxtLink>
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
            <AdminBlogTagInput v-model="form.tags" :suggestions="tagSuggestions" />
          </div>
          <div v-if="!canManageAll">
            <span class="admin-label">Penulis</span>
            <p class="text-sm font-semibold text-black dark:text-white">{{ lockedAuthor }}</p>
            <p class="mt-1 text-xs text-gray">Penulis mengikuti akun Anda dan tidak dapat diubah.</p>
          </div>
          <div v-if="canManageAll">
            <label for="blog-leader" class="admin-label">Penulis (Pimpinan Rekan)</label>
            <select id="blog-leader" v-model="form.leaderId" class="admin-input" @change="onLeaderChange">
              <option value="">Nama Manual / Tim Redaksi</option>
              <option v-for="leader in leaders" :key="leader._id" :value="leader._id">
                {{ leader.name }} — {{ leader.position }}
              </option>
            </select>
          </div>
          <div v-if="canManageAll">
            <label for="blog-author" class="admin-label">Nama Tampilan Penulis</label>
            <input id="blog-author" v-model="form.author" type="text" maxlength="100" class="admin-input" placeholder="Contoh: Admin / Tim Redaksi / Nama Penulis">
          </div>
        </section>

        <section class="admin-card space-y-4" aria-labelledby="cover-heading">
          <h2 id="cover-heading" class="text-lg font-extrabold text-black dark:text-white">Cover artikel</h2>
          <UiMediaInput
            v-model="selectedCover"
            :existing-url="existingCover"
            accept="image/jpeg,image/png,image/webp"
            preview-aspect="cover"
            removable
            :max-bytes="4 * 1024 * 1024"
            hint="JPG, PNG, atau WebP. Maksimal 4 MB; server otomatis mengoptimalkan gambar."
            @update:model-value="onCoverChange"
            @remove-existing="clearCover"
          />
        </section>

        <div class="space-y-2.5">
          <button
            type="submit"
            :disabled="saving"
            class="admin-btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon v-if="saving" name="ph:spinner-gap-bold" class="animate-spin" />
            {{ saving ? 'Menyimpan…' : submitLabel }}
          </button>
          <div class="flex gap-2.5">
            <NuxtLink to="/admin/blog" class="admin-btn-ghost flex-1 justify-center">Batal</NuxtLink>
            <button
              type="button"
              :disabled="saving"
              class="admin-btn-ghost flex-1 justify-center disabled:cursor-not-allowed disabled:opacity-50"
              title="Simpan tanpa keluar dari editor (Ctrl+S)"
              @click="submitForm(true)"
            >
              <Icon name="ph:floppy-disk-bold" />
              Simpan &amp; lanjut
            </button>
          </div>
        </div>
      </aside>
    </div>

    <BlogPreviewModal
      v-model="previewOpen"
      :title="form.title"
      :excerpt="form.excerpt"
      :content="contentEditor?.getSemanticHtml() || form.content"
      :cover-url="previewCoverUrl"
      :category-name="selectedCategoryName"
      :tags="form.tags"
      :author="canManageAll ? form.author : lockedAuthor"
      :reading-time="readingTime"
      :status-label="statusLabel"
    />
  </form>
</template>
