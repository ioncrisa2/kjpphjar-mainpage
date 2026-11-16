<template>
  <div class="wysiwyg-wrapper relative overflow-hidden rounded-xl border border-gray-300 bg-white text-gray-900 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
    <ClientOnly fallback-tag="div" fallback="Loading editor...">
      <QuillEditor
        content-type="html"
        :toolbar="toolbar"
        class="min-h-[250px]"
        @ready="handleReady"
        @text-change="handleTextChange"
      />
    </ClientOnly>
    <input
      ref="imageInput"
      class="sr-only"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      tabindex="-1"
      @change="onSelectImageFile"
    >
    <div
      v-if="pendingImageFile"
      class="border-t border-gray-200 bg-slate-50 p-4 text-sm text-gray-900"
      role="region"
      aria-label="Form unggah gambar blog"
    >
      <p class="font-bold text-gray-900">Unggah Gambar Artikel: {{ pendingImageFile.name }}</p>
      <div class="mt-2">
        <label for="wysiwyg-image-alt" class="mb-1 block text-xs font-bold text-gray-700">
          Teks Alt Gambar (Wajib untuk SEO &amp; Aksesibilitas) <span class="text-red-600">*</span>
        </label>
        <input
          id="wysiwyg-image-alt"
          v-model="pendingImageAlt"
          type="text"
          required
          maxlength="200"
          placeholder="Contoh: Penilai publik KJPP HJA'R melakukan inspeksi ruko di Palembang"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary"
          @keydown.enter.prevent="confirmUploadImage"
        >
        <p v-if="altValidationError" class="mt-1 text-xs font-semibold text-red-600" role="alert">
          {{ altValidationError }}
        </p>
      </div>
      <div class="mt-3 flex items-center gap-2">
        <button
          type="button"
          :disabled="uploading"
          class="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-black transition hover:bg-sky-400 disabled:opacity-50"
          @click="confirmUploadImage"
        >
          Unggah &amp; Sisipkan Gambar
        </button>
        <button
          type="button"
          :disabled="uploading"
          class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
          @click="cancelPendingImage"
        >
          Batal
        </button>
      </div>
    </div>
    <div
      v-if="uploading"
      class="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800"
      aria-live="polite"
    >
      <Icon name="ph:spinner-gap-bold" class="animate-spin text-base" />
      Mengunggah dan mengoptimalkan gambar…
    </div>
    <p v-if="uploadError" class="m-0 bg-red-50 px-4 py-2 text-sm text-red-700" role="alert">
      {{ uploadError }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  imageUploadUrl: {
    type: String,
    default: '',
  },
  ariaLabel: {
    type: String,
    default: 'Editor konten',
  },
  toolbar: {
    type: [String, Array],
    default: 'full',
  },
})

const emit = defineEmits(['update:modelValue'])

const imageInput = ref<HTMLInputElement | null>(null)
const pendingImageFile = ref<File | null>(null)
const pendingImageAlt = ref('')
const altValidationError = ref('')
const uploading = ref(false)
const uploadError = ref('')
let quillInstance: any = null
let hydrationVersion = 0

function hydrateEditor(value: string) {
  if (!quillInstance) return
  const currentValue = quillInstance.getSemanticHTML?.()
  if (currentValue === value) return
  if (!value) {
    quillInstance.setText('', 'silent')
    return
  }
  quillInstance.setContents(quillInstance.clipboard.convert({ html: value }), 'silent')
}

function scheduleHydration(value: string) {
  const version = ++hydrationVersion
  void nextTick(() => {
    setTimeout(() => {
      if (version === hydrationVersion) hydrateEditor(value)
    }, 0)
  })
}

function handleReady(quill: any) {
  quillInstance = quill
  scheduleHydration(props.modelValue)
  quill.root?.setAttribute('aria-label', props.ariaLabel)
  if (props.imageUploadUrl) {
    quill.getModule('toolbar')?.addHandler('image', () => {
      if (!uploading.value) imageInput.value?.click()
    })
  }
}

function handleTextChange() {
  const value = quillInstance?.getSemanticHTML?.()
  if (typeof value === 'string' && value !== props.modelValue) {
    emit('update:modelValue', value)
  }
}

function getSemanticHtml() {
  const value = quillInstance?.getSemanticHTML?.()
  return typeof value === 'string' ? value : props.modelValue
}

defineExpose({ getSemanticHtml })

watch(
  () => props.modelValue,
  (value) => scheduleHydration(value),
)

function onSelectImageFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !quillInstance || !props.imageUploadUrl) return
  pendingImageFile.value = file
  pendingImageAlt.value = ''
  altValidationError.value = ''
  uploadError.value = ''
  input.value = ''
}

function cancelPendingImage() {
  pendingImageFile.value = null
  pendingImageAlt.value = ''
  altValidationError.value = ''
}

async function confirmUploadImage() {
  const file = pendingImageFile.value
  const altText = pendingImageAlt.value.trim()
  if (!file || !quillInstance || !props.imageUploadUrl) return

  if (!altText) {
    altValidationError.value = 'Teks alt wajib diisi sebelum mengunggah gambar.'
    return
  }

  altValidationError.value = ''
  uploading.value = true
  uploadError.value = ''
  try {
    const body = new FormData()
    body.append('image', file)
    body.append('alt', altText)
    const result = await $fetch<{ url: string }>(props.imageUploadUrl, { method: 'POST', body })
    const selection = quillInstance.getSelection(true)
    const index = selection?.index ?? Math.max(0, quillInstance.getLength() - 1)
    quillInstance.insertEmbed(index, 'image', result.url, 'user')
    await nextTick()
    const imgs = quillInstance.root?.querySelectorAll?.(`img[src="${result.url}"]`) || []
    for (const img of imgs) {
      if (!img.getAttribute('alt')) {
        img.setAttribute('alt', altText)
      }
    }
    quillInstance.setSelection(index + 1, 0, 'silent')
    handleTextChange()
    cancelPendingImage()
  } catch (error: any) {
    uploadError.value = error?.data?.statusMessage || 'Gambar gagal diunggah. Coba file lain.'
  } finally {
    uploading.value = false
  }
}
</script>

<style>
.wysiwyg-wrapper .ql-toolbar {
  border: none;
  border-bottom: 1px solid #d1d5db;
  background-color: #f9fafb;
}
.wysiwyg-wrapper .ql-container {
  border: none;
  min-height: 250px;
}
.wysiwyg-wrapper .ql-editor {
  min-height: 320px;
  font-size: 1rem;
  line-height: 1.75;
}
.wysiwyg-wrapper .ql-editor img {
  max-width: 100%;
  height: auto;
}
</style>
