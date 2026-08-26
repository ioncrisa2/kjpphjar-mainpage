<script setup lang="ts">
const route = useRoute()
const { isCollapsed, toggleSidebar } = useAdminSidebar()

interface NavItem {
  label: string
  icon: string
  to: string
}

interface NavCategory {
  key: string
  label: string
  icon: string
  items: NavItem[]
}

const categories: NavCategory[] = [
  {
    key: 'main',
    label: 'Utama',
    icon: 'ph:squares-four-bold',
    items: [
      { label: 'Dashboard', icon: 'ph:squares-four-bold', to: '/admin' },
      { label: 'Analitik', icon: 'ph:chart-line-up-bold', to: '/admin/analytics' },
    ],
  },
  {
    key: 'content',
    label: 'Konten Website',
    icon: 'ph:folder-bold',
    items: [
      { label: 'Layanan', icon: 'ph:briefcase-bold', to: '/admin/services' },
      { label: 'Blog', icon: 'ph:article-bold', to: '/admin/blog' },
      { label: 'Karir', icon: 'ph:identification-card-bold', to: '/admin/careers' },
      { label: 'Galeri', icon: 'ph:images-bold', to: '/admin/gallery' },
    ],
  },
  {
    key: 'company',
    label: 'Profil & Rekanan',
    icon: 'ph:buildings-bold',
    items: [
      { label: 'Pimpinan', icon: 'ph:user-circle-bold', to: '/admin/leaders' },
      { label: 'Cabang', icon: 'ph:map-pin-bold', to: '/admin/branches' },
      { label: 'Klien & Rekanan', icon: 'ph:handshake-bold', to: '/admin/clients' },
    ],
  },
  {
    key: 'contact',
    label: 'Kontak & Pesan',
    icon: 'ph:chats-circle-bold',
    items: [
      { label: 'Inbox Kontak', icon: 'ph:envelope-simple-bold', to: '/admin/contacts' },
      { label: 'Kontak Footer', icon: 'ph:phone-bold', to: '/admin/contact-persons' },
    ],
  },
  {
    key: 'settings',
    label: 'Sistem',
    icon: 'ph:sliders-horizontal-bold',
    items: [
      { label: 'Pengaturan', icon: 'ph:gear-six-bold', to: '/admin/settings' },
    ],
  },
]

// State to track open categories in expanded mode
const openCategories = ref<Record<string, boolean>>({
  main: true,
  content: true,
  company: true,
  contact: true,
  settings: true,
})

const { unreadCount, fetchUnreadCount } = useUnreadContacts()

onMounted(() => {
  fetchUnreadCount()
})

