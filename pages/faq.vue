<script setup lang="ts">
import { sanitizeJsonLd } from '~/shared/company-data'

const faqTitle = "Tanya Jawab (FAQ) Jasa Penilai Publik | KJPP HJA'R Palembang"
const faqDescription =
  "Jawaban atas pertanyaan umum seputar prosedur, dokumen, waktu kerja, biaya, dan legalitas jasa penilaian publik di KJPP HJA'R Palembang."

useSeoMeta({
  title: faqTitle,
  description: faqDescription,
  ogTitle: faqTitle,
  ogDescription: faqDescription,
  twitterTitle: faqTitle,
  twitterDescription: faqDescription,
})

const { data: faqs } = await useFetch('/api/faq')
const openIndexes = ref<number[]>([])

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => {
        if (!faqs.value?.length) return ''
        return JSON.stringify(
          sanitizeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.value.map((f: any) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          })
        ).replace(/</g, '\\u003c')
      }),
    },
  ],
})

function toggleFaq(index: number) {
  const i = openIndexes.value.indexOf(index)
  if (i > -1) {
    openIndexes.value.splice(i, 1)
  } else {
    openIndexes.value.push(index)
  }
}

function isOpen(index: number) {
  return openIndexes.value.includes(index)
}
</script>

<template>
  <div>
    <!-- Banner -->
    <section class="pub-page-banner">
      <div class="container">
        <span class="pub-eyebrow">Tanya Jawab</span>
        <h1 class="pub-h1">Q&amp;A (FAQ)</h1>
        <p class="pub-lead">
          Temukan jawaban atas pertanyaan yang sering diajukan mengenai layanan kami.
        </p>
      </div>
    </section>

    <!-- FAQ Content -->
    <section class="pub-section bg-[var(--paper)]">
      <div class="container max-w-4xl">
        <UiBreadcrumbs :items="[{ label: 'FAQ' }]" class="mb-10" />

        <div v-if="!faqs || faqs.length === 0" class="py-10 text-[var(--muted)]">
          Belum ada pertanyaan yang tersedia.
        </div>

        <div v-else class="border-t border-[var(--rule)]">
          <div
            v-for="(faq, index) in faqs"
            :key="faq._id"
            class="border-b border-[var(--rule)]"
          >
            <button
              type="button"
              class="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-150 hover:text-[var(--brand-navy)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47BDFF]"
              :aria-expanded="isOpen(index)"
              @click="toggleFaq(index)"
            >
              <h3 class="pub-serif text-[20px] leading-[1.35] text-[var(--ink)]">
                {{ faq.question }}
              </h3>
              <span class="mt-1 shrink-0 text-[var(--brand-navy)]">
                <Icon :name="isOpen(index) ? 'ph:minus-bold' : 'ph:plus-bold'" class="h-5 w-5" aria-hidden="true" />
              </span>
            </button>
            <div
              v-show="isOpen(index)"
              class="pb-6"
            >
              <!-- Jawaban sudah disanitasi di server (server/utils/faq.ts) -->
              <div
                class="prose max-w-[68ch] text-[var(--ink)] dark:prose-invert [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                v-html="faq.answer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <BlogRecentArticles
      class="border-t border-[var(--rule)] bg-[var(--surface)] py-16 lg:py-20"
      title="Ingin Tahu Lebih Dalam?"
      description="Baca panduan dan artikel dari tim penilai kami."
    />
  </div>
</template>
