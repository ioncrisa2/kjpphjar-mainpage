<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  lat: number
  lng: number
  title: string
}>()

const mapElement = ref<HTMLElement | null>(null)
let map: any = null

onMounted(async () => {
  if (typeof window !== 'undefined') {
    const L = (await import('leaflet')).default
    import('leaflet/dist/leaflet.css')

    if (mapElement.value) {
      map = L.map(mapElement.value).setView([props.lat, props.lng], 15)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)

      const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })

      const popupContent = `
        <div style="text-align: center; font-family: inherit;">
          <strong style="display: block; margin-bottom: 8px; font-size: 14px;">${props.title}</strong>
          <a href="https://www.google.com/maps/search/?api=1&query=${props.lat},${props.lng}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none; font-size: 13px; font-weight: 500;">
            Buka di Google Maps ↗
          </a>
        </div>
      `

      L.marker([props.lat, props.lng], { icon: defaultIcon })
        .addTo(map)
        .bindPopup(popupContent)
    }
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<template>
  <div ref="mapElement" class="w-full h-full min-h-[250px] z-10" style="position: relative; z-index: 10;"></div>
</template>
