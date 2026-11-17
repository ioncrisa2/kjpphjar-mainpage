<script setup lang="ts">
const { data: contacts } = await useFetch('/api/contact-persons', {
  query: { activeOnly: 'true' }
})
const { company, settings, headOffice, otherBranches, formatPhoneHref } = useCompanyProfile()

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
      label: `${network.charAt(0).toUpperCase()}${network.slice(1)} ${company.value.name}`,
    }))
)

function telephoneHref(phone: string) {
  return formatPhoneHref(phone)
}

const hasConfirmedOjk = computed(() => {
  const val = String(company.value.licenses.ojkRegistration || '').trim()
  return Boolean(val && !val.includes('[PERLU KONFIRMASI]'))
})
</script>

<template>
  <footer class="mt-auto bg-white dark:bg-transparent dark:bg-gradient-to-b dark:from-white/[0.03] dark:to-transparent">
    <div class="container">
      <div class="grid gap-y-10 gap-x-8 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-[90px]">
        <!-- Brand & Legalitas -->
        <div class="relative">
          <div class="flex flex-row gap-3 items-center">
            <img src="/assets/images/h-logo.png" :alt="`Logo ${company.name}`" width="60" height="60" class="h-[60px] w-auto" />
            <span class="max-w-[230px] text-base font-extrabold leading-tight text-black dark:text-white">
              {{ company.name }}
            </span>
          </div>
          <p class="mt-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            Kantor Jasa Penilai Publik (KJPP) independen berkantor pusat di Palembang sejak {{ company.foundedYear }}.
          </p>
          <div class="mt-4 rounded-xl border border-gray/15 bg-stone-50 p-3.5 text-xs leading-relaxed text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
            <p class="font-extrabold text-black dark:text-white">Izin &amp; Keanggotaan Resmi:</p>
            <ul class="mt-1.5 space-y-1">
              <li><strong>Izin Usaha KJPP (Kemenkeu):</strong> No. {{ company.licenses.kjppLicenseNumber }} ({{ company.licenses.kjppDecreeNumber }})</li>
              <li><strong>Izin Penilai Publik:</strong> {{ company.licenses.managingPartnerValuerLicense }}</li>
              <li><strong>Keanggotaan:</strong> {{ company.licenses.mappiMembership }}</li>
              <li v-if="hasConfirmedOjk"><strong>Terdaftar OJK:</strong> {{ company.licenses.ojkRegistration }}</li>
            </ul>
          </div>
          <div v-if="socialLinks.length" class="mt-6">
            <p class="mb-2.5 text-sm font-medium text-gray-700 dark:text-gray-300">Ikuti kami di media sosial:</p>
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

        <!-- Kantor Pusat & Jam Operasional -->
        <div>
          <ul class="flex flex-col gap-3 font-bold">
            <li class="mb-1 text-lg font-extrabold text-black dark:text-white">Kantor Pusat</li>
            <li class="whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              <strong class="text-black dark:text-white">{{ headOffice.name }}:</strong><br />
              {{ headOffice.fullAddress }}
            </li>
            <li class="text-xs font-semibold text-gray-700 dark:text-gray-300">
              <strong class="text-black dark:text-white">Jam Operasional:</strong><br />
              {{ company.operatingHours.display }}
            </li>
            <li v-if="headOffice.googleMapsUrl">
              <a
                :href="headOffice.googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-bold text-sky-600 transition hover:text-secondary dark:text-primary"
              >
                Buka Kantor Pusat di Google Maps →
              </a>
            </li>
          </ul>
        </div>

        <!-- Kantor Cabang -->
        <div>
          <p class="mb-4 text-lg font-extrabold text-black dark:text-white">Kantor Cabang</p>
          <ul class="space-y-3 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            <li v-for="branch in otherBranches" :key="branch.id">
              <strong class="block text-sm font-bold text-black dark:text-white">{{ branch.name }} ({{ branch.city }})</strong>
              <span>{{ branch.address }}</span><br />
              <a :href="branch.phoneHref" class="font-semibold text-sky-700 hover:underline dark:text-primary">
                Telp: {{ branch.phone }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Kontak & Navigasi Wilayah -->
        <div>
          <ul class="flex flex-col gap-2 font-bold">
            <li class="mb-1 text-lg font-extrabold text-black dark:text-white">Kontak Resmi</li>
            <li v-if="headOffice.phone">
              <a :href="telephoneHref(headOffice.phone)" class="inline-block text-sm font-medium text-gray-700 transition hover:text-secondary dark:text-gray-300">
                Telp Kantor Pusat: {{ headOffice.phone }}
              </a>
            </li>
            <li v-if="headOffice.email">
              <a :href="`mailto:${headOffice.email}`" class="inline-block text-sm font-medium text-gray-700 transition hover:text-secondary dark:text-gray-300">
                Email: {{ headOffice.email }}
              </a>
            </li>
            <li v-for="contact in contacts" :key="contact._id">
              <a :href="telephoneHref(contact.phone)" class="inline-block text-sm font-medium text-gray-700 transition hover:text-secondary dark:text-gray-300">
                {{ contact.phone }} ({{ contact.name }})
              </a>
            </li>
          </ul>

          <div class="mt-6 border-t border-gray/15 pt-4 dark:border-white/10">
            <p class="mb-2 text-sm font-extrabold text-black dark:text-white">Wilayah Layanan Utama</p>
            <ul class="space-y-1.5 text-sm font-semibold">
              <li>
                <NuxtLink to="/kjpp-palembang" class="text-gray-700 transition hover:text-primary dark:text-gray-300">
                  KJPP Palembang
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/kjpp-sumatera-selatan" class="text-gray-700 transition hover:text-primary dark:text-gray-300">
                  KJPP Sumatera Selatan (Sumsel)
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/kjpp-sumatera" class="text-gray-700 transition hover:text-primary dark:text-gray-300">
                  KJPP Sumatera
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="bg-gradient-to-r from-[#FCF1F4] to-[#EDFBF9] py-5 dark:border-t-2 dark:border-white/5 dark:bg-none">
      <div class="container">
        <div class="flex flex-col items-center justify-between gap-2 text-center font-bold text-gray-800 dark:text-white md:flex-row">
          <div class="text-sm">
            Copyright &copy; {{ new Date().getFullYear() }}
            <NuxtLink to="/" class="text-sky-700 transition hover:text-secondary dark:text-primary">{{ company.name }}</NuxtLink>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm">
            <NuxtLink to="/kjpp-palembang" class="text-purple-700 font-bold transition hover:text-primary dark:text-primary">Palembang</NuxtLink>
            <span class="text-gray-400" aria-hidden="true">·</span>
            <NuxtLink to="/kjpp-sumatera-selatan" class="text-purple-700 font-bold transition hover:text-primary dark:text-primary">Sumsel</NuxtLink>
            <span class="text-gray-400" aria-hidden="true">·</span>
            <NuxtLink to="/kjpp-sumatera" class="text-purple-700 font-bold transition hover:text-primary dark:text-primary">Sumatera</NuxtLink>
            <span class="text-gray-400" aria-hidden="true">·</span>
            <NuxtLink to="/faq" class="text-purple-700 font-bold transition hover:text-primary dark:text-primary">FAQ</NuxtLink>
            <span class="text-gray-400" aria-hidden="true">·</span>
            <NuxtLink to="/contact-us" class="text-purple-700 font-bold transition hover:text-primary dark:text-primary">Contact Us</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
