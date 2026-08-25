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
    class="fixed top-0 w-full z-50 transition-all duration-300"
    :class="isScrolled ? 'bg-black py-4 shadow-lg' : 'bg-transparent py-6'"
  >
    <div class="container">
      <div class="flex items-center justify-between">
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
          <!-- Menu (Fullscreen Mobile, Inline Desktop) -->
          <div
            class="fixed inset-0 z-[52] bg-black text-white flex flex-col transition-transform duration-300 ease-in-out lg:static lg:bg-transparent lg:flex-row lg:translate-x-0 lg:items-center"
            :class="showMenu ? 'translate-x-0' : 'translate-x-full'"
          >
            <!-- Header menu on mobile (Logo & Close) -->
            <div class="flex items-center justify-between p-5 lg:hidden border-b border-gray-800">
              <img src="/assets/images/h-logo.png" alt="KJPP HJA'R" class="h-8" />
              <button type="button" class="p-2" @click="closeMenu" aria-label="Tutup Menu Navigasi">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-8 w-8 text-white hover:text-primary transition-colors" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Navigation Links -->
            <ul class="flex flex-col items-center justify-center flex-1 gap-8 text-xl font-bold lg:flex-row lg:gap-8 lg:text-base lg:p-0">
              <li><NuxtLink to="/" @click="closeMenu" class="hover:text-primary transition-colors">Home</NuxtLink></li>
              <li><NuxtLink to="/about-us" @click="closeMenu" class="hover:text-primary transition-colors">Tentang Kami</NuxtLink></li>
              <li><NuxtLink to="/layanan" @click="closeMenu" class="hover:text-primary transition-colors">Layanan</NuxtLink></li>
              <li><NuxtLink to="/rekan-klien" @click="closeMenu" class="hover:text-primary transition-colors">Rekan & Klien</NuxtLink></li>
              <li><NuxtLink to="/gallery" @click="closeMenu" class="hover:text-primary transition-colors">Galeri</NuxtLink></li>
              <li><NuxtLink to="/blog" @click="closeMenu" class="hover:text-primary transition-colors">Blog</NuxtLink></li>
              <li><NuxtLink to="/karir" @click="closeMenu" class="hover:text-primary transition-colors">Karir</NuxtLink></li>
              <li><NuxtLink to="/contact-us" @click="closeMenu" class="hover:text-primary transition-colors">Contact Us</NuxtLink></li>
            </ul>
          </div>

          <!-- Theme toggle + Hamburger (Always visible on right) -->
          <div class="flex items-center gap-4 pr-4 lg:pr-0 lg:ml-8">
            <!-- Theme Toggle -->
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-white hover:text-primary transition-colors"
              aria-label="Ganti Tema Warna (Terang / Gelap)"
              @click="store.toggleTheme(store.theme === 'light' ? 'dark' : 'light')"
            >
              <svg v-if="store.theme === 'light'" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M8 4C8 8.4 11.6 12 16 12C17.4 12 18.8 11.6 20 11C19.5 16.1 15.2 20 10 20C4.5 20 0 15.5 0 10C0 4.8 4 0.5 9 0C8.4 1.2 8 2.6 8 4ZM2 10C2 14.4 5.6 18 10 18C12.9 18 15.5 16.5 17 14C16.7 14 16.4 14 16 14C10.5 14 6 9.5 6 4C6 3.7 6 3.4 6 3C3.6 4.4 2 7.1 2 10Z" fill="currentColor" />
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M10 15C8.67392 15 7.40215 14.4732 6.46447 13.5355C5.52678 12.5979 5 11.3261 5 10C5 8.67392 5.52678 7.40215 6.46447 6.46447C7.40215 5.52678 8.67392 5 10 5C11.3261 5 12.5979 5.52678 13.5355 6.46447C14.4732 7.40215 15 8.67392 15 10C15 11.3261 14.4732 12.5979 13.5355 13.5355C12.5979 14.4732 11.3261 15 10 15Z" fill="currentColor" />
                <path d="M9.09091 0.909092C9.09091 0.407014 9.49792 0 10 0C10.5021 0 10.9091 0.407014 10.9091 0.909092V1.81818C10.9091 2.32026 10.5021 2.72727 10 2.72727C9.49792 2.72727 9.09091 2.32026 9.09091 1.81818V0.909092Z" fill="currentColor" />
              </svg>
            </button>

            <!-- Hamburger Button -->
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-md bg-primary lg:hidden text-white"
              aria-label="Buka Menu Navigasi"
              @click="toggleMenu"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.router-link-active {
  @apply text-primary;
}
</style>
