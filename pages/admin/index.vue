<script setup lang="ts">
import type { PermissionRequirement } from '~/shared/permissions'

definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Dashboard | Admin KJPP HJA'R" })

const { session, can } = useAdminAuth()
const numberFormatter = new Intl.NumberFormat('id-ID')

// Middleware auth mengarahkan ke sini dengan ?akses=ditolak saat halaman tidak boleh diakses.
const route = useRoute()
const shownNotice = computed(() =>
  route.query.akses === 'ditolak' ? 'Anda tidak memiliki akses ke halaman tersebut.' : ''
)
function dismissNotice() {
  navigateTo({ path: '/admin', replace: true })
}

// Endpoint privat hanya dipanggil bila user memiliki izinnya.
const { data: galleryData } = await useFetch('/api/gallery', {
  query: { limit: 1, admin: 'true' },
  immediate: can('gallery.view'),
})
const { data: contactsData } = await useFetch('/api/contacts', {
  query: { limit: 5 },
  immediate: can('contacts.view'),
})
const { data: servicesData } = await useFetch('/api/services', { immediate: can('services.view') })
const { data: careersData } = await useFetch('/api/careers', { immediate: can('careers.view') })
const { data: analyticsData } = await useFetch<{
  periods: {
    last7Days: { views: number; uniqueVisitors: number }
  }
  trend: Array<{ date: string; views: number; uniqueVisitors: number }>
  comparison?: {
    deltaPercent: { views: number | null }
  }
}>('/api/analytics/overview', {
  query: { range: 7, compare: '1' },
  immediate: can('analytics.view'),
})

interface StatCard {
  label: string
  value: number
  icon: string
  to: string
  permission: PermissionRequirement
  highlight?: boolean
}

const stats = computed(() => ([
  { label: can('gallery.manage_all') ? 'Total Foto Galeri' : 'Foto Galeri Saya', value: galleryData.value?.total ?? 0, icon: 'ph:images-bold', to: '/admin/gallery', permission: 'gallery.view' },
  { label: 'Pesan Belum Dibaca', value: contactsData.value?.unread ?? 0, icon: 'ph:envelope-simple-bold', to: '/admin/contacts', permission: 'contacts.view', highlight: true },
  { label: 'Layanan Aktif', value: servicesData.value?.length ?? 0, icon: 'ph:briefcase-bold', to: '/admin/services', permission: 'services.view' },
  { label: 'Lowongan Aktif', value: careersData.value?.length ?? 0, icon: 'ph:identification-card-bold', to: '/admin/careers', permission: 'careers.view' },
] as StatCard[]).filter((stat) => can(stat.permission)))

const recentMessages = computed(() => contactsData.value?.items || [])

