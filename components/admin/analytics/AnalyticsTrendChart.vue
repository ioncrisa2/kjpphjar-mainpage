<script setup lang="ts">
interface TrendPoint {
  date: string
  views: number
  uniqueVisitors: number
}

const props = defineProps<{
  points: TrendPoint[]
}>()

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

const maxValue = computed(() => {
  const maximum = Math.max(
    0,
    ...props.points.flatMap((point) => [point.views, point.uniqueVisitors])
  )
  return Math.max(1, Math.ceil(maximum * 1.1))
})

const xFor = (index: number) =>
  padding.left + (index / Math.max(1, props.points.length - 1)) * plotWidth
const yFor = (value: number) => padding.top + plotHeight - (value / maxValue.value) * plotHeight

const viewsPoints = computed(() =>
  props.points.map((point, index) => `${xFor(index)},${yFor(point.views)}`).join(' ')
)
const uniquePoints = computed(() =>
  props.points
    .map((point, index) => `${xFor(index)},${yFor(point.uniqueVisitors)}`)
    .join(' ')
)
const viewsAreaPath = computed(() => {
  if (!props.points.length) return ''
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

function formatDate(value: string): string {
  return shortDateFormatter.format(new Date(`${value}T00:00:00Z`))
}
</script>

<template>
  <div>
    <div class="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-gray">
      <span class="inline-flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
        Page views
      </span>
      <span class="inline-flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full bg-secondary" aria-hidden="true" />
        Perkiraan pengunjung unik
      </span>
    </div>

    <div class="overflow-x-auto pb-1">
      <svg
        class="h-auto min-w-[620px] w-full"
        :viewBox="`0 0 ${width} ${height}`"
        role="img"
        aria-labelledby="analytics-trend-title analytics-trend-description"
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

        <path v-if="viewsAreaPath" :d="viewsAreaPath" fill="#47BDFF" fill-opacity="0.09" />
        <polyline
          v-if="viewsPoints"
          :points="viewsPoints"
          fill="none"
          stroke="#47BDFF"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />
        <polyline
          v-if="uniquePoints"
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
          <circle :cx="xFor(index)" :cy="yFor(point.views)" r="3.25" fill="#47BDFF">
            <title>
              {{ formatDate(point.date) }}: {{ formatter.format(point.views) }} page views
            </title>
          </circle>
          <circle
            :cx="xFor(index)"
            :cy="yFor(point.uniqueVisitors)"
            r="2.75"
            fill="#B476E5"
          >
            <title>
              {{ formatDate(point.date) }}: {{ formatter.format(point.uniqueVisitors) }} perkiraan pengunjung unik
            </title>
          </circle>
        </g>
      </svg>
    </div>
  </div>
</template>
