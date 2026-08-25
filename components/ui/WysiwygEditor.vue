<template>
  <div class="wysiwyg-wrapper relative overflow-hidden rounded-xl border border-gray-300 bg-white text-gray-900 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
    <ClientOnly fallback-tag="div" fallback="Loading editor...">
      <QuillEditor
        content-type="html"
        toolbar="full"
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
      @change="uploadImage"
    >
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
})

const emit = defineEmits(['update:modelValue'])

const imageInput = ref<HTMLInputElement | null>(null)
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

async function uploadImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !quillInstance || !props.imageUploadUrl) return

  uploading.value = true
  uploadError.value = ''
  try {
    const body = new FormData()
    body.append('image', file)
    const result = await $fetch<{ url: string }>(props.imageUploadUrl, { method: 'POST', body })
    const selection = quillInstance.getSelection(true)
    const index = selection?.index ?? Math.max(0, quillInstance.getLength() - 1)
    quillInstance.insertEmbed(index, 'image', result.url, 'user')
    quillInstance.setSelection(index + 1, 0, 'silent')
  } catch (error: any) {
    uploadError.value = error?.data?.statusMessage || 'Gambar gagal diunggah. Coba file lain.'
  } finally {
    uploading.value = false
    input.value = ''
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