// Micro-sparkline SVG coordinates for 7-day trend
const sparklineWidth = 320
const sparklineHeight = 76
const sparklinePoints = computed(() => analyticsData.value?.trend || [])
const sparklineMax = computed(() =>
  Math.max(1, ...sparklinePoints.value.map((p) => p.views))
)
const sparklinePolyline = computed(() => {
  const pts = sparklinePoints.value
  if (!pts.length) return ''
  return pts
    .map((point, index) => {
      const x = pts.length <= 1 ? sparklineWidth / 2 : (index / (pts.length - 1)) * sparklineWidth
      const y = sparklineHeight - 6 - (point.views / sparklineMax.value) * (sparklineHeight - 14)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
})
const sparklineArea = computed(() => {
  const pts = sparklinePoints.value
  if (!pts.length) return ''
  const line = pts
    .map((point, index) => {
      const x = pts.length <= 1 ? sparklineWidth / 2 : (index / (pts.length - 1)) * sparklineWidth
      const y = sparklineHeight - 6 - (point.views / sparklineMax.value) * (sparklineHeight - 14)
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
  return `${line} L ${sparklineWidth} ${sparklineHeight} L 0 ${sparklineHeight} Z`
})
const sparklineDelta = computed(() => analyticsData.value?.comparison?.deltaPercent.views ?? null)
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-extrabold text-black dark:text-white">Dashboard</h1>
      <p class="text-sm text-gray mt-1">
        Selamat datang kembali<span v-if="session?.name">, {{ session.name }}</span>, di admin panel KJPP HJA'R.
      </p>
    </div>

    <div
      v-if="shownNotice"
      role="alert"
      class="flex items-start justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300"
    >
      <span class="flex items-center gap-2">
        <Icon name="ph:lock-key-bold" class="h-4 w-4 shrink-0" aria-hidden="true" />
        {{ shownNotice }}
      </span>
      <button type="button" class="text-amber-700 hover:text-amber-900 dark:text-amber-300" aria-label="Tutup pesan" @click="dismissNotice">
        <Icon name="ph:x-bold" class="h-4 w-4" />
      </button>
    </div>

    <!-- Stats -->
    <div v-if="stats.length" class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <NuxtLink
        v-for="stat in stats"
        :key="stat.label"
        :to="stat.to"
        class="admin-card flex items-center gap-4 transition hover:border-primary/40 hover:shadow-md"
        :class="stat.highlight && stat.value > 0 ? 'border-2 border-primary/50' : ''"
      >
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          :class="stat.highlight && stat.value > 0 ? 'bg-primary/15 text-primary' : 'bg-stone-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'"
        >
          <Icon :name="stat.icon" class="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p class="text-2xl font-extrabold tabular-nums text-black dark:text-white">
            {{ numberFormatter.format(stat.value) }}
          </p>
          <p class="text-xs text-gray">{{ stat.label }}</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Operational Widgets (7-Day Traffic Micro-Chart + Recent Inbox) -->
    <div v-if="can('analytics.view') || can('contacts.view')" class="grid gap-6 lg:grid-cols-2">
      <!-- 7-Day Traffic Sparkline Widget -->
      <section v-if="can('analytics.view')" class="admin-card flex flex-col justify-between gap-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="text-base font-extrabold text-black dark:text-white">Kunjungan 7 Hari Terakhir</h2>
            <p class="mt-0.5 text-xs text-gray">Ringkasan trafik halaman publik.</p>
          </div>
          <NuxtLink to="/admin/analytics" class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
            <span>Analitik lengkap</span>
            <Icon name="ph:arrow-right-bold" class="h-3.5 w-3.5" aria-hidden="true" />
          </NuxtLink>
        </div>

        <div class="flex flex-wrap items-baseline gap-3">
          <p class="text-3xl font-extrabold tabular-nums text-black dark:text-white">
            {{ numberFormatter.format(analyticsData?.periods.last7Days.views ?? 0) }}
          </p>
          <span class="text-xs text-gray">
            views · {{ numberFormatter.format(analyticsData?.periods.last7Days.uniqueVisitors ?? 0) }} unik
          </span>
          <span
            v-if="sparklineDelta !== null"
            class="rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums"
            :class="
              sparklineDelta > 0
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                : sparklineDelta < 0
                ? 'bg-red-500/15 text-red-700 dark:text-red-300'
                : 'bg-gray/15 text-gray'
            "
          >
            {{ sparklineDelta > 0 ? `+${sparklineDelta}%` : `${sparklineDelta}%` }} vs 7 hari lalu
          </span>
        </div>

        <div v-if="sparklinePoints.length" class="pt-1">
          <svg
            :viewBox="`0 0 ${sparklineWidth} ${sparklineHeight}`"
            class="h-20 w-full overflow-visible"
            role="img"
            aria-label="Sparkline kunjungan 7 hari terakhir"
          >
            <path :d="sparklineArea" fill="#47BDFF" fill-opacity="0.12" />
            <polyline
              :points="sparklinePolyline"
              fill="none"
              stroke="#47BDFF"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              vector-effect="non-scaling-stroke"
            />
          </svg>
        </div>
      </section>

      <!-- Recent Inbox Messages Widget -->
      <section v-if="can('contacts.view')" class="admin-card flex flex-col justify-between gap-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="text-base font-extrabold text-black dark:text-white">Inbox Pesan Terbaru</h2>
            <p class="mt-0.5 text-xs text-gray">Pesan terbaru dari formulir Contact Us.</p>
          </div>
          <NuxtLink to="/admin/contacts" class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
            <span>Lihat semua</span>
            <Icon name="ph:arrow-right-bold" class="h-3.5 w-3.5" aria-hidden="true" />
          </NuxtLink>
        </div>

        <div v-if="!recentMessages.length" class="py-6 text-center text-sm text-gray">
          Belum ada pesan masuk.
        </div>
        <ul v-else class="divide-y divide-gray/10">
          <li
            v-for="msg in recentMessages"
            :key="msg._id"
            class="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
          >
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span
                  v-if="!msg.isRead"
                  class="h-2 w-2 shrink-0 rounded-full bg-primary"
                  title="Belum dibaca"
                ></span>
                <p class="truncate text-sm font-bold text-black dark:text-white">
                  {{ msg.fullname }}
                </p>
              </div>
              <p class="mt-0.5 truncate text-xs text-gray">{{ msg.message }}</p>
            </div>
            <span class="shrink-0 text-[11px] tabular-nums text-gray">
              {{ new Date(msg.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) }}
            </span>
          </li>
        </ul>
      </section>
    </div>

    <div v-if="!stats.length && !can('analytics.view') && !can('contacts.view')" class="admin-card text-sm text-gray">
      Akun Anda belum memiliki akses ke menu apa pun. Hubungi administrator untuk mengatur hak akses.
    </div>
  </div>
</template>
