<template>
  <div class="wysiwyg-wrapper bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden text-gray-900">
    <ClientOnly fallback-tag="div" fallback="Loading editor...">
      <QuillEditor
        v-model:content="internalValue"
        content-type="html"
        toolbar="full"
        class="min-h-[250px]"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
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
</style>
