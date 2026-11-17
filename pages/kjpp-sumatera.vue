<script setup lang="ts">
const config = useRuntimeConfig()
const baseUrl = String(config.public.baseUrl || 'https://kjpp-hjar.co.id').replace('://www.', '://').replace(/\/$/, '')
const { company, headOffice, otherBranches, buildProfessionalServiceJsonLd } = useCompanyProfile()

const pageTitle = "KJPP Sumatera – Jasa Penilai Publik & Konsultan Independen | HJA'R"
const pageDescription =
  "KJPP HJA'R melayani penilaian properti, penilaian bisnis, studi kelayakan, dan pengawasan proyek di seluruh provinsi Pulau Sumatera dari kantor pusat Palembang."

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
    <section class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat pt-[82px] lg:pt-[106px]">
      <div class="container">
        <div class="items-center py-10 md:flex md:h-[360px] md:py-0">
          <div class="heading mb-0 text-center md:text-left">
            <span class="subtitle !text-white">Jangkauan Regional Pulau Sumatera</span>
            <h1 class="!text-white text-2xl font-extrabold sm:text-3xl lg:text-[40px] lg:!leading-[50px]">
              Jasa Penilai Publik (KJPP) untuk Wilayah Sumatera – KJPP Henricus Judi Adrianto &amp; Rekan
            </h1>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-14 lg:py-20">
      <div class="container max-w-4xl">
        <UiBreadcrumbs :items="[{ label: 'KJPP Sumatera' }]" class="mb-8" />

        <article class="prose prose-lg prose-blue max-w-none text-gray-900 dark:prose-invert dark:text-gray-300">
          <p>
            Pulau <strong>Sumatera</strong> merupakan salah satu koridor ekonomi utama di Indonesia yang menghubungkan industri agroindustri, perkebunan, pertambangan, manufaktur, pelabuhan, logistik, hingga pusat perdagangan perkotaan dari ujung utara hingga selatan. Dalam mendukung transaksi korporasi, pembiayaan perbankan, pelaporan keuangan, serta tata kelola aset pemerintah daerah di kawasan ini, <strong>{{ company.name }} ({{ company.shortName }})</strong> hadir sebagai Kantor Jasa Penilai Publik independen yang memiliki <NuxtLink to="/kjpp-palembang">Kantor Pusat langsung di Pulau Sumatera, tepatnya di Kota Palembang</NuxtLink>, sejak tahun 2013.
          </p>
          <p>
            Keberadaan kantor pusat di Palembang memberikan keunggulan logistik dan koordinasi dibandingkan kantor penilai yang hanya berpusat di luar Sumatera. Dengan dukungan jaringan kantor cabang nasional di Surabaya, Balikpapan, dan Tangerang Selatan, kami siap menangani penugasan penilaian aset tunggal maupun portofolio aset multi-lokasi milik korporasi di berbagai provinsi Sumatera.
          </p>

          <h2>Cakupan Wilayah Layanan Lintas Provinsi di Pulau Sumatera</h2>
          <p>
            Tim penilai publik dan tenaga teknis {{ company.shortName }} menerima dan melaksanakan penugasan penilaian di seluruh sepuluh provinsi di wilayah Sumatera, yang meliputi:
          </p>
          <ul>
            <li><strong>Sumatera Bagian Selatan (Sumbagsel):</strong> Provinsi <NuxtLink to="/kjpp-sumatera-selatan">Sumatera Selatan</NuxtLink>, Provinsi Lampung, Provinsi Bengkulu, Provinsi Jambi, dan Provinsi Kepulauan Bangka Belitung.</li>
            <li><strong>Sumatera Bagian Tengah:</strong> Provinsi Riau (termasuk Pekanbaru dan kawasan industri/perkebunan sekitarnya), Provinsi Kepulauan Riau (Batam, Bintan, Tanjungpinang), dan Provinsi Sumatera Barat (Padang, Bukittinggi, dan sekitarnya).</li>
            <li><strong>Sumatera Bagian Utara:</strong> Provinsi Sumatera Utara (Medan, Deli Serdang, kawasan industri Kuala Tanjung/Sei Mangkei, dan sekitarnya) serta Provinsi Aceh.</li>
          </ul>
          <p>
            Pengalaman tim kami mencakup kerja sama dengan berbagai institusi perbankan nasional, perusahaan BUMN dan BUMD, korporasi swasta, hingga pemerintah daerah di Sumatera—seperti Pemerintah Kota Pekanbaru, Pemerintah Kota Pagaralam, Bank Sumsel Babel, dan PT Pupuk Sriwidjaja. Daftar institusi yang pernah bermitra dengan kami dapat dilihat pada halaman <NuxtLink to="/rekan-klien">Rekan dan Klien</NuxtLink>.
          </p>

          <h2>Layanan Penilaian dan Konsultasi untuk Korporasi &amp; Instansi di Sumatera</h2>
          <p>
            Seluruh pekerjaan penilaian dan konsultasi dilaksanakan oleh Penilai Publik berizin Kementerian Keuangan RI (Nomor Izin Usaha KJPP {{ company.licenses.kjppLicenseNumber }}) dan beranggotakan Masyarakat Profesi Penilai Indonesia (MAPPI) dengan mengacu pada Standar Penilaian Indonesia (SPI) serta Kode Etik Penilai Indonesia (KEPI):
          </p>
          <ol>
            <li>
              <strong><NuxtLink to="/layanan/penilaian-properti">Penilaian Properti &amp; Aset Industri</NuxtLink>:</strong> Penilaian tanah dan bangunan komersial, perkantoran, hotel, gudang logistik, pabrik pengolahan kelapa sawit (PKS) dan karet, instalasi mesin produksi, alat berat, armada transportasi darat, hingga kapal tunda (<em>tug boat</em>) dan tongkang untuk tujuan agunan pembiayaan perbankan, revaluasi aset tetap (PSak), asuransi, jual beli, maupun pengadaan tanah dan pengelolaan Barang Milik Daerah (BMD).
            </li>
            <li>
              <strong><NuxtLink to="/layanan/penilaian-bisnis">Penilaian Bisnis &amp; Aset Tak Berwujud</NuxtLink>:</strong> Valuasi nilai perusahaan, penyertaan saham, obligasi/surat berharga, serta aktiva tak berwujud untuk mendukung aksi korporasi lintas wilayah seperti merger dan akuisisi, pelepasan penyertaan saham (divestasi), <em>inbreng</em> aset ke dalam perseroan, hingga restrukturisasi korporasi.
            </li>
            <li>
              <strong><NuxtLink to="/layanan/studi-kelayakan">Studi Kelayakan Proyek Investasi</NuxtLink>:</strong> Kajian kelayakan independen atas rencana pembangunan proyek baru atau perluasan kapasitas usaha di Sumatera, mencakup analisis pasar dan permintaan regional, aspek teknis dan teknologi, struktur manajemen, kepatuhan hukum dan lingkungan, serta proyeksi kelayakan finansial (NPV, IRR, <em>Payback Period</em>, dan analisis sensitivitas).
            </li>
            <li>
              <strong><NuxtLink to="/layanan/pengawasan-proyek">Pengawasan Proyek (Project Monitoring)</NuxtLink>:</strong> Pemantauan independen atas realisasi fisik pembangunan proyek konstruksi dan infrastruktur dibandingkan dengan jadwal kerja (<em>S-Curve</em>) dan Rencana Anggaran Biaya (RAB) guna melindungi kepentingan kreditur perbankan maupun investor.
            </li>
          </ol>

          <h2>Alur Kerja Penugasan Lintas Provinsi di Sumatera</h2>
          <p>
            Untuk memastikan kelancaran penugasan di berbagai provinsi di Pulau Sumatera, kami menerapkan tahapan koordinasi yang terukur:
          </p>
          <ul>
            <li><strong>Penyampaian Ruang Lingkup &amp; Daftar Aset:</strong> Pemberi tugas menyampaikan tujuan penilaian, rincian jenis dan jumlah aset, titik lokasi di provinsi/kota tujuan, serta tenggat waktu penggunaan laporan.</li>
            <li><strong>Pemeriksaan Dokumen Awal &amp; Penawaran Resmi:</strong> Tim kami meninjau daftar dokumen awal (sertifikat tanah, izin bangunan, daftar aset tetap, atau laporan keuangan) dan mengirimkan surat penawaran tertulis yang mencantumkan lingkup pekerjaan, jadwal kerja, biaya jasa penilaian, serta rincian biaya perjalanan inspeksi lapangan secara transparan.</li>
            <li><strong>Perikatan Kerja &amp; Mobilisasi Inspeksi Lapangan:</strong> Setelah surat perikatan ditandatangani, tim penilai diberangkatkan dari Kantor Pusat Palembang (atau kantor cabang terdekat sesuai kebutuhan koordinasi) untuk melaksanakan pemeriksaan fisik lapangan bersama perwakilan pemberi tugas di lokasi objek.</li>
            <li><strong>Analisis Pasar Regional, Kendali Mutu &amp; Pelaporan:</strong> Hasil survei lapangan dianalisis dengan pendekatan penilaian yang sesuai menurut SPI, ditinjau melalui mekanisme pengendalian mutu internal di Kantor Pusat, dan diterbitkan sebagai laporan penilaian resmi yang siap digunakan oleh pemberi tugas, perbankan, maupun auditor.</li>
          </ul>

          <h2>Hubungi KJPP HJA'R untuk Penugasan di Wilayah Sumatera</h2>
          <p>
            Jika perusahaan, instansi, atau bank Anda membutuhkan layanan penilai publik independen untuk objek yang tersebar di Pulau Sumatera, silakan hubungi tim kami untuk berdiskusi mengenai ruang lingkup pekerjaan dan jadwal inspeksi. Anda juga dapat meninjau halaman <NuxtLink to="/faq">Tanya Jawab (FAQ)</NuxtLink> untuk panduan dokumen dan prosedur.
          </p>
        </article>

        <!-- Contact CTA Box -->
        <div class="mt-12 rounded-2xl border border-primary/30 bg-stone-50 p-6 sm:p-8 dark:border-white/10 dark:bg-gray-dark">
          <h2 class="text-xl font-extrabold text-black dark:text-white sm:text-2xl">
            Koordinasi Penugasan Wilayah Sumatera &amp; Nasional
          </h2>
          <p class="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            <strong>Kantor Pusat Palembang:</strong> {{ headOffice.fullAddress }}<br />
            <strong>Telepon:</strong> <a :href="`tel:${headOffice.phoneE164}`" class="font-bold text-primary hover:underline">{{ headOffice.phone }}</a> ·
            <strong>WhatsApp:</strong> <a :href="`https://wa.me/${headOffice.whatsappDigits}`" target="_blank" rel="noopener noreferrer" class="font-bold text-emerald-700 hover:underline dark:text-emerald-400">{{ headOffice.whatsapp }}</a> ·
            <strong>Email:</strong> <a :href="`mailto:${headOffice.email}`" class="font-bold text-primary hover:underline">{{ headOffice.email }}</a><br />
            <strong>Jaringan Cabang Pendukung:</strong> {{ otherBranches.map(b => b.city).join(', ') }}
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink to="/contact-us" class="btn !rounded-xl">
              Konsultasi &amp; Minta Penawaran
            </NuxtLink>
            <NuxtLink to="/layanan" class="inline-flex items-center gap-2 rounded-xl border border-gray/25 bg-white px-5 py-3.5 text-sm font-extrabold uppercase text-black transition hover:border-primary hover:text-primary dark:border-white/15 dark:bg-black dark:text-white">
              Telusuri Layanan Kami
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
