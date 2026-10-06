<script setup lang="ts">
useHead({
  title: "Q&A (FAQ) | KJPP HJA'R",
  meta: [
    { name: 'description', content: 'Pertanyaan yang sering diajukan seputar layanan penilai publik dan konsultan di KJPP HJA\'R.' }
  ]
})

const { data: faqs } = await useFetch('/api/faq')
const openIndexes = ref<number[]>([])

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
    <section class="bg-black py-20 lg:py-[100px] bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-center bg-no-repeat relative">
      <div class="absolute inset-0 bg-black/60"></div>
      <div class="container relative z-10 text-center">
        <h1 class="text-3xl font-black uppercase text-white sm:text-4xl lg:text-5xl">Q&A (FAQ)</h1>
        <p class="mt-4 text-lg font-medium text-white max-w-2xl mx-auto">
          Temukan jawaban atas pertanyaan yang sering diajukan mengenai layanan kami.
        </p>
      </div>
    </section>

    <!-- FAQ Content -->
    <section class="py-14 lg:py-24">
      <div class="container max-w-4xl">
        <UiBreadcrumbs :items="[{ label: 'Q&A (FAQ)' }]" />
        
        <div v-if="!faqs || faqs.length === 0" class="text-center text-gray-500 py-10">
          Belum ada pertanyaan yang tersedia.
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="(faq, index) in faqs" 
            :key="faq._id" 
            class="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-dark shadow-sm"
            itemscope itemprop="mainEntity" itemtype="https://schema.org/Question"
          >
            <button 
              @click="toggleFaq(index)"
              class="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-gray-50 dark:hover:bg-white/5 transition"
            >
              <h3 class="text-lg font-bold text-black dark:text-white" itemprop="name">
                {{ faq.question }}
              </h3>
              <div class="shrink-0 ml-4 text-primary">
                <svg v-if="isOpen(index)" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              </div>
            </button>
            <div 
              v-show="isOpen(index)" 
              class="p-5 border-t border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line"
              itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer"
            >
              <div itemprop="text">{{ faq.answer }}</div>
            </div>
          </div>
        </div>
        
        <!-- FAQ Schema JSON-LD -->
        <Head>
          <script type="application/ld+json">
            {{
              JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqs?.map((f: any) => ({
                  "@type": "Question",
                  "name": f.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.answer
                  }
                })) || []
              })
            }}
          </script>
        </Head>
      </div>
    </section>
  </div>
</template>
