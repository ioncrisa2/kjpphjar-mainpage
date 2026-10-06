<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
}

const props = defineProps<{
  items: BreadcrumbItem[]
}>()

const runtimeConfig = useRuntimeConfig()
const baseUrl = runtimeConfig.public.baseUrl || 'https://kjpphjar.com'

// Generate BreadcrumbList Schema JSON-LD
const schema = computed(() => {
  const itemListElement = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Beranda",
      "item": baseUrl
    },
    ...props.items.map((item, index) => {
      const position = index + 2
      const url = item.to ? `${baseUrl}${item.to}` : undefined
      return {
        "@type": "ListItem",
        "position": position,
        "name": item.label,
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
</script>

<template>
  <nav aria-label="Breadcrumb" class="py-3">
    <ol class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
      <li>
        <NuxtLink to="/" class="hover:text-primary transition-colors">
          Beranda
        </NuxtLink>
      </li>
      <li v-for="(item, index) in items" :key="index" class="flex items-center space-x-2">
        <span class="text-gray-400">/</span>
        <NuxtLink 
          v-if="item.to" 
          :to="item.to" 
          class="hover:text-primary transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
        <span 
          v-else 
          class="text-gray-900 dark:text-gray-200 font-semibold" 
          aria-current="page"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>

    <!-- Schema Markup Injection -->
    <Head>
      <script type="application/ld+json">
        {{ JSON.stringify(schema) }}
      </script>
    </Head>
  </nav>
</template>
