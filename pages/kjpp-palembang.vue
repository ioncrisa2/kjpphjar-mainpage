<script setup lang="ts">
const config = useRuntimeConfig()
const baseUrl = String(config.public.baseUrl || 'https://kjpp-hjar.co.id').replace('://www.', '://').replace(/\/$/, '')
const { company, headOffice, buildProfessionalServiceJsonLd, hasValue } = useCompanyProfile()

const pageTitle = "KJPP Palembang – Kantor Pusat Jasa Penilai Publik Independen | HJA'R"
const pageDescription =
  "Kantor Pusat KJPP Henricus Judi Adrianto & Rekan (HJA'R) di Palembang melayani penilaian properti, bisnis, studi kelayakan, dan pengawasan proyek sesuai SPI sejak 2013."

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
        <span class="pub-eyebrow">Kantor Pusat Palembang</span>
        <h1 class="pub-h1">KJPP di Palembang – Kantor Jasa Penilai Publik Henricus Judi Adrianto &amp; Rekan</h1>
      </div>
    </section>

    <!-- Main Content -->
    <section class="pub-section bg-[var(--paper)]">
      <div class="container max-w-4xl">
        <UiBreadcrumbs :items="[{ label: 'KJPP Palembang' }]" class="mb-10" />

        <article class="prose prose-lg max-w-none text-[var(--ink)] dark:prose-invert">
          <p>
            <strong>{{ company.name }} ({{ company.shortName }})</strong> adalah Kantor Jasa Penilai Publik berizin resmi dari Kementerian Keuangan Republik Indonesia yang berkantor pusat langsung di <strong>Kota Palembang</strong> sejak berdiri pada 28 November 2013. Berbeda dari kantor perwakilan yang hanya menerima penerusan berkas, seluruh fungsi pimpinan rekan, direktur teknis, pengendalian mutu laporan, hingga tim pelaksana inspeksi lapangan berpusat di kantor kami di {{ headOffice.fullAddress }}. Kehadiran kantor pusat di Palembang memungkinkan komunikasi tatap muka yang cepat, verifikasi dokumen yang lebih cermat, serta jadwal survei lapangan yang efisien bagi nasabah perorangan, pelaku usaha, perbankan, maupun instansi di Kota Palembang.
          </p>

          <h2>Wilayah Layanan di Kota Palembang dan Kawasan Sekitarnya</h2>
          <p>
            Sebagai pusat perdagangan, jasa, industri, dan pelabuhan sungai di Sumatera Selatan, Palembang memiliki karakteristik aset yang beragam. Tim penilai {{ company.shortName }} melayani kegiatan inspeksi dan penilaian objek di seluruh kecamatan di Kota Palembang, mulai dari koridor niaga dan perkantoran di Ilir Timur, Ilir Barat, Kemuning, dan Bukit Kecil, kawasan permukiman dan pengembangan perumahan di Sukarami, Alang-Alang Lebar, Sako, Sematang Borang, dan Kalidoni, hingga kawasan pergudangan, industri, dan pelabuhan di Seberang Ulu, Plaju, Kertapati, serta Gandus.
          </p>
          <p>
            Selain melayani objek di dalam batas administratif Kota Palembang, tim kantor pusat juga secara rutin menangani penugasan di wilayah penyangga aglomerasi Patungraya Agung (Banyuasin dan Ogan Ilir) serta mengoordinasikan penugasan untuk seluruh wilayah <NuxtLink to="/kjpp-sumatera-selatan">Sumatera Selatan</NuxtLink> dan <NuxtLink to="/kjpp-sumatera">Pulau Sumatera</NuxtLink>. Untuk objek yang berada di dalam Kota Palembang, penjadwalan kunjungan lapangan dapat dilakukan segera setelah surat perikatan ditandatangani dan dokumen dasar diterima.
          </p>

          <h2>Jenis Penilaian dan Konsultasi yang Tersedia di Palembang</h2>
          <p>
            Beroperasi berdasarkan Keputusan Menteri Keuangan RI Nomor 31/KM.1/2020 (Nomor Izin Usaha KJPP {{ company.licenses.kjppLicenseNumber }}) dan dipimpin oleh Penilai Publik berizin yang tergabung dalam Masyarakat Profesi Penilai Indonesia (MAPPI), kami menyediakan empat layanan utama:
          </p>
          <ul>
            <li>
              <strong><NuxtLink to="/layanan/penilaian-properti">Penilaian Properti</NuxtLink>:</strong> Mencakup penilaian tanah dan bangunan (rumah tinggal, ruko, gedung kantor, gudang, pabrik), mesin dan peralatan industri, kendaraan bermotor, alat berat, hingga kapal tunda (<em>tug boat</em>), tongkang, dan fasilitas galangan kapal di sepanjang alur Sungai Musi. Layanan ini digunakan untuk keperluan agunan kredit bank, jual beli, lelang, asuransi, pembagian warisan, maupun pelaporan keuangan perusahaan dan pemerintah daerah.
            </li>
            <li>
              <strong><NuxtLink to="/layanan/penilaian-bisnis">Penilaian Bisnis</NuxtLink>:</strong> Mencakup penilaian entitas badan usaha, penyertaan saham, surat berharga, serta aset tak berwujud untuk mendukung rencana akuisisi, penggabungan usaha (merger), masuknya mitra investasi baru, pemasukan aset sebagai modal saham (<em>inbreng</em>), maupun restrukturisasi perusahaan di Palembang.
            </li>
            <li>
              <strong><NuxtLink to="/layanan/studi-kelayakan">Studi Kelayakan Proyek</NuxtLink>:</strong> Kajian menyeluruh atas rencana investasi atau pengembangan proyek baru—seperti pembangunan perumahan, ruko komersial, fasilitas kesehatan, gudang logistik, atau pabrik pengolahan—ditinjau dari aspek pasar, teknis, manajemen, hukum, lingkungan, dan kelayakan finansial.
            </li>
            <li>
              <strong><NuxtLink to="/layanan/pengawasan-proyek">Pengawasan Proyek (Project Monitoring)</NuxtLink>:</strong> Pemantauan independen terhadap kesesuaian progres fisik konstruksi di lapangan dibandingkan dengan jadwal pelaksanaan dan rencana anggaran biaya, terutama sebagai dasar pencairan termin kredit konstruksi bagi perbankan dan pemilik proyek.
            </li>
          </ul>

          <h2>Mitra Perbankan, BUMN, dan Korporasi</h2>
          <p>
            Laporan penilaian {{ company.shortName }} disusun berpedoman pada Kode Etik Penilai Indonesia (KEPI) dan Standar Penilaian Indonesia (SPI) sehingga diakui oleh lembaga keuangan dan auditor. Rekanan dan klien yang pernah menggunakan jasa kami mencakup perbankan nasional dan daerah seperti Bank Indonesia, Bank Mandiri, Bank Negara Indonesia (BNI), Bank Syariah Indonesia (BSI), Bank Sumsel Babel, Bank Sumsel Babel Syariah, Bank Danamon, Bank Panin, Bank Index, Bank Maspion, Bank Nobu, dan Bank Sahabat Sampoerna, serta korporasi dan instansi seperti PT Pupuk Sriwidjaja dan berbagai pemerintah daerah. Daftar lengkap dapat dilihat pada halaman <NuxtLink to="/rekan-klien">Rekan dan Klien</NuxtLink>.
          </p>

          <h2>Alur Kerja Penilaian di Kantor Pusat Palembang</h2>
          <p>
            Untuk menjaga ketepatan waktu dan objektivitas opini nilai, setiap penugasan di Kantor Pusat Palembang mengikuti enam tahapan terstandar:
          </p>
          <ol>
            <li><strong>Konsultasi Awal &amp; Identifikasi Kebutuhan:</strong> Pemberi tugas menyampaikan tujuan penilaian (misalnya pengajuan kredit pada bank tertentu, transaksi jual beli, atau laporan keuangan), jenis aset, lokasi objek di Palembang, serta tenggat waktu yang dibutuhkan.</li>
            <li><strong>Penyampaian Surat Penawaran:</strong> Tim kami menyusun penawaran tertulis secara transparan yang memuat ruang lingkup pekerjaan, daftar dokumen yang diperlukan, estimasi waktu penyelesaian, dan rincian biaya jasa. Besaran biaya jasa tidak pernah dikaitkan dengan nilai akhir aset demi menjaga independensi penilai.</li>
            <li><strong>Penandatanganan Surat Perikatan &amp; Penyerahan Dokumen:</strong> Setelah penawaran disetujui, kedua pihak menandatangani surat perikatan kerja (kontrak) dan klien menyerahkan salinan dokumen kepemilikan serta dokumen teknis objek.</li>
            <li><strong>Inspeksi Lapangan di Lokasi Objek:</strong> Penilai kami melakukan survei langsung ke lokasi aset di Palembang untuk memverifikasi batas fisik, luas, kondisi bangunan atau spesifikasi mesin/alat, aksesibilitas jalan, serta lingkungan sekitar dengan didampingi pemilik atau kuasanya.</li>
            <li><strong>Analisis Data Pasar &amp; Perhitungan Nilai:</strong> Tim teknis menganalisis data transaksi dan penawaran pembanding di koridor pasar yang relevan menggunakan pendekatan penilaian yang sesuai menurut SPI (pendekatan pasar, pendekatan pendapatan, atau pendekatan biaya).</li>
            <li><strong>Review Pengendalian Mutu &amp; Penerbitan Laporan:</strong> Draf laporan diperiksa secara berjenjang oleh bagian pengendalian mutu dan ditandatangani secara resmi oleh Penilai Publik berizin sebelum diserahkan kepada pemberi tugas. Untuk satu objek rumah tinggal dengan dokumen lengkap, proses ini umumnya selesai dalam 1–6 hari kerja setelah inspeksi lapangan.</li>
          </ol>

          <h2>Hubungi Kantor Pusat KJPP HJA'R di Palembang</h2>
          <p>
            Apabila Anda membutuhkan jasa penilai publik independen di Palembang untuk keperluan perbankan, korporasi, maupun perorangan, silakan kunjungi atau hubungi Kantor Pusat kami. Anda juga dapat mempelajari jawaban atas pertanyaan yang sering diajukan pada halaman <NuxtLink to="/faq">Tanya Jawab (FAQ)</NuxtLink> atau melihat profil lengkap tim kami di halaman <NuxtLink to="/about-us">Tentang Kami</NuxtLink>.
          </p>
        </article>

        <!-- Contact CTA Box -->
        <div class="pub-box mt-12 p-6 sm:p-8">
          <h2 class="pub-serif text-[24px] leading-[1.25] text-[var(--ink)]">
            Konsultasi &amp; Permintaan Penawaran – Kantor Pusat Palembang
          </h2>
          <p class="mt-3 text-[16px] leading-[1.7] text-[var(--muted)] [&_strong]:text-[var(--ink)]">
            <template v-if="hasValue(headOffice.fullAddress)">
              <strong>Alamat:</strong> {{ headOffice.fullAddress }}<br />
            </template>
            <template v-if="hasValue(headOffice.phone)">
              <strong>Telepon Kantor:</strong> <a :href="`tel:${headOffice.phoneE164}`" class="pub-link font-bold tabular-nums">{{ headOffice.phone }}</a>
            </template>
            <template v-if="hasValue(headOffice.whatsapp)">
              · <strong>WhatsApp:</strong> <a :href="`https://wa.me/${headOffice.whatsappDigits}`" target="_blank" rel="noopener noreferrer" class="pub-link font-bold tabular-nums">{{ headOffice.whatsapp }}</a>
            </template>
            <template v-if="hasValue(headOffice.email)">
              · <strong>Email:</strong> <a :href="`mailto:${headOffice.email}`" class="pub-link font-bold tabular-nums">{{ headOffice.email }}</a><br />
            </template>
            <template v-if="hasValue(company.operatingHours.display)">
              <strong>Jam Operasional:</strong> {{ company.operatingHours.display }}
            </template>
          </p>
          <div class="mt-6 flex flex-wrap gap-4">
            <NuxtLink to="/contact-us" class="pub-btn">
              Hubungi Kami Sekarang
            </NuxtLink>
            <NuxtLink to="/layanan" class="pub-btn-ghost">
              Lihat Semua Layanan
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
