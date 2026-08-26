<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Analitik | Admin KJPP HJA'R" })

type AnalyticsRange = 7 | 30 | 90

interface PeriodStats {
  views: number
  uniqueVisitors: number
}

interface TrendPoint {
  date: string
  views: number
  uniqueVisitors: number
}

interface OverviewResponse {
  generatedAt: string
  timezone: string
  range: AnalyticsRange
  periods: {
    today: PeriodStats
    last7Days: PeriodStats
    last30Days: PeriodStats
  }
  trend: TrendPoint[]
}

interface TopPageItem {
  path: string
  views: number
  uniqueVisitors: number
  percentage: number
}

interface TopPagesResponse {
  range: AnalyticsRange
  totalViews: number
  items: TopPageItem[]
}

interface BreakdownItem {
  key: string
  count: number
  percentage: number
}

interface DevicesResponse {
  range: AnalyticsRange
  totalViews: number
  devices: BreakdownItem[]
  browsers: BreakdownItem[]
}

interface SourcesResponse {
  range: AnalyticsRange
  totalEntries: number
  items: BreakdownItem[]
  referrers: Array<{ host: string; count: number }>
}

interface DashboardData {
  overview: OverviewResponse
  topPages: TopPagesResponse
  devices: DevicesResponse
  sources: SourcesResponse
}

const selectedRange = ref<AnalyticsRange>(30)
const requestFetch = useRequestFetch()
const numberFormatter = new Intl.NumberFormat('id-ID')
const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Jakarta',
})
const palette = ['#47BDFF', '#B476E5', '#0F766E', '#F59E0B', '#64748B', '#E85D75']

const { data, pending, error, refresh } = await useAsyncData<DashboardData>(
  'admin-analytics-dashboard',
  async () => {
    const query = { range: selectedRange.value }
    const [overview, topPages, devices, sources] = await Promise.all([
      requestFetch<OverviewResponse>('/api/analytics/overview', { query }),
      requestFetch<TopPagesResponse>('/api/analytics/top-pages', { query }),
      requestFetch<DevicesResponse>('/api/analytics/devices', { query }),
      requestFetch<SourcesResponse>('/api/analytics/sources', { query }),
    ])
    return { overview, topPages, devices, sources }
  },
  { watch: [selectedRange] }
)

const periodCards = computed(() => {
  if (!data.value) return []
  return [
    { label: 'Hari ini', value: data.value.overview.periods.today },
    { label: '7 hari terakhir', value: data.value.overview.periods.last7Days },
    { label: '30 hari terakhir', value: data.value.overview.periods.last30Days },
  ]
})

const selectedRangeViews = computed(
  () => data.value?.overview.trend.reduce((total, point) => total + point.views, 0) || 0
)
const hasTraffic = computed(() => selectedRangeViews.value > 0)
const lastUpdated = computed(() =>
  data.value?.overview.generatedAt
    ? dateTimeFormatter.format(new Date(data.value.overview.generatedAt))
    : 'Belum tersedia'
)

const deviceLabels: Record<string, string> = {
  desktop: 'Desktop',
  mobile: 'Mobile',
  tablet: 'Tablet',
  other: 'Lainnya',
}
const browserLabels: Record<string, string> = {
  chrome: 'Chrome',
  safari: 'Safari',
  edge: 'Microsoft Edge',
  firefox: 'Firefox',
  opera: 'Opera',
  'samsung-internet': 'Samsung Internet',
  other: 'Lainnya',
}
const sourceLabels: Record<string, string> = {
  direct: 'Direct',
  organic: 'Pencarian organik',
  social: 'Media sosial',
  referral: 'Situs rujukan',
  internal: 'Internal',
}

function labelFor(labels: Record<string, string>, key: string): string {
  return labels[key] || key
}

function colorFor(index: number): string {
  return palette[index % palette.length]
}

function percentWidth(value: number): string {
  return `${Math.max(0, Math.min(100, value))}%`
}

function donutGradient(items: BreakdownItem[]): string {
  if (!items.length) return 'conic-gradient(#E5E7EB 0 100%)'

  let cursor = 0
  const segments = items.map((item, index) => {
    const start = cursor
    const end = index === items.length - 1 ? 100 : Math.min(100, cursor + item.percentage)
    cursor = end
    return `${colorFor(index)} ${start}% ${end}%`
  })
  return `conic-gradient(${segments.join(', ')})`
}

