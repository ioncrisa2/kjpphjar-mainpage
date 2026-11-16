<script setup lang="ts">
export interface TrendPoint {
  date: string
  views: number
  uniqueVisitors: number
}

export type TrendMetricFilter = 'all' | 'views' | 'uniqueVisitors'

const props = withDefaults(
  defineProps<{
    points: TrendPoint[]
    comparisonPoints?: TrendPoint[]
    comparisonLabel?: string
    metric?: TrendMetricFilter
  }>(),
  {
    comparisonPoints: () => [],
    comparisonLabel: 'Periode sebelumnya',
    metric: 'all',
  }
)

const width = 760
const height = 260
const padding = { top: 18, right: 18, bottom: 42, left: 48 }
const plotWidth = width - padding.left - padding.right
const plotHeight = height - padding.top - padding.bottom

const formatter = new Intl.NumberFormat('id-ID')
const shortDateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})
const fullDateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const showViews = computed(() => props.metric === 'all' || props.metric === 'views')
const showUnique = computed(() => props.metric === 'all' || props.metric === 'uniqueVisitors')
const hasComparison = computed(
  () => props.comparisonPoints.length === props.points.length && props.points.length > 0
)

const comparisonField = computed<'views' | 'uniqueVisitors'>(() =>
  props.metric === 'uniqueVisitors' ? 'uniqueVisitors' : 'views'
)

const maxValue = computed(() => {
  const values: number[] = []
  for (const point of props.points) {
    if (showViews.value) values.push(point.views)
    if (showUnique.value) values.push(point.uniqueVisitors)
  }
  if (hasComparison.value) {
    for (const point of props.comparisonPoints) {
      values.push(point[comparisonField.value])
    }
  }
  const maximum = Math.max(0, ...values)
  return Math.max(1, Math.ceil(maximum * 1.1))
})

const xFor = (index: number) =>
  props.points.length <= 1
    ? padding.left + plotWidth / 2
    : padding.left + (index / (props.points.length - 1)) * plotWidth

const yFor = (value: number) => padding.top + plotHeight - (value / maxValue.value) * plotHeight

const viewsPoints = computed(() =>
  props.points.map((point, index) => `${xFor(index)},${yFor(point.views)}`).join(' ')
)
const uniquePoints = computed(() =>
  props.points
    .map((point, index) => `${xFor(index)},${yFor(point.uniqueVisitors)}`)
    .join(' ')
)
const comparisonPolylinePoints = computed(() =>
  hasComparison.value
    ? props.comparisonPoints
        .map((point, index) => `${xFor(index)},${yFor(point[comparisonField.value])}`)
        .join(' ')
    : ''
)

