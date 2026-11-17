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
  <footer class="mt-auto border-t border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)]">
    <div class="container">
      <div class="grid gap-y-10 gap-x-8 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <!-- Brand & Legalitas -->
        <div class="relative">
          <div class="flex flex-row gap-3 items-center">
            <img src="/assets/images/h-logo.png" :alt="`Logo ${company.name}`" width="56" height="56" class="h-[56px] w-auto rounded-[2px]" />
            <span class="pub-serif max-w-[230px] text-[18px] leading-snug text-[var(--ink)]">
              {{ company.name }}
            </span>
          </div>
          <p class="mt-4 text-[14px] leading-[1.6] tabular-nums text-[var(--muted)]">
            Kantor Jasa Penilai Publik (KJPP) independen berkantor pusat di Palembang sejak {{ company.foundedYear }}.
          </p>
          <div class="mt-4 border-t border-[var(--rule)] pt-4 text-[13px] leading-[1.6] tabular-nums text-[var(--muted)]">
            <p class="font-bold text-[var(--ink)]">Izin &amp; Keanggotaan Resmi:</p>
            <ul class="mt-1.5 space-y-1">
              <li><strong class="text-[var(--ink)]">Izin Usaha KJPP (Kemenkeu):</strong> No. {{ company.licenses.kjppLicenseNumber }} ({{ company.licenses.kjppDecreeNumber }})</li>
              <li><strong class="text-[var(--ink)]">Izin Penilai Publik:</strong> {{ company.licenses.managingPartnerValuerLicense }}</li>
              <li><strong class="text-[var(--ink)]">Keanggotaan:</strong> {{ company.licenses.mappiMembership }}</li>
              <li v-if="hasConfirmedOjk"><strong class="text-[var(--ink)]">Terdaftar OJK:</strong> {{ company.licenses.ojkRegistration }}</li>
            </ul>
          </div>
          <div v-if="socialLinks.length" class="mt-6">
            <p class="mb-2.5 text-[14px] font-normal text-[var(--muted)]">Ikuti kami di media sosial:</p>
            <ul class="flex flex-wrap items-center gap-2">
              <li v-for="social in socialLinks" :key="social.network">
                <a
                  :href="social.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex h-9 min-w-9 items-center justify-center rounded-[2px] border border-[var(--rule)] px-2 text-xs font-bold text-[var(--ink)] transition-colors duration-150 hover:border-[var(--brand-navy)] hover:text-[var(--brand-navy)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-navy)]"
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
          <p class="pub-serif mb-4 text-[20px] text-[var(--ink)]">Kantor Pusat</p>
          <ul class="flex flex-col gap-3 text-[14px] leading-[1.6] text-[var(--muted)]">
            <li class="whitespace-pre-line">
              <strong class="text-[var(--ink)]">{{ headOffice.name }}:</strong><br />
              {{ headOffice.fullAddress }}
            </li>
            <li class="tabular-nums">
              <strong class="text-[var(--ink)]">Jam Operasional:</strong><br />
              {{ company.operatingHours.display }}
            </li>
            <li v-if="headOffice.googleMapsUrl">
              <a
                :href="headOffice.googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="pub-link text-[14px] font-bold"
              >
                Buka Kantor Pusat di Google Maps →
              </a>
            </li>
          </ul>
        </div>

        <!-- Kantor Cabang -->
        <div>
          <p class="pub-serif mb-4 text-[20px] text-[var(--ink)]">Kantor Cabang</p>
          <ul class="space-y-3 text-[14px] leading-[1.6] tabular-nums text-[var(--muted)]">
            <li v-for="branch in otherBranches" :key="branch.id" class="border-b border-[var(--rule)] pb-3 last:border-b-0 last:pb-0">
              <strong class="block font-bold text-[var(--ink)]">{{ branch.name }} ({{ branch.city }})</strong>
              <span>{{ branch.address }}</span><br />
              <a :href="branch.phoneHref" class="pub-link font-bold">
                Telp: {{ branch.phone }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Kontak & Navigasi Wilayah -->
        <div>
          <p class="pub-serif mb-4 text-[20px] text-[var(--ink)]">Kontak Resmi</p>
          <ul class="flex flex-col gap-2 text-[14px] leading-[1.6] tabular-nums text-[var(--muted)]">
            <li v-if="headOffice.phone">
              <a :href="telephoneHref(headOffice.phone)" class="pub-link font-bold">
                Telp Kantor Pusat: {{ headOffice.phone }}
              </a>
            </li>
            <li v-if="headOffice.email">
              <a :href="`mailto:${headOffice.email}`" class="pub-link">
                Email: {{ headOffice.email }}
              </a>
            </li>
            <li v-for="contact in contacts" :key="contact._id">
              <a :href="telephoneHref(contact.phone)" class="pub-link">
                {{ contact.phone }} ({{ contact.name }})
              </a>
            </li>
          </ul>

          <div class="mt-6 border-t border-[var(--rule)] pt-4">
            <p class="mb-2 text-[14px] font-bold text-[var(--ink)]">Wilayah Layanan Utama</p>
            <ul class="space-y-1.5 text-[14px]">
              <li>
                <NuxtLink to="/kjpp-palembang" class="pub-link">
                  KJPP Palembang
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/kjpp-sumatera-selatan" class="pub-link">
                  KJPP Sumatera Selatan (Sumsel)
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/kjpp-sumatera" class="pub-link">
                  KJPP Sumatera
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-[var(--rule)] py-5">
      <div class="container">
        <div class="flex flex-col items-center justify-between gap-2 text-center text-[14px] tabular-nums text-[var(--muted)] md:flex-row">
          <div>
            Copyright &copy; {{ new Date().getFullYear() }}
            <NuxtLink to="/" class="pub-link font-bold">{{ company.name }}</NuxtLink>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <NuxtLink to="/kjpp-palembang" class="pub-link font-bold">Palembang</NuxtLink>
            <span class="text-[var(--muted)]" aria-hidden="true">·</span>
            <NuxtLink to="/kjpp-sumatera-selatan" class="pub-link font-bold">Sumsel</NuxtLink>
            <span class="text-[var(--muted)]" aria-hidden="true">·</span>
            <NuxtLink to="/kjpp-sumatera" class="pub-link font-bold">Sumatera</NuxtLink>
            <span class="text-[var(--muted)]" aria-hidden="true">·</span>
            <NuxtLink to="/faq" class="pub-link font-bold">FAQ</NuxtLink>
            <span class="text-[var(--muted)]" aria-hidden="true">·</span>
            <NuxtLink to="/contact-us" class="pub-link font-bold">Contact Us</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
