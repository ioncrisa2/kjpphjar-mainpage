<script setup lang="ts">
const config = useRuntimeConfig()
const baseUrl = String(config.public.baseUrl || 'https://kjpp-hjar.co.id').replace('://www.', '://').replace(/\/$/, '')
const { company, headOffice, buildProfessionalServiceJsonLd, hasValue } = useCompanyProfile()

const pageTitle = "KJPP Sumatera Selatan (Sumsel) – Layanan Penilai Publik Resmi | HJA'R"
const pageDescription =
  "KJPP HJA'R melayani penilaian properti, perkebunan, alat berat, bisnis, dan studi kelayakan di seluruh 17 kabupaten dan kota Sumatera Selatan (Sumsel)."

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(buildProfessionalServiceJsonLd(baseUrl)).replace(/</g, '\\u003c'),
    },
  ],
})
</script>

<template>
  <div>
    <!-- Banner -->
    <section class="pub-page-banner">
      <div class="container">
        <span class="pub-eyebrow">Wilayah Layanan Provinsi Sumatera Selatan</span>
        <h1 class="pub-h1">Layanan KJPP di Sumatera Selatan (Sumsel) – Penilaian Aset, Bisnis &amp; Proyek</h1>
      </div>
    </section>

    <!-- Main Content -->
    <section class="pub-section bg-[var(--paper)]">
      <div class="container max-w-4xl">
        <UiBreadcrumbs :items="[{ label: 'KJPP Sumatera Selatan' }]" class="mb-10" />

        <article class="prose prose-lg max-w-none text-[var(--ink)] dark:prose-invert">
          <p>
            Provinsi <strong>Sumatera Selatan (Sumsel)</strong> memiliki struktur ekonomi yang ditopang oleh sektor perkebunan, pertambangan dan energi, pertanian pangan, industri pengolahan, perdagangan antardaerah, serta pembangunan infrastruktur kawasan. Untuk mendukung kebutuhan opini nilai yang objektif bagi dunia usaha, perbankan, maupun pemerintah daerah di seluruh provinsi ini, <strong>{{ company.name }} ({{ company.shortName }})</strong> mengoperasikan pusat kendali penugasan langsung dari <NuxtLink to="/kjpp-palembang">Kantor Pusat di Palembang</NuxtLink> sejak tahun 2013. Kedekatan geografis dari ibu kota provinsi memudahkan mobilisasi tim penilai ke seluruh kabupaten dan kota di Sumatera Selatan secara terjadwal dan efisien.
          </p>

          <h2>Jangkauan Layanan di 17 Kabupaten dan Kota Sumatera Selatan</h2>
          <p>
            Tim penilai bersertifikat MAPPI dari {{ company.shortName }} melayani penugasan inspeksi lapangan dan penilaian di seluruh 17 wilayah administratif Sumatera Selatan, yang meliputi:
          </p>
          <ul>
            <li><strong>Empat Kota Otonom:</strong> Kota Palembang, Kota Prabumulih, Kota Lubuklinggau, dan Kota Pagaralam.</li>
            <li><strong>Kawasan Pesisir Timur &amp; Hilir Sungai Musi:</strong> Kabupaten Banyuasin (termasuk kawasan industri dan pelabuhan Tanjung Api-Api / Tanjung Lago), Kabupaten Musi Banyuasin (Sekayu dan koridor perkebunan/migas), Kabupaten Ogan Ilir (Indralaya), serta Kabupaten Ogan Komering Ilir (Kayuagung).</li>
            <li><strong>Kawasan Lintas Tengah &amp; Penghasil Energi:</strong> Kabupaten Muara Enim, Kabupaten Lahat, Kabupaten Penukal Abab Lematang Ilir (PALI), dan Kabupaten Empat Lawang.</li>
            <li><strong>Kawasan Komering &amp; Lumbung Pangan Selatan:</strong> Kabupaten Ogan Komering Ulu (Baturaja), Kabupaten OKU Timur (Martapura), dan Kabupaten OKU Selatan (Muaradua).</li>
            <li><strong>Kawasan Barat Sumatera Selatan:</strong> Kabupaten Musi Rawas dan Kabupaten Musi Rawas Utara (Muratara).</li>
          </ul>
          <p>
            Selain melayani ke-17 kabupaten dan kota di Sumatera Selatan, kami juga melayani penugasan lintas provinsi di seluruh <NuxtLink to="/kjpp-sumatera">Pulau Sumatera</NuxtLink> serta jaringan nasional.
          </p>

          <h2>Karakteristik Objek dan Jenis Penilaian di Sumatera Selatan</h2>
          <p>
            Setiap daerah di Sumatera Selatan memiliki kebutuhan penilaian yang spesifik. Berdasarkan rekam jejak penugasan yang ditangani oleh tim {{ company.shortName }}, layanan kami di Sumatera Selatan mencakup empat bidang utama:
          </p>
          <ol>
            <li>
              <strong><NuxtLink to="/layanan/penilaian-properti">Penilaian Properti, Lahan Produktif &amp; Alat Berat</NuxtLink>:</strong> Meliputi penilaian tanah dan bangunan residensial maupun komersial (ruko, pasar, hotel, gudang) untuk agunan kredit perbankan seperti Bank Sumsel Babel, Bank Sumsel Babel Syariah, Bank Mandiri, BNI, dan BSI; penilaian lahan perkebunan kelapa sawit atau karet beserta fasilitas pabrik pengolahannya (misalnya untuk keperluan agunan maupun <em>inbreng</em> aset perusahaan); penilaian lokasi dan peralatan pertambangan serta armada alat berat di koridor Lahat dan Muara Enim; hingga penilaian Barang Milik Daerah (BMD) milik pemerintah kabupaten/kota seperti Pemerintah Kota Pagaralam.
            </li>
            <li>
              <strong><NuxtLink to="/layanan/penilaian-bisnis">Penilaian Bisnis &amp; Penyertaan Saham</NuxtLink>:</strong> Valuasi nilai ekuitas perusahaan daerah (BUMD), perusahaan perkebunan, logistik, maupun manufaktur di Sumatera Selatan untuk keperluan penyertaan modal, penambahan mitra strategis, akuisisi, restrukturisasi utang, dan pelaporan keuangan sesuai standar akuntansi.
            </li>
            <li>
              <strong><NuxtLink to="/layanan/studi-kelayakan">Studi Kelayakan Investasi Daerah &amp; Swasta</NuxtLink>:</strong> Penyusunan kajian kelayakan komprehensif bagi rencana pengembangan pabrik pengolahan hasil bumi, kebun komoditas, rumah sakit, perumahan, maupun proyek infrastruktur daerah di Sumatera Selatan guna menilai kelayakan pasar, teknis operasional, regulasi, dan arus kas keuangan.
            </li>
            <li>
              <strong><NuxtLink to="/layanan/pengawasan-proyek">Pengawasan Proyek Konstruksi</NuxtLink>:</strong> Pemantauan berkala atas kemajuan fisik proyek pembangunan gedung, pabrik, atau infrastruktur di berbagai kabupaten/kota Sumatera Selatan agar pencairan pembiayaan berjalan sesuai realisasi fisik di lapangan.
            </li>
          </ol>

          <h2>Alur Kerja untuk Penugasan di Kabupaten dan Kota Sumsel</h2>
          <p>
            Agar penugasan penilaian di luar Kota Palembang berjalan lancar dan tepat waktu, {{ company.shortName }} menerapkan prosedur kerja sebagai berikut:
          </p>
          <ul>
            <li><strong>Permohonan &amp; Verifikasi Awal Dokumen:</strong> Klien mengirimkan rincian tujuan penilaian, daftar dan titik lokasi objek (desa/kelurahan, kecamatan, dan kabupaten/kota), serta salinan dokumen kepemilikan (SHM, SHGB, HGU, SPPT PBB, PBG/IMB, atau daftar inventaris mesin dan alat berat) melalui email atau WhatsApp kantor pusat sebelum tim berangkat ke lokasi.</li>
            <li><strong>Penawaran Tertulis yang Transparan:</strong> Kami menyusun surat penawaran resmi yang merinci biaya jasa penilaian, estimasi jumlah hari kerja penyelesaian laporan, serta komponen biaya transportasi atau akomodasi perjalanan inspeksi ke kabupaten/kota tujuan secara jelas di awal.</li>
            <li><strong>Pelaksanaan Survei Lapangan Terjadwal:</strong> Setelah surat perikatan ditandatangani, tim penilai kami melakukan kunjungan langsung ke lokasi aset di kabupaten/kota terkait. Pemberi tugas menyiapkan pendamping lapangan yang memahami batas tanah atau spesifikasi unit mesin/alat berat agar pemeriksaan fisik berjalan menyeluruh.</li>
            <li><strong>Analisis Standar SPI &amp; Penerbitan Laporan:</strong> Data lapangan diolah di Kantor Pusat Palembang menggunakan basis data pembanding pasar regional Sumatera Selatan, melewati tahapan <em>quality control</em> berjenjang, lalu diterbitkan sebagai laporan penilaian resmi yang ditandatangani Penilai Publik berizin Kementerian Keuangan.</li>
          </ul>

          <h2>Ajakan Menghubungi Tim Penilai KJPP HJA'R</h2>
          <p>
            Baik Anda mewakili perbankan, BUMN, BUMD, pemerintah kabupaten/kota, perusahaan perkebunan dan pertambangan, maupun pemilik aset perorangan di Sumatera Selatan, tim kami siap memberikan opini nilai yang independen dan dapat dipertanggungjawabkan. Silakan baca halaman <NuxtLink to="/faq">Tanya Jawab (FAQ)</NuxtLink> untuk informasi persyaratan dokumen atau hubungi kami untuk mendapatkan penawaran resmi.
          </p>
        </article>

        <!-- Contact CTA Box -->
        <div class="pub-box mt-12 p-6 sm:p-8">
          <h2 class="pub-serif text-[24px] leading-[1.25] text-[var(--ink)]">
            Jadwalkan Penilaian Aset di Wilayah Sumatera Selatan
          </h2>
          <p class="mt-3 text-[16px] leading-[1.7] text-[var(--muted)] [&_strong]:text-[var(--ink)]">
            <template v-if="hasValue(headOffice.fullAddress)">
              <strong>Kantor Pusat Koordinasi Sumsel:</strong> {{ headOffice.fullAddress }}<br />
            </template>
            <template v-if="hasValue(headOffice.phone)">
              <strong>Telepon:</strong> <a :href="`tel:${headOffice.phoneE164}`" class="pub-link font-bold tabular-nums">{{ headOffice.phone }}</a>
            </template>
            <template v-if="hasValue(headOffice.whatsapp)">
              · <strong>WhatsApp:</strong> <a :href="`https://wa.me/${headOffice.whatsappDigits}`" target="_blank" rel="noopener noreferrer" class="pub-link font-bold tabular-nums">{{ headOffice.whatsapp }}</a>
            </template>
            <template v-if="hasValue(headOffice.email)">
              · <strong>Email:</strong> <a :href="`mailto:${headOffice.email}`" class="pub-link font-bold tabular-nums">{{ headOffice.email }}</a>
            </template>
          </p>
          <div class="mt-6 flex flex-wrap gap-4">
            <NuxtLink to="/contact-us" class="pub-btn">
              Minta Penawaran Tertulis
            </NuxtLink>
            <NuxtLink to="/faq" class="pub-btn-ghost">
              Pelajari Prosedur &amp; FAQ
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