function isItemActive(itemTo: string): boolean {
  if (itemTo === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(itemTo)
}

function isCategoryActive(cat: NavCategory): boolean {
  return cat.items.some((item) => isItemActive(item.to))
}

// Auto expand active category when route changes
watch(
  () => route.path,
  () => {
    categories.forEach((cat) => {
      if (isCategoryActive(cat)) {
        openCategories.value[cat.key] = true
      }
    })
  },
  { immediate: true }
)

function toggleCategory(key: string) {
  openCategories.value[key] = !openCategories.value[key]
}
</script>

<template>
  <aside
    class="flex h-screen shrink-0 flex-col border-r border-gray/10 bg-white dark:bg-gray-dark select-none sticky top-0 transition-all duration-300 ease-in-out z-30 overflow-x-hidden"
    :class="isCollapsed ? 'w-20' : 'w-64'"
  >
    <!-- Logo & Toggle Header -->
    <div
      class="flex items-center border-b border-gray/10 shrink-0 transition-all duration-300"
      :class="isCollapsed ? 'flex-col justify-center gap-2 px-2 py-3.5' : 'justify-between px-4 py-4'"
    >
      <NuxtLink
        to="/admin"
        class="flex items-center gap-3 overflow-hidden transition-all duration-200"
        :class="isCollapsed ? 'justify-center' : ''"
        :title="isCollapsed ? 'KJPP HJA\'R Admin Panel' : ''"
      >
        <img
          src="/assets/images/h-logo.png"
          alt="KJPP HJA'R"
          width="128"
          height="32"
          class="h-8 w-auto shrink-0 transition-transform duration-200"
        />
        <div v-show="!isCollapsed" class="leading-tight whitespace-nowrap transition-opacity duration-200">
          <p class="text-xs font-extrabold text-black dark:text-white tracking-wide">KJPP HJA'R</p>
          <p class="text-[10px] font-semibold text-gray">Admin Panel</p>
        </div>
      </NuxtLink>

      <!-- Sidebar Toggle Button -->
      <button
        type="button"
        @click="toggleSidebar"
        class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 dark:text-gray-400 dark:hover:text-primary dark:hover:bg-primary/20 transition shrink-0"
        :title="isCollapsed ? 'Perluas Menu Sidebar' : 'Ciutkan Menu Sidebar'"
        aria-label="Toggle Sidebar"
      >
        <Icon
          name="ph:sidebar-simple-bold"
          class="h-4.5 w-4.5 transition-transform duration-300"
          :class="isCollapsed ? 'rotate-180 text-primary' : ''"
        />
      </button>
    </div>

    <!-- Navigation Area -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden py-4" :class="isCollapsed ? 'px-2 space-y-3' : 'px-3 space-y-3'">
      <!-- Minimized Mode (Icons Only with Hover Tooltips) -->
      <template v-if="isCollapsed">
        <div v-for="(cat, catIdx) in categories" :key="cat.key" class="space-y-1.5">
          <!-- Category Divider -->
          <div v-if="catIdx > 0" class="my-2 border-t border-gray/10 mx-2"></div>

          <!-- Minimized Category Items -->
          <div class="space-y-1">
            <div
              v-for="item in cat.items"
              :key="item.to"
              class="relative group flex justify-center"
            >
              <NuxtLink
                :to="item.to"
                class="relative flex h-11 w-11 items-center justify-center rounded-xl text-gray transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:text-gray-300 dark:hover:bg-primary/20 dark:hover:text-primary"
                :class="{
                  'bg-primary/15 font-bold text-primary dark:bg-primary/25 dark:text-primary shadow-xs ring-1 ring-primary/30': isItemActive(item.to),
                }"
                :title="item.label"
              >
                <!-- Active Indicator Bar -->
                <span
                  v-if="isItemActive(item.to)"
                  class="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary"
                ></span>

                <Icon :name="item.icon" class="h-5 w-5 shrink-0" aria-hidden="true" />

                <!-- Unread Badge Dot/Count for Minimized Mode -->
                <span
                  v-if="item.to === '/admin/contacts' && unreadCount > 0"
                  class="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-xs animate-pulse"
                >
                  {{ unreadCount > 99 ? '99+' : unreadCount }}
                </span>
              </NuxtLink>

              <!-- Floating Tooltip on Hover -->
              <div
                class="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-bold text-white shadow-xl dark:bg-stone-100 dark:text-stone-900"
              >
                <div class="flex items-center gap-1.5">
                  <span>{{ item.label }}</span>
                  <span
                    v-if="item.to === '/admin/contacts' && unreadCount > 0"
                    class="rounded-full bg-red-500 px-1.5 py-0.2 text-[10px] text-white"
                  >
                    {{ unreadCount }}
                  </span>
                </div>
                <!-- Mini Tooltip Arrow -->
                <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900 dark:border-r-stone-100"></div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Expanded Mode (Full Categories & Accordion Menus) -->
      <template v-else>
        <div v-for="cat in categories" :key="cat.key" class="space-y-1">
          <!-- Category Header / Toggle -->
          <button
            type="button"
            @click="toggleCategory(cat.key)"
            class="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider transition-colors duration-150"
            :class="isCategoryActive(cat) ? 'text-primary dark:text-primary' : 'text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white'"
          >
            <div class="flex items-center gap-1.5">
              <Icon :name="cat.icon" class="h-3.5 w-3.5 opacity-80" />
              <span>{{ cat.label }}</span>
            </div>
            <Icon
              name="ph:caret-down-bold"
              class="h-3.5 w-3.5 transition-transform duration-200"
              :class="{ 'rotate-180': openCategories[cat.key] }"
            />
          </button>

          <!-- Collapsible Menu List -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="max-h-0 opacity-0 overflow-hidden"
            enter-to-class="max-h-96 opacity-100 overflow-hidden"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="max-h-96 opacity-100 overflow-hidden"
            leave-to-class="max-h-0 opacity-0 overflow-hidden"
          >
            <div v-show="openCategories[cat.key]" class="space-y-1 pl-1">
              <NuxtLink
                v-for="item in cat.items"
                :key="item.to"
                :to="item.to"
                class="relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:text-gray-300 dark:hover:bg-primary/20 dark:hover:text-primary"
                :class="{
                  'bg-primary/15 font-bold text-primary dark:bg-primary/25 dark:text-primary shadow-xs': isItemActive(item.to),
                }"
              >
                <!-- Active Indicator Bar -->
                <span
                  v-if="isItemActive(item.to)"
                  class="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary"
                ></span>

                <Icon :name="item.icon" class="h-4 w-4 shrink-0" aria-hidden="true" />
                <span class="flex-1 whitespace-nowrap">{{ item.label }}</span>
                <span
                  v-if="item.to === '/admin/contacts' && unreadCount > 0"
                  class="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-xs"
                >
                  {{ unreadCount > 99 ? '99+' : unreadCount }}
                </span>
              </NuxtLink>
            </div>
          </Transition>
        </div>
      </template>
    </nav>

    <!-- Sidebar Footer -->
    <div
      class="border-t border-gray/10 shrink-0 text-center transition-all duration-300"
      :class="isCollapsed ? 'py-3 px-2 flex justify-center' : 'px-4 py-3'"
    >
      <p v-if="!isCollapsed" class="text-[10px] font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap">
        &copy; {{ new Date().getFullYear() }} KJPP HJA'R Admin
      </p>
      <button
        v-else
        type="button"
        @click="toggleSidebar"
        class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition"
        title="Perluas Sidebar"
        aria-label="Perluas Sidebar"
      >
        <Icon name="ph:caret-right-bold" class="h-4 w-4" />
      </button>
    </div>
  </aside>
</template>


