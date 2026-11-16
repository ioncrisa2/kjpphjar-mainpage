<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
}

const props = defineProps<{
  items: BreadcrumbItem[]
}>()

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const baseUrl = String(runtimeConfig.public.baseUrl || 'https://kjpp-hjar.co.id')
  .replace('://www.', '://')
  .replace(/\/$/, '')

function cleanLabel(label: string) {
  return String(label || '').replace(/^\/+\s*/, '').trim()
}

// Generate BreadcrumbList Schema JSON-LD
const schema = computed(() => {
  const currentPath = route.path === '/' ? '' : route.path.replace(/\/+$/, '')
  const itemListElement = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Beranda",
      "item": baseUrl
    },
    ...props.items.map((item, index) => {
      const position = index + 2
      const isLast = index === props.items.length - 1
      const targetPath = item.to || (isLast ? currentPath : '')
      const url = targetPath ? `${baseUrl}${targetPath.startsWith('/') ? '' : '/'}${targetPath}` : undefined
      return {
        "@type": "ListItem",
        "position": position,
        "name": cleanLabel(item.label),
        ...(url ? { "item": url } : {})
      }
    })
  ]

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  }
})

// Disuntikkan lewat useHead: tag <script> di dalam template dibuang oleh compiler Vue di sisi klien
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify(schema.value).replace(/</g, '\\u003c')),
    },
  ],
})
</script>

<template>
  <nav aria-label="Breadcrumb" class="py-3">
    <ol class="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <li>
        <NuxtLink to="/" class="hover:text-primary transition-colors">
          Beranda
        </NuxtLink>
      </li>
      <li v-for="(item, index) in items" :key="index" class="flex items-center gap-2">
        <Icon name="ph:caret-right-bold" class="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden="true" />
        <NuxtLink 
          v-if="item.to" 
          :to="item.to" 
          class="hover:text-primary transition-colors"
        >
          {{ cleanLabel(item.label) }}
        </NuxtLink>
        <span 
          v-else 
          class="text-gray-900 dark:text-gray-200 font-semibold" 
          aria-current="page"
        >
          {{ cleanLabel(item.label) }}
        </span>
      </li>
    </ol>
  </nav>
</template>