const deviceDonutStyle = computed(() => ({
  background: donutGradient(data.value?.devices.devices || []),
}))

const errorMessage = computed(() => {
  const currentError = error.value as { statusMessage?: string; message?: string } | null
  return currentError?.statusMessage || currentError?.message || 'Data analitik gagal dimuat.'
})

const { ask } = useConfirm()
const purging = ref(false)
const purgeNotice = ref('')
const purgeError = ref('')

async function purgeExpiredLogs() {
  const confirmed = await ask({
    title: 'Bersihkan Log Analitik',
    message: 'Bersihkan log analitik yang berusia lebih dari 90 hari? Data lama yang terhapus tidak dapat dipulihkan.',
    confirmText: 'Ya, Bersihkan Log',
    variant: 'warning',
  })
  if (!confirmed) return

  purging.value = true
  purgeNotice.value = ''
  purgeError.value = ''
  try {
    const result = await $fetch<{ deletedCount: number }>('/api/analytics/purge', {
      method: 'DELETE',
      body: { confirmation: 'PURGE_ANALYTICS_90_DAYS' },
    })
    purgeNotice.value = `${numberFormatter.format(result.deletedCount)} log kedaluwarsa dibersihkan.`
    await refresh()
  } catch (purgeRequestError) {
    const requestError = purgeRequestError as { data?: { statusMessage?: string } }
    purgeError.value =
      requestError.data?.statusMessage || 'Log kedaluwarsa belum dapat dibersihkan.'
  } finally {
    purging.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Analitik website</h1>
        <p class="mt-1 max-w-2xl text-sm leading-6 text-gray">
          Ringkasan kunjungan halaman publik tanpa cookie profil dan tanpa menyimpan alamat IP mentah.
        </p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label class="block">
          <span class="mb-1.5 block text-xs font-bold text-black dark:text-white">Rentang tren</span>
          <select
            v-model.number="selectedRange"
            class="admin-input min-w-40 py-2.5"
            :disabled="pending"
          >
            <option :value="7">7 hari</option>
            <option :value="30">30 hari</option>
            <option :value="90">90 hari</option>
          </select>
        </label>
        <button
          type="button"
          class="admin-btn-ghost min-h-11 justify-center disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="pending"
          :aria-busy="pending"
          @click="refresh()"
        >
          <Icon
            name="ph:arrows-clockwise-bold"
            class="h-4 w-4"
            :class="pending ? 'motion-safe:animate-spin' : ''"
            aria-hidden="true"
          />
          {{ pending ? 'Memuat…' : 'Perbarui data' }}
        </button>
      </div>
    </header>

    <div
      v-if="error && !data"
      class="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-200"
      role="alert"
    >
      <p class="font-bold">Data analitik belum dapat ditampilkan</p>
      <p class="mt-1 text-sm leading-6">{{ errorMessage }}</p>
      <button type="button" class="mt-4 text-sm font-bold underline underline-offset-4" @click="refresh()">
        Coba lagi
      </button>
    </div>

    <template v-if="pending && !data">
      <section class="admin-card !p-0 overflow-hidden" aria-label="Memuat ringkasan kunjungan">
        <div class="grid sm:grid-cols-3">
          <div v-for="index in 3" :key="index" class="border-b border-gray/10 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
            <div class="h-3 w-24 rounded bg-gray/10 motion-safe:animate-pulse" />
            <div class="mt-4 h-8 w-20 rounded bg-gray/10 motion-safe:animate-pulse" />
            <div class="mt-3 h-3 w-32 rounded bg-gray/10 motion-safe:animate-pulse" />
          </div>
        </div>
      </section>
      <div class="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
        <div class="admin-card h-96 bg-white motion-safe:animate-pulse dark:bg-gray-dark" />
        <div class="admin-card h-96 bg-white motion-safe:animate-pulse dark:bg-gray-dark" />
      </div>
    </template>

    <template v-else-if="data">
      <section class="admin-card !p-0 overflow-hidden" aria-labelledby="analytics-summary-heading">
        <div class="flex flex-col gap-1 border-b border-gray/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="analytics-summary-heading" class="text-sm font-extrabold text-black dark:text-white">
            Ringkasan kunjungan
          </h2>
          <p class="text-xs text-gray">Diperbarui {{ lastUpdated }} WIB</p>
        </div>
        <div class="grid sm:grid-cols-3">
          <div
            v-for="period in periodCards"
            :key="period.label"
            class="border-b border-gray/10 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
          >
            <p class="text-xs font-bold text-gray">{{ period.label }}</p>
            <p class="mt-2 text-3xl font-extrabold tabular-nums text-black dark:text-white">
              {{ numberFormatter.format(period.value.views) }}
            </p>
            <p class="mt-1 text-xs text-gray">
              page views · {{ numberFormatter.format(period.value.uniqueVisitors) }} perkiraan unik
            </p>
          </div>
        </div>
      </section>

      <div
        v-if="!hasTraffic"
        class="admin-card flex min-h-44 flex-col items-center justify-center text-center"
      >
        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
          <Icon name="ph:chart-bar-bold" class="h-5 w-5" />
        </div>
        <h2 class="mt-3 font-extrabold text-black dark:text-white">Belum ada kunjungan pada rentang ini</h2>
        <p class="mt-1 max-w-md text-sm leading-6 text-gray">
          Data akan muncul setelah pengunjung membuka halaman publik. Request API, aset, admin, dan bot tidak dihitung.
        </p>
      </div>

      <template v-else>
        <div class="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
          <section class="admin-card min-w-0" aria-labelledby="analytics-trend-heading">
            <div class="mb-1 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id="analytics-trend-heading" class="text-lg font-extrabold text-black dark:text-white">
                  Tren kunjungan
                </h2>
                <p class="mt-1 text-xs text-gray">Aktivitas harian dalam {{ selectedRange }} hari terakhir.</p>
              </div>
              <p class="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-black dark:text-white">
                {{ numberFormatter.format(selectedRangeViews) }} views
              </p>
            </div>
            <AdminAnalyticsTrendChart :points="data.overview.trend" class="mt-5" />
          </section>

          <section class="admin-card min-w-0" aria-labelledby="top-pages-heading">
            <div>
              <h2 id="top-pages-heading" class="text-lg font-extrabold text-black dark:text-white">
                Halaman teratas
              </h2>
              <p class="mt-1 text-xs text-gray">10 halaman dengan page views terbanyak.</p>
            </div>

            <div v-if="data.topPages.items.length" class="mt-5 overflow-x-auto">
              <table class="w-full min-w-[420px] text-left text-sm">
                <thead class="border-b border-gray/10 text-xs text-gray">
                  <tr>
                    <th class="pb-3 pr-3 font-bold">Halaman</th>
                    <th class="pb-3 px-3 text-right font-bold">Views</th>
                    <th class="pb-3 pl-3 text-right font-bold">Kontribusi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray/10">
                  <tr v-for="item in data.topPages.items" :key="item.path">
                    <td class="max-w-52 py-3 pr-3">
                      <span class="block truncate font-semibold text-black dark:text-white" :title="item.path">
                        {{ item.path }}
                      </span>
                      <span class="text-xs text-gray">
                        {{ numberFormatter.format(item.uniqueVisitors) }} perkiraan unik
                      </span>
                    </td>
                    <td class="px-3 py-3 text-right font-bold tabular-nums text-black dark:text-white">
                      {{ numberFormatter.format(item.views) }}
                    </td>
                    <td class="py-3 pl-3 text-right tabular-nums text-gray">{{ item.percentage }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else class="mt-5 rounded-xl bg-gray/5 p-4 text-sm text-gray">
              Belum ada halaman yang dapat diperingkatkan.
            </p>
          </section>
        </div>

        <div class="grid gap-6 xl:grid-cols-2">
          <section class="admin-card" aria-labelledby="device-heading">
            <div>
              <h2 id="device-heading" class="text-lg font-extrabold text-black dark:text-white">
                Perangkat pengunjung
              </h2>
              <p class="mt-1 text-xs text-gray">Distribusi perangkat dari seluruh page views.</p>
            </div>

            <div class="mt-6 grid gap-7 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
              <div
                class="relative mx-auto h-36 w-36 rounded-full"
                :style="deviceDonutStyle"
                role="img"
                :aria-label="`Distribusi perangkat dari ${numberFormatter.format(data.devices.totalViews)} page views`"
              >
                <div class="absolute inset-7 flex flex-col items-center justify-center rounded-full bg-white dark:bg-gray-dark">
                  <span class="text-xl font-extrabold tabular-nums text-black dark:text-white">
                    {{ numberFormatter.format(data.devices.totalViews) }}
                  </span>
                  <span class="text-[11px] text-gray">views</span>
                </div>
              </div>

              <div class="space-y-4">
                <div v-for="(item, index) in data.devices.devices" :key="item.key">
                  <div class="mb-1.5 flex items-center justify-between gap-4 text-xs">
                    <span class="inline-flex items-center gap-2 font-semibold text-black dark:text-white">
                      <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: colorFor(index) }" />
                      {{ labelFor(deviceLabels, item.key) }}
                    </span>
                    <span class="tabular-nums text-gray">{{ item.percentage }}%</span>
                  </div>
                  <div class="h-1.5 overflow-hidden rounded-full bg-gray/10">
                    <div class="h-full rounded-full" :style="{ width: percentWidth(item.percentage), backgroundColor: colorFor(index) }" />
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-7 border-t border-gray/10 pt-5">
              <h3 class="text-sm font-extrabold text-black dark:text-white">Browser</h3>
              <div class="mt-4 space-y-3">
                <div v-for="item in data.devices.browsers" :key="item.key" class="flex items-center gap-3 text-xs">
                  <span class="w-28 shrink-0 truncate font-semibold text-black dark:text-white">
                    {{ labelFor(browserLabels, item.key) }}
                  </span>
                  <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray/10">
                    <div class="h-full rounded-full bg-primary" :style="{ width: percentWidth(item.percentage) }" />
                  </div>
                  <span class="w-12 text-right tabular-nums text-gray">{{ item.percentage }}%</span>
                </div>
              </div>
            </div>
          </section>

          <section class="admin-card" aria-labelledby="source-heading">
            <div>
              <h2 id="source-heading" class="text-lg font-extrabold text-black dark:text-white">
                Sumber kunjungan
              </h2>
              <p class="mt-1 text-xs text-gray">Dihitung dari halaman masuk, bukan perpindahan internal.</p>
            </div>

            <div class="mt-6 space-y-5">
              <div v-for="(item, index) in data.sources.items" :key="item.key">
                <div class="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span class="inline-flex items-center gap-2 font-semibold text-black dark:text-white">
                    <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: colorFor(index) }" />
                    {{ labelFor(sourceLabels, item.key) }}
                  </span>
                  <span class="tabular-nums text-gray">
                    {{ numberFormatter.format(item.count) }} · {{ item.percentage }}%
                  </span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-gray/10">
                  <div class="h-full rounded-full" :style="{ width: percentWidth(item.percentage), backgroundColor: colorFor(index) }" />
                </div>
              </div>
            </div>

            <div class="mt-7 border-t border-gray/10 pt-5">
              <h3 class="text-sm font-extrabold text-black dark:text-white">Referrer teratas</h3>
              <ol v-if="data.sources.referrers.length" class="mt-3 divide-y divide-gray/10">
                <li v-for="referrer in data.sources.referrers" :key="referrer.host" class="flex items-center justify-between gap-4 py-2.5 text-xs">
                  <span class="min-w-0 truncate font-semibold text-black dark:text-white" :title="referrer.host">
                    {{ referrer.host }}
                  </span>
                  <span class="shrink-0 tabular-nums text-gray">{{ numberFormatter.format(referrer.count) }}</span>
                </li>
              </ol>
              <p v-else class="mt-3 text-sm text-gray">Belum ada referrer eksternal pada rentang ini.</p>
            </div>
          </section>
        </div>
      </template>

      <section class="admin-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" aria-labelledby="retention-heading">
        <div>
          <h2 id="retention-heading" class="text-sm font-extrabold text-black dark:text-white">Retensi data</h2>
          <p class="mt-1 max-w-2xl text-xs leading-5 text-gray">
            Log mentah otomatis kedaluwarsa setelah 90 hari. Pembersihan manual hanya menghapus data yang telah melewati batas tersebut.
          </p>
          <p v-if="purgeNotice" class="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300" aria-live="polite">
            {{ purgeNotice }}
          </p>
          <p v-if="purgeError" class="mt-2 text-xs font-semibold text-red-700 dark:text-red-300" role="alert">
            {{ purgeError }}
          </p>
        </div>
        <button
          type="button"
          class="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:border-red-400 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400/40 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-950/30"
          :disabled="purging"
          @click="purgeExpiredLogs"
        >
          {{ purging ? 'Membersihkan…' : 'Bersihkan log lama' }}
        </button>
      </section>
    </template>
  </div>
</template>
