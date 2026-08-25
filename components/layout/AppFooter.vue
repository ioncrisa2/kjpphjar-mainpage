<script setup lang="ts">
const { data: contacts } = await useFetch('/api/contact-persons', {
  query: { activeOnly: 'true' }
})
const { data: settings } = await useAppSettings()

const socialIcons = {
  instagram: 'ph:instagram-logo',
  linkedin: 'ph:linkedin-logo',
  facebook: 'ph:facebook-logo',
  youtube: 'ph:youtube-logo',
} as const

const socialLinks = computed(() =>
  Object.entries(settings.value.socialMedia)
    .filter((entry): entry is [keyof typeof socialIcons, string] => Boolean(entry[1]))
    .map(([network, href]) => ({
      network,
      href,
      icon: socialIcons[network],
      label: `${network.charAt(0).toUpperCase()}${network.slice(1)} ${settings.value.siteName}`,
    }))
)

function telephoneHref(phone: string) {
  return `tel:${phone.replace(/[^0-9+]/g, '')}`
}
</script>

<template>
  <footer class="mt-auto bg-white dark:bg-transparent dark:bg-gradient-to-b dark:from-white/[0.03] dark:to-transparent">
    <div class="container">
      <div class="grid gap-y-10 gap-x-4 py-14 sm:grid-cols-2 lg:grid-cols-3 lg:py-[100px]">
        <!-- Brand -->
        <div class="relative">
          <div class="flex flex-row gap-2 items-center">
            <img src="/assets/images/h-logo.png" :alt="settings.siteName" width="60" height="60" class="h-[60px] w-auto" />
            <span class="max-w-[220px] text-base font-semibold leading-tight text-black dark:text-white">
              {{ settings.siteName }}
            </span>
          </div>
          <div v-if="socialLinks.length" class="mt-8">
            <p class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Ikuti kami di media sosial:</p>
            <ul class="flex flex-wrap items-center gap-2">
              <li v-for="social in socialLinks" :key="social.network">
                <a
                  :href="social.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-gray/25 px-2 text-xs font-extrabold text-gray-700 transition hover:border-secondary hover:text-secondary dark:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
                  :aria-label="social.label"
                >
                  <Icon :name="social.icon" class="h-5 w-5" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Address -->
        <div>
          <ul class="flex flex-col gap-3 font-bold">
            <li class="mb-3 text-lg font-extrabold text-black dark:text-white">Alamat</li>
            <li v-if="settings.footerAddress.headOffice" class="whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              <strong class="text-black dark:text-white">Kantor Pusat:</strong><br />
              {{ settings.footerAddress.headOffice }}
            </li>
            <li v-if="settings.footerAddress.googleMapsUrl">
              <a
                :href="settings.footerAddress.googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-bold text-sky-600 transition hover:text-secondary dark:text-primary"
              >
                Buka di Google Maps →
              </a>
            </li>
          </ul>
          <iframe
            v-if="settings.footerAddress.googleMapsEmbedUrl"
            :src="settings.footerAddress.googleMapsEmbedUrl"
            :title="`Peta ${settings.siteName}`"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
            class="mt-5 h-32 w-full rounded-xl border-0"
          />
        </div>

        <!-- Kontak -->
        <div>
          <ul class="flex flex-col gap-2 font-bold">
            <li class="mb-3 text-lg font-extrabold text-black dark:text-white">Kontak</li>
            <li v-if="settings.generalContacts.email">
              <a :href="`mailto:${settings.generalContacts.email}`" class="inline-block text-sm font-medium text-gray-700 transition hover:text-secondary dark:text-gray-300">
                {{ settings.generalContacts.email }}
              </a>
            </li>
            <li v-if="settings.generalContacts.phone">
              <a :href="telephoneHref(settings.generalContacts.phone)" class="inline-block text-sm font-medium text-gray-700 transition hover:text-secondary dark:text-gray-300">
                {{ settings.generalContacts.phone }}
              </a>
            </li>
            <li v-for="contact in contacts" :key="contact._id">
              <a :href="telephoneHref(contact.phone)" class="inline-block text-sm font-medium text-gray-700 transition hover:text-secondary dark:text-gray-300">
                {{ contact.phone }} ({{ contact.name }})
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="bg-gradient-to-r from-[#FCF1F4] to-[#EDFBF9] py-5 dark:border-t-2 dark:border-white/5 dark:bg-none">
      <div class="container">
        <div class="flex flex-col items-center justify-between gap-2 text-center font-bold text-gray-800 dark:text-white md:flex-row">
          <div class="text-sm">
            Copyright &copy; {{ new Date().getFullYear() }}
            <NuxtLink to="/" class="text-sky-700 transition hover:text-secondary dark:text-primary">{{ settings.copyrightText || settings.siteName }}</NuxtLink>
          </div>
          <div class="text-sm">
            Need help?
            <NuxtLink to="/contact-us" class="text-purple-700 font-bold transition hover:text-primary dark:text-primary">Contact Us</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