const viewsAreaPath = computed(() => {
  if (!props.points.length || !showViews.value) return ''
  const line = props.points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xFor(index)} ${yFor(point.views)}`)
    .join(' ')
  return `${line} L ${xFor(props.points.length - 1)} ${padding.top + plotHeight} L ${
    padding.left
  } ${padding.top + plotHeight} Z`
})

const yTicks = computed(() =>
  Array.from({ length: 5 }, (_, index) => {
    const value = Math.round((maxValue.value * index) / 4)
    return { value, y: yFor(value) }
  })
)

const labelStep = computed(() => {
  if (props.points.length <= 7) return 1
  if (props.points.length <= 30) return 5
  return 15
})

const dateLabels = computed(() =>
  props.points
    .map((point, index) => ({ point, index }))
    .filter(
      ({ index }) =>
        index === 0 || index === props.points.length - 1 || index % labelStep.value === 0
    )
)

const sliceWidth = computed(() =>
  props.points.length <= 1 ? plotWidth : plotWidth / Math.max(1, props.points.length - 1)
)

const activeIndex = ref<number | null>(null)
const activePoint = computed(() =>
  activeIndex.value !== null ? props.points[activeIndex.value] ?? null : null
)
const activeComparisonPoint = computed(() =>
  activeIndex.value !== null && hasComparison.value
    ? props.comparisonPoints[activeIndex.value] ?? null
    : null
)

const tooltipLeftPercent = computed(() => {
  if (activeIndex.value === null) return 50
  const rawPercent = (xFor(activeIndex.value) / width) * 100
  return Math.max(14, Math.min(86, rawPercent))
})

function formatDate(value: string): string {
  return shortDateFormatter.format(new Date(`${value}T00:00:00Z`))
}

function formatFullDate(value: string): string {
  return fullDateFormatter.format(new Date(`${value}T00:00:00Z`))
}
</script>

<template>
  <div>
    <div class="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-gray">
      <span v-if="showViews" class="inline-flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
        Page views
      </span>
      <span v-if="showUnique" class="inline-flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full bg-secondary" aria-hidden="true" />
        Perkiraan pengunjung unik
      </span>
      <span v-if="hasComparison" class="inline-flex items-center gap-2">
        <span class="h-0.5 w-4 border-t-2 border-dashed border-slate-400" aria-hidden="true" />
        {{ comparisonLabel }}
      </span>
    </div>

    <div class="relative overflow-x-auto pb-1">
      <div
        v-if="activePoint && activeIndex !== null"
        class="pointer-events-none absolute top-2 z-20 hidden w-56 -translate-x-1/2 rounded-xl border border-gray/15 bg-white/95 p-3 text-xs shadow-lg backdrop-blur-xs dark:border-white/10 dark:bg-gray-dark/95 sm:block"
        :style="{ left: `${tooltipLeftPercent}%` }"
      >
        <p class="font-extrabold text-black dark:text-white">
          {{ formatFullDate(activePoint.date) }}
        </p>
        <div class="mt-1.5 space-y-1">
          <div v-if="showViews" class="flex items-center justify-between gap-3">
            <span class="inline-flex items-center gap-1.5 text-gray">
              <span class="h-2 w-2 rounded-full bg-primary" />
              Views
            </span>
            <span class="font-bold tabular-nums text-black dark:text-white">
              {{ formatter.format(activePoint.views) }}
            </span>
          </div>
          <div v-if="showUnique" class="flex items-center justify-between gap-3">
            <span class="inline-flex items-center gap-1.5 text-gray">
              <span class="h-2 w-2 rounded-full bg-secondary" />
              Unik
            </span>
            <span class="font-bold tabular-nums text-black dark:text-white">
              {{ formatter.format(activePoint.uniqueVisitors) }}
            </span>
          </div>
          <div
            v-if="activeComparisonPoint"
            class="mt-1 flex items-center justify-between gap-3 border-t border-gray/10 pt-1"
          >
            <span class="truncate text-gray" :title="comparisonLabel">
              {{ comparisonLabel }}
            </span>
            <span class="font-bold tabular-nums text-slate-500 dark:text-slate-300">
              {{ formatter.format(activeComparisonPoint[comparisonField]) }}
            </span>
          </div>
        </div>
      </div>

      <svg
        class="h-auto min-w-[620px] w-full"
        :viewBox="`0 0 ${width} ${height}`"
        role="img"
        aria-labelledby="analytics-trend-title analytics-trend-description"
        @mouseleave="activeIndex = null"
      >
        <title id="analytics-trend-title">Tren kunjungan website</title>
        <desc id="analytics-trend-description">
          Grafik garis page views dan perkiraan pengunjung unik per hari.
        </desc>

        <g class="text-gray/20 dark:text-white/10">
          <line
            v-for="tick in yTicks"
            :key="`grid-${tick.value}`"
            :x1="padding.left"
            :x2="width - padding.right"
            :y1="tick.y"
            :y2="tick.y"
            stroke="currentColor"
            stroke-width="1"
          />
        </g>

        <g class="fill-gray text-[11px]">
          <text
            v-for="tick in yTicks"
            :key="`label-${tick.value}`"
            :x="padding.left - 10"
            :y="tick.y + 4"
            text-anchor="end"
          >
            {{ formatter.format(tick.value) }}
          </text>
          <text
            v-for="label in dateLabels"
            :key="label.point.date"
            :x="xFor(label.index)"
            :y="height - 13"
            :text-anchor="label.index === 0 ? 'start' : label.index === points.length - 1 ? 'end' : 'middle'"
          >
            {{ formatDate(label.point.date) }}
          </text>
        </g>

        <!-- Crosshair Line on Active Hover -->
        <line
          v-if="activeIndex !== null"
          :x1="xFor(activeIndex)"
          :x2="xFor(activeIndex)"
          :y1="padding.top"
          :y2="padding.top + plotHeight"
          stroke="#94A3B8"
          stroke-width="1"
          stroke-dasharray="4 4"
        />

        <!-- Comparison Series (Previous Period or Selected Path) -->
        <polyline
          v-if="hasComparison && comparisonPolylinePoints"
          :points="comparisonPolylinePoints"
          fill="none"
          stroke="#94A3B8"
          stroke-width="2"
          stroke-dasharray="5 5"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />

        <path v-if="viewsAreaPath" :d="viewsAreaPath" fill="#47BDFF" fill-opacity="0.09" />
        <polyline
          v-if="showViews && viewsPoints"
          :points="viewsPoints"
          fill="none"
          stroke="#47BDFF"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />
        <polyline
          v-if="showUnique && uniquePoints"
          :points="uniquePoints"
          fill="none"
          stroke="#B476E5"
          stroke-width="2.5"
          stroke-dasharray="6 5"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />

        <g v-for="(point, index) in points" :key="point.date">
          <circle
            v-if="showViews"
            :cx="xFor(index)"
            :cy="yFor(point.views)"
            :r="activeIndex === index ? 5 : 3"
            fill="#47BDFF"
          />
          <circle
            v-if="showUnique"
            :cx="xFor(index)"
            :cy="yFor(point.uniqueVisitors)"
            :r="activeIndex === index ? 4.5 : 2.5"
            fill="#B476E5"
          />
          <circle
            v-if="hasComparison && comparisonPoints[index]"
            :cx="xFor(index)"
            :cy="yFor(comparisonPoints[index][comparisonField])"
            :r="activeIndex === index ? 4 : 0"
            fill="#94A3B8"
          />

          <!-- Invisible Hover Column Hitbox -->
          <rect
            :x="Math.max(padding.left, xFor(index) - sliceWidth / 2)"
            :y="padding.top"
            :width="sliceWidth"
            :height="plotHeight"
            fill="transparent"
            class="cursor-crosshair"
            @mouseenter="activeIndex = index"
            @focus="activeIndex = index"
          >
            <title>
              {{ formatDate(point.date) }}: {{ formatter.format(point.views) }} views, {{ formatter.format(point.uniqueVisitors) }} unik
            </title>
          </rect>
        </g>
      </svg>
    </div>

    <!-- Mobile active summary bar -->
    <div
      v-if="activePoint"
      class="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-stone-50 px-3 py-2 text-xs dark:bg-gray-800/60 sm:hidden"
    >
      <span class="font-bold text-black dark:text-white">{{ formatFullDate(activePoint.date) }}</span>
      <span class="tabular-nums text-gray">
        {{ formatter.format(activePoint.views) }} views · {{ formatter.format(activePoint.uniqueVisitors) }} unik
      </span>
    </div>
  </div>
</template>
