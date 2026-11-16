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
          <img src="/assets/images/h-logo.png" alt="KJPP HJA'R" width="160" height="40" class="h-10 w-auto" />
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
              <img src="/assets/images/h-logo.png" alt="KJPP HJA'R" width="128" height="32" class="h-8 w-auto" />
              <button type="button" class="p-2" @click="closeMenu" aria-label="Tutup Menu Navigasi">
                <Icon name="ph:x-bold" class="h-7 w-7 text-white hover:text-primary transition-colors" aria-hidden="true" />
              </button>
            </div>

            <!-- Navigation Links -->
            <ul class="flex flex-col items-center justify-center flex-1 gap-8 text-xl font-bold lg:flex-row lg:gap-6 xl:gap-8 lg:text-base lg:p-0">
              <li><NuxtLink to="/" @click="closeMenu" class="hover:text-primary transition-colors">Home</NuxtLink></li>
              <li><NuxtLink to="/about-us" @click="closeMenu" class="hover:text-primary transition-colors">Tentang Kami</NuxtLink></li>
              <li><NuxtLink to="/layanan" @click="closeMenu" class="hover:text-primary transition-colors">Layanan</NuxtLink></li>
              <li><NuxtLink to="/rekan-klien" @click="closeMenu" class="hover:text-primary transition-colors">Rekan & Klien</NuxtLink></li>
              <li><NuxtLink to="/gallery" @click="closeMenu" class="hover:text-primary transition-colors">Galeri</NuxtLink></li>
              <li><NuxtLink to="/blog" @click="closeMenu" class="hover:text-primary transition-colors">Blog</NuxtLink></li>
              <li><NuxtLink to="/karir" @click="closeMenu" class="hover:text-primary transition-colors">Karir</NuxtLink></li>
              <li><NuxtLink to="/faq" @click="closeMenu" class="hover:text-primary transition-colors">FAQ</NuxtLink></li>
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
              <Icon v-if="store.theme === 'light'" name="ph:moon-bold" class="h-5 w-5" aria-hidden="true" />
              <Icon v-else name="ph:sun-bold" class="h-5 w-5" aria-hidden="true" />
            </button>

            <!-- Hamburger Button -->
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-md bg-primary lg:hidden text-black"
              aria-label="Buka Menu Navigasi"
              @click="toggleMenu"
            >
              <Icon name="ph:list-bold" class="h-6 w-6" aria-hidden="true" />
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
