<script setup lang="ts">
export type MediaPreviewAspect = 'contain' | 'cover' | 'square'

const props = withDefaults(
  defineProps<{
    modelValue?: File | null
    existingUrl?: string
    accept?: string
    label?: string
    hint?: string
    required?: boolean
    removable?: boolean
    previewAspect?: MediaPreviewAspect
    maxBytes?: number
    id?: string
  }>(),
  {
    modelValue: null,
    existingUrl: '',
    accept: 'image/*',
    label: '',
    hint: '',
    required: false,
    removable: false,
    previewAspect: 'contain',
    maxBytes: 0,
    id: '',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', file: File | null): void
  (e: 'change', file: File | null): void
  (e: 'remove-existing'): void
  (e: 'error', message: string): void
}>()

const fallbackId = useId()
const inputId = computed(() => props.id || `media-input-${fallbackId}`)
const inputRef = ref<HTMLInputElement | null>(null)
const objectUrl = ref('')
const isDragging = ref(false)
const validationError = ref('')

const IMAGE_EXTENSION_PATTERN = /\.(?:avif|bmp|gif|ico|jpe?g|png|svg|webp)$/i

function isImageFile(file: File | null | undefined): boolean {
  if (!file) return false
  if (file.type.startsWith('image/')) return true
  return IMAGE_EXTENSION_PATTERN.test(file.name)
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(kb >= 100 ? 0 : 1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(mb >= 10 ? 1 : 2)} MB`
}

function getFileExtension(name: string): string {
  const idx = name.lastIndexOf('.')
  return idx >= 0 ? name.slice(idx + 1).toUpperCase() : 'FILE'
}

function getDocumentIcon(name: string): string {
  const ext = getFileExtension(name).toLowerCase()
  if (ext === 'json') return 'ph:file-code-bold'
  if (ext === 'pdf') return 'ph:file-pdf-bold'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'ph:file-xls-bold'
  if (['doc', 'docx'].includes(ext)) return 'ph:file-doc-bold'
  if (['zip', 'rar', '7z'].includes(ext)) return 'ph:file-zip-bold'
  return 'ph:file-text-bold'
}

function revokeObjectUrl() {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value)
    objectUrl.value = ''
  }
}

watch(
  () => props.modelValue,
  (file) => {
    revokeObjectUrl()
    if (import.meta.client && file && isImageFile(file)) {
      objectUrl.value = URL.createObjectURL(file)
    }
    if (!file && inputRef.value) {
      inputRef.value.value = ''
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  revokeObjectUrl()
})

const hasSelectedFile = computed(() => Boolean(props.modelValue))
const hasExistingImage = computed(() => !props.modelValue && Boolean(props.existingUrl))
const hasPreview = computed(() => hasSelectedFile.value || hasExistingImage.value)
const previewImageSrc = computed(() => {
  if (objectUrl.value) return objectUrl.value
  if (!props.modelValue && props.existingUrl) return props.existingUrl
  return ''
})
const isImagePreview = computed(() => Boolean(previewImageSrc.value))

const previewImageClass = computed(() => {
  if (props.previewAspect === 'cover') return 'aspect-[16/10] w-full object-cover'
  if (props.previewAspect === 'square') return 'h-36 w-36 rounded-xl object-cover mx-auto'
  return 'max-h-40 w-full object-contain'
})

const acceptsDocuments = computed(() => !props.accept.startsWith('image/'))

function applyFile(file: File | null) {
  validationError.value = ''

  if (file && props.maxBytes > 0 && file.size > props.maxBytes) {
    const message = `Ukuran file melebihi batas ${formatBytes(props.maxBytes)}.`
    validationError.value = message
    if (inputRef.value) inputRef.value.value = ''
    emit('update:modelValue', null)
    emit('change', null)
    emit('error', message)
    return
  }

  emit('update:modelValue', file)
  emit('change', file)
}

function onInputChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] || null
  applyFile(file)
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0] || null
  if (!file) return

  if (inputRef.value && typeof DataTransfer !== 'undefined') {
    const dt = new DataTransfer()
    dt.items.add(file)
    inputRef.value.files = dt.files
  }
  applyFile(file)
}

function openPicker() {
  inputRef.value?.click()
}

function clear() {
  validationError.value = ''
  if (inputRef.value) inputRef.value.value = ''
  if (props.modelValue) {
    emit('update:modelValue', null)
    emit('change', null)
  } else if (props.existingUrl) {
    emit('remove-existing')
  }
}

defineExpose({ clear, openPicker })
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" :for="inputId" class="admin-label">
      {{ label }}
      <span v-if="required && !hasPreview" class="text-red-500">*</span>
    </label>

    <!-- Hidden/accessible file input mounted inside relative wrapper when empty or triggered via openPicker -->
    <div
      class="relative rounded-xl border transition-colors"
      :class="[
        isDragging
          ? 'border-primary bg-primary/5'
          : hasPreview
          ? 'border-gray/15 bg-stone-50/70 dark:border-white/10 dark:bg-gray-800/40'
          : 'border-dashed border-gray/30 bg-stone-50/60 hover:border-primary/60 dark:border-white/15 dark:bg-gray-800/30',
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <input
        :id="inputId"
        ref="inputRef"
        type="file"
        :accept="accept"
        :required="required && !hasPreview"
        :class="hasPreview ? 'sr-only' : 'absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0'"
        @change="onInputChange"
      />

      <!-- Empty Dropzone State -->
      <div
        v-if="!hasPreview"
        class="flex flex-col items-center justify-center gap-2 px-4 py-6 text-center"
      >
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-xs ring-1 ring-gray/10 dark:bg-gray-dark dark:ring-white/10">
          <Icon
            :name="acceptsDocuments ? 'ph:upload-simple-bold' : 'ph:image-bold'"
            class="h-5 w-5"
            aria-hidden="true"
          />
        </span>
        <div>
          <p class="text-xs font-bold text-black dark:text-white">
            Klik untuk pilih file <span class="font-medium text-gray">atau seret ke sini</span>
          </p>
          <p v-if="hint" class="mt-1 text-[11px] text-gray">{{ hint }}</p>
        </div>
      </div>

      <!-- Image Preview State -->
      <div v-else-if="isImagePreview" class="p-3">
        <div class="overflow-hidden rounded-lg border border-gray/10 bg-white p-2 dark:border-white/10 dark:bg-gray-dark">
          <img
            :src="previewImageSrc"
            :alt="modelValue?.name || 'Preview media'"
            :class="previewImageClass"
          />
        </div>

        <div class="mt-3 flex flex-wrap items-center justify-between gap-2 px-0.5">
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-bold text-black dark:text-white" :title="modelValue?.name || 'Gambar saat ini'">
              {{ modelValue?.name || 'Gambar saat ini' }}
            </p>
            <p class="mt-0.5 text-[11px] text-gray">
              <template v-if="modelValue">
                {{ formatBytes(modelValue.size) }} · <span class="font-semibold text-primary">Baru dipilih</span>
              </template>
              <template v-else>
                Tersimpan di server
              </template>
            </p>
          </div>

          <div class="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-lg border border-gray/20 bg-white px-2.5 py-1.5 text-xs font-bold text-black transition hover:border-primary hover:text-primary dark:border-white/15 dark:bg-gray-dark dark:text-white"
              @click="openPicker"
            >
              <Icon name="ph:arrows-clockwise-bold" class="h-3.5 w-3.5" aria-hidden="true" />
              <span>Ganti</span>
            </button>
            <button
              v-if="hasSelectedFile || removable"
              type="button"
              class="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:bg-gray-dark dark:text-red-400 dark:hover:bg-red-500/10"
              :aria-label="hasSelectedFile ? 'Batalkan file terpilih' : 'Hapus gambar'"
              @click="clear"
            >
              <Icon name="ph:trash-bold" class="h-3.5 w-3.5" aria-hidden="true" />
              <span>{{ hasSelectedFile && existingUrl ? 'Reset' : 'Hapus' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Document / Non-Image File Preview State -->
      <div v-else-if="modelValue" class="p-3.5">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Icon :name="getDocumentIcon(modelValue.name)" class="h-5 w-5" aria-hidden="true" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-bold text-black dark:text-white" :title="modelValue.name">
              {{ modelValue.name }}
            </p>
            <div class="mt-1 flex items-center gap-2 text-[11px] text-gray">
              <span class="rounded bg-white px-1.5 py-0.5 font-bold text-gray-700 ring-1 ring-gray/15 dark:bg-gray-dark dark:text-gray-200 dark:ring-white/10">
                {{ getFileExtension(modelValue.name) }}
              </span>
              <span class="tabular-nums">{{ formatBytes(modelValue.size) }}</span>
            </div>
          </div>
          <div class="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-lg border border-gray/20 bg-white px-2.5 py-1.5 text-xs font-bold text-black transition hover:border-primary hover:text-primary dark:border-white/15 dark:bg-gray-dark dark:text-white"
              @click="openPicker"
            >
              <Icon name="ph:arrows-clockwise-bold" class="h-3.5 w-3.5" aria-hidden="true" />
              <span>Ganti</span>
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white p-1.5 text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:bg-gray-dark dark:text-red-400 dark:hover:bg-red-500/10"
              aria-label="Hapus file terpilih"
              @click="clear"
            >
              <Icon name="ph:x-bold" class="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-if="hasPreview && hint" class="text-[11px] leading-4 text-gray">{{ hint }}</p>
    <p v-if="validationError" role="alert" class="text-xs font-semibold text-red-600 dark:text-red-400">
      {{ validationError }}
    </p>
  </div>
</template>
