<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '~/stores/app'

const store = useAppStore()
const showMenu = ref(false)
const isScrolled = ref(false)

const toggleMenu = () => {
  if (window.innerWidth < 1024) {
    showMenu.value = !showMenu.value
    document.body.style.overflow = showMenu.value ? 'hidden' : ''
  }
}

const closeMenu = () => {
  showMenu.value = false
  document.body.style.overflow = ''
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <header
    class="sticky top-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'sticky-header' : 'bg-black/10'"
  >
    <div class="container">
      <div class="flex items-center justify-between py-5 lg:py-0">
        <!-- Logo -->
        <NuxtLink to="/" @click="closeMenu">
          <img src="/assets/images/h-logo.png" alt="KJPP HJA'R" class="h-10" />
        </NuxtLink>

        <!-- Nav -->
        <div class="flex items-center">
          <!-- Overlay -->
          <div
            v-if="showMenu"
            class="fixed inset-0 z-[51] bg-black/60 lg:hidden"
            @click="closeMenu"
          />

          <!-- Menu -->
          <div class="menus" :class="{ 'open-menus': showMenu }">
            <!-- Close button (mobile) -->
            <div class="border-b border-gray/10 text-right lg:hidden">
              <button type="button" class="p-4" @click="closeMenu">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-black dark:text-white">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ul @click="closeMenu">
              <li><NuxtLink to="/">Home</NuxtLink></li>
              <li><NuxtLink to="/about-us">Tentang Kami</NuxtLink></li>
              <li><NuxtLink to="/layanan">Layanan</NuxtLink></li>
              <li><NuxtLink to="/rekan-klien">Rekan & Klien</NuxtLink></li>
              <li><NuxtLink to="/gallery">Galeri</NuxtLink></li>
              <li><NuxtLink to="/blog">Blog</NuxtLink></li>
              <li><NuxtLink to="/karir">Karir</NuxtLink></li>
              <li><NuxtLink to="/contact-us">Contact Us</NuxtLink></li>
            </ul>
          </div>

          <!-- Theme toggle + Hamburger -->
          <ul class="flex items-center gap-5 pr-5 lg:pl-5 lg:pr-0">
            <li>
              <button
                type="button"
                class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-dark text-white hover:text-primary"
                @click="store.toggleTheme(store.theme === 'light' ? 'dark' : 'light')"
              >
                <!-- Moon (show in light mode) -->
                <svg v-if="store.theme === 'light'" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 4C8 8.4 11.6 12 16 12C17.4 12 18.8 11.6 20 11C19.5 16.1 15.2 20 10 20C4.5 20 0 15.5 0 10C0 4.8 4 0.5 9 0C8.4 1.2 8 2.6 8 4ZM2 10C2 14.4 5.6 18 10 18C12.9 18 15.5 16.5 17 14C16.7 14 16.4 14 16 14C10.5 14 6 9.5 6 4C6 3.7 6 3.4 6 3C3.6 4.4 2 7.1 2 10Z" fill="currentColor" />
                </svg>
                <!-- Sun (show in dark mode) -->
                <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 15C8.67392 15 7.40215 14.4732 6.46447 13.5355C5.52678 12.5979 5 11.3261 5 10C5 8.67392 5.52678 7.40215 6.46447 6.46447C7.40215 5.52678 8.67392 5 10 5C11.3261 5 12.5979 5.52678 13.5355 6.46447C14.4732 7.40215 15 8.67392 15 10C15 11.3261 14.4732 12.5979 13.5355 13.5355C12.5979 14.4732 11.3261 15 10 15Z" fill="currentColor" />
                  <path d="M9.09091 0.909092C9.09091 0.407014 9.49792 0 10 0C10.5021 0 10.9091 0.407014 10.9091 0.909092V1.81818C10.9091 2.32026 10.5021 2.72727 10 2.72727C9.49792 2.72727 9.09091 2.32026 9.09091 1.81818V0.909092Z" fill="currentColor" />
                </svg>
              </button>
            </li>
          </ul>

          <!-- Hamburger (mobile) -->
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-primary lg:hidden"
            @click="toggleMenu"
          >
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-white">
              <path d="M2 15H11C11.552 15 12 15.447 12 16C12 16.553 11.552 17 11 17H2C1.448 17 1 16.553 1 16C1 15.447 1.448 15 2 15Z" fill="currentColor" />
              <path d="M2 8H20C20.552 8 21 8.447 21 9C21 9.553 20.552 10 20 10H2C1.448 10 1 9.553 1 9C1 8.447 1.448 8 2 8Z" fill="currentColor" />
              <path d="M21 2C21 1.447 20.552 1 20 1H7C6.448 1 6 1.447 6 2C6 2.553 6.448 3 7 3H20C20.552 3 21 2.553 21 2Z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
