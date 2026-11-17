export interface ServiceContentData {
  slug: string
  title: string
  titleEn: string
  description: string
  icon: string
  order: number
  content: string
}

export const SERVICE_CONTENT_CATALOG: Record<string, ServiceContentData> = {
  'penilaian-properti': {
    slug: 'penilaian-properti',
    title: 'Penilaian Properti',
    titleEn: 'Property Valuation',
    description:
      'Layanan penilaian aset properti di Palembang, Sumatera Selatan, dan seluruh Indonesia meliputi tanah, bangunan, mesin, peralatan industri, alat berat, kapal, dan aset tetap sesuai Standar Penilaian Indonesia (SPI).',
    icon: 'fas fa-building',
    order: 1,
    content: `
<p><strong>Penilaian Properti</strong> merupakan layanan utama KJPP Henricus Judi Adrianto &amp; Rekan (KJPP HJA'R) yang bertujuan memberikan opini tertulis secara independen, objektif, dan profesional mengenai nilai ekonomi suatu aset berwujud pada tanggal penilaian tertentu. Seluruh pelaksanaan penilaian properti dikerjakan oleh Penilai Publik berizin Kementerian Keuangan RI dan anggota Masyarakat Profesi Penilai Indonesia (MAPPI) dengan berpedoman penuh pada Kode Etik Penilai Indonesia (KEPI) serta Standar Penilaian Indonesia (SPI).</p>

<h2>Ruang Lingkup Objek Penilaian Properti</h2>
<p>Sesuai ketentuan Peraturan Menteri Keuangan mengenai Penilai Publik, bidang jasa penilaian properti yang kami tangani mencakup spektrum aset berwujud yang luas, baik properti sederhana maupun properti komersial dan industri berskala besar:</p>
<ul>
  <li><strong>Tanah dan Bangunan Residensial:</strong> Rumah tinggal, kavling tanah matang, perumahan tapak, rumah susun, dan apartemen.</li>
  <li><strong>Properti Komersial dan Perkantoran:</strong> Rumah toko (ruko), rumah kantor (rukan), gedung perkantoran, pusat perbelanjaan, hotel, rumah sakit, gudang logistik, dan bangunan komersial lainnya.</li>
  <li><strong>Properti Industri dan Perkebunan:</strong> Pabrik pengolahan, instalasi utilitas pabrik, lahan perkebunan kelapa sawit atau karet beserta infrastruktur pendukung dan pabrik pengolahannya, serta fasilitas pertambangan.</li>
  <li><strong>Mesin, Peralatan, dan Aset Bergerak:</strong> Mesin produksi pabrik, generator, instalasi mekanikal-elektrikal, kendaraan operasional, armada alat berat (ekskavator, buldoser, <em>dump truck</em>, <em>crane</em>), hingga kapal tunda (<em>tug boat</em>), tongkang, dan fasilitas galangan kapal.</li>
</ul>

<h2>Tujuan Penggunaan Laporan Penilaian Properti</h2>
<p>Setiap tujuan penilaian menentukan dasar nilai yang digunakan—misalnya Nilai Pasar, Nilai Likuidasi, Nilai Wajar, atau Nilai Asuransi. Laporan penilaian properti kami digunakan oleh perbankan, korporasi, instansi pemerintah daerah, maupun perorangan untuk berbagai keperluan:</p>
<ul>
  <li><strong>Penjaminan Utang (Agunan Kredit):</strong> Penilaian agunan untuk pengajuan kredit modal kerja, kredit investasi, KPR, maupun penilaian ulang (<em>re-appraisal</em>) agunan pada bank umum, bank syariah, dan BPD.</li>
  <li><strong>Transaksi Jual Beli, Sewa, dan Lelang:</strong> Menentukan acuan harga yang wajar sebelum membeli, menjual, menyewakan aset, atau menetapkan nilai limit lelang.</li>
  <li><strong>Pelaporan Keuangan dan Akuntansi:</strong> Revaluasi aset tetap perusahaan sesuai PSAK atau penyusunan neraca Barang Milik Daerah (BMD) pada pemerintah kabupaten/kota.</li>
  <li><strong>Aksi Korporasi dan Inbreng:</strong> Pemasukan aset tanah, bangunan, atau perkebunan sebagai penyertaan modal saham (<em>inbreng</em>), penentuan nilai pertanggungan asuransi, pembagian warisan/harta bersama, serta pengadaan tanah.</li>
</ul>

<h2>Konteks Layanan di Palembang dan Sumatera Selatan</h2>
<p>Berkantor pusat di <a href="/kjpp-palembang">Kota Palembang</a> sejak 2013, tim KJPP HJA'R memiliki pemahaman mendalam terhadap dinamika pasar properti lokal di koridor perkotaan Palembang maupun kawasan ekonomi di 17 kabupaten/kota <a href="/kjpp-sumatera-selatan">Sumatera Selatan</a> dan <a href="/kjpp-sumatera">Pulau Sumatera</a>. Di wilayah perkotaan Palembang, penugasan banyak berkaitan dengan rumah tinggal, ruko komersial, gudang, serta kapal tunda dan galangan kapal di alur Sungai Musi. Sementara di kabupaten-kabupaten Sumatera Selatan seperti Banyuasin, Musi Banyuasin, Muara Enim, Lahat, Ogan Komering Ilir, dan OKU, tim kami berpengalaman melakukan survei lapangan atas lahan perkebunan, pabrik pengolahan, serta armada alat berat pertambangan dan konstruksi.</p>

<h2>Alur dan Proses Pelaksanaan Penilaian Properti</h2>
<p>Untuk menjamin akurasi data dan ketepatan waktu, proses penilaian properti di KJPP HJA'R berjalan melalui enam tahapan:</p>
<ol>
  <li><strong>Identifikasi Kebutuhan:</strong> Pemberi tugas menyampaikan tujuan penilaian, jenis dan jumlah objek, lokasi aset, serta pengguna laporan (misalnya nama bank tujuan).</li>
  <li><strong>Penawaran Tertulis:</strong> Kami mengirimkan surat penawaran resmi yang memuat lingkup kerja, estimasi waktu, dan rincian biaya jasa secara transparan (biaya tidak dikaitkan dengan persentase hasil nilai).</li>
  <li><strong>Surat Perikatan &amp; Penyerahan Dokumen:</strong> Penandatanganan surat perikatan kerja diikuti penyerahan salinan dokumen kepemilikan dan teknis oleh pemberi tugas.</li>
  <li><strong>Inspeksi Lapangan:</strong> Penilai mengunjungi lokasi objek untuk mengukur dimensi, memeriksa kondisi fisik bangunan/mesin, memotret aset, dan mengamati aksesibilitas serta lingkungan sekitar dengan didampingi pemilik atau wakilnya.</li>
  <li><strong>Analisis &amp; Perhitungan Nilai:</strong> Penilai mengolah data menggunakan pendekatan penilaian yang sesuai menurut SPI (Pendekatan Pasar, Pendekatan Biaya, atau Pendekatan Pendapatan).</li>
  <li><strong>Review Mutu &amp; Penerbitan Laporan:</strong> Draf laporan melalui proses <em>quality control</em> internal sebelum ditandatangani Penilai Publik dan diserahkan secara resmi.</li>
</ol>

<h2>Dokumen yang Perlu Disiapkan</h2>
<p>Kelengkapan dokumen sejak awal sangat membantu mempercepat penyelesaian laporan. Dokumen yang perlu disiapkan meliputi:</p>
<ul>
  <li><strong>Untuk Tanah dan Bangunan:</strong> Salinan sertifikat tanah (SHM, SHGB, HGU, atau SHMSRS), SPPT PBB tahun terakhir, Izin Mendirikan Bangunan (IMB) atau Persetujuan Bangunan Gedung (PBG), gambar denah bangunan (bila ada), serta data kontrak sewa untuk properti komersial yang disewakan.</li>
  <li><strong>Untuk Mesin, Alat Berat, dan Kapal:</strong> Daftar aset (<em>asset list</em>) beserta merek, tipe, nomor seri, kapasitas, tahun pembuatan/perolehan, faktur pembelian atau invoice, serta surat tanda kepemilikan/registrasi (BPKB, buku kepemilikan alat, atau surat ukur dan grosse akta kapal).</li>
</ul>

<h2>Estimasi Waktu Pengerjaan</h2>
<p>Lama penyelesaian bergantung pada jenis, jumlah, dan sebaran lokasi objek serta kelengkapan dokumen. Untuk <strong>satu unit rumah tinggal</strong> dengan dokumen lengkap, laporan penilaian umumnya selesai dalam <strong>1–6 hari kerja</strong> setelah inspeksi lapangan dilaksanakan. Untuk properti komersial kompleks, perkebunan, mesin industri, atau portofolio aset di beberapa lokasi, estimasi waktu pasti akan dicantumkan secara jelas di dalam surat penawaran. Apabila Anda memiliki pertanyaan lebih lanjut, silakan kunjungi halaman <a href="/faq">Tanya Jawab (FAQ)</a> atau langsung menghubungi tim kami melalui halaman <a href="/contact-us">Contact Us</a>.</p>
`.trim(),
  },
  'penilaian-bisnis': {
    slug: 'penilaian-bisnis',
    title: 'Penilaian Bisnis',
    titleEn: 'Business Valuation',
    description:
      'Layanan penilaian bisnis, penyertaan saham, surat berharga, dan aset tak berwujud di Palembang, Sumatera Selatan, dan Sumatera untuk merger, akuisisi, restrukturisasi, dan pelaporan keuangan.',
    icon: 'fas fa-chart-line',
    order: 2,
    content: `
<p><strong>Penilaian Bisnis</strong> (<em>Business Valuation</em>) adalah proses analisis ekonomi dan finansial yang dilakukan secara independen oleh Penilai Publik untuk memberikan opini nilai atas suatu entitas usaha, kepentingan kepemilikan (penyertaan saham), surat berharga, maupun aktiva tak berwujud (<em>intangible assets</em>). Di KJPP Henricus Judi Adrianto &amp; Rekan (KJPP HJA'R), layanan penilaian bisnis dikerjakan dengan berpedoman pada Standar Penilaian Indonesia (SPI) dan Kode Etik Penilai Indonesia (KEPI) guna menghasilkan kesimpulan nilai yang objektif dan dapat dipertanggungjawabkan di hadapan pemegang saham, investor, perbankan, auditor, maupun regulator.</p>

<h2>Ruang Lingkup Objek Penilaian Bisnis</h2>
<p>Layanan penilaian bisnis kami dirancang untuk membantu korporasi swasta, BUMN, BUMD, maupun perusahaan keluarga dalam memahami nilai wajar bisnis mereka pada berbagai tingkatan kepemilikan:</p>
<ul>
  <li><strong>Penilaian Entitas Bisnis &amp; Ekuitas:</strong> Penilaian atas nilai keseluruhan perusahaan (<em>enterprise value</em>) maupun nilai total ekuitas pemegang saham, baik untuk kepemilikan mayoritas (pengendali) maupun kepemilikan minoritas (non-pengendali).</li>
  <li><strong>Penilaian Penyertaan Saham &amp; Surat Berharga:</strong> Penilaian saham perusahaan tertutup (non-publik) maupun instrumen ekuitas dan surat berharga lainnya dalam rangka transaksi korporasi.</li>
  <li><strong>Penilaian Aset Tak Berwujud (Intangible Assets):</strong> Penilaian atas hak kekayaan intelektual, merek dagang, lisensi, kontrak kerja sama jangka panjang, waralaba, atau <em>goodwill</em> dalam rangka alokasi harga perolehan (<em>Purchase Price Allocation</em>) maupun pelaporan keuangan.</li>
  <li><strong>Kajian Pendapat Kewajaran &amp; Restrukturisasi:</strong> Analisis nilai ekonomi dalam rangka restrukturisasi utang, konversi utang menjadi saham (<em>debt-to-equity swap</em>), atau pemisahan unit usaha (<em>spin-off</em>).</li>
</ul>

<h2>Tujuan Penggunaan Penilaian Bisnis</h2>
<p>Perusahaan dan pemilik usaha membutuhkan opini nilai bisnis independen ketika hendak mengambil keputusan strategis yang berdampak jangka panjang, antara lain:</p>
<ul>
  <li><strong>Merger, Akuisisi, dan Divestasi:</strong> Menentukan kisaran nilai wajar saham atau bisnis sebelum penggabungan usaha, pengambilalihan perusahaan, atau pelepasan saham kepada mitra strategis.</li>
  <li><strong>Masuknya Investor Baru &amp; Inbreng:</strong> Menentukan proporsi kepemilikan saham yang adil ketika perusahaan menerima suntikan modal baru atau penyertaan modal dalam bentuk aset (<em>inbreng</em>).</li>
  <li><strong>Pelaporan Keuangan &amp; Kepatuhan Akuntansi:</strong> Pengujian penurunan nilai (<em>impairment test</em>), alokasi harga beli pasca-akuisisi, serta pelaporan nilai wajar investasi sesuai Pernyataan Standar Akuntansi Keuangan (PSAK).</li>
  <li><strong>Penyelesaian Hubungan Pemegang Saham:</strong> Penentuan nilai beli kembali saham (<em>buyback</em>) atau pembagian kepemilikan usaha secara objektif.</li>
</ul>

<h2>Konteks Kebutuhan Valuasi Bisnis di Palembang dan Sumatera Selatan</h2>
<p>Pertumbuhan korporasi daerah di <a href="/kjpp-palembang">Palembang</a>, <a href="/kjpp-sumatera-selatan">Sumatera Selatan</a>, dan <a href="/kjpp-sumatera">Pulau Sumatera</a>—mulai dari perusahaan perkebunan kelapa sawit dan karet, jasa angkutan sungai dan pelayaran, pertambangan dan energi, perdagangan besar, rumah sakit swasta, hingga Badan Usaha Milik Daerah (BUMD)—mendorong meningkatnya kebutuhan akan valuasi bisnis yang kredibel. Kehadiran Kantor Pusat KJPP HJA'R di Palembang memudahkan jajaran direksi dan manajemen keuangan perusahaan di Sumatera Selatan untuk berdiskusi secara langsung mengenai model bisnis, asumsi proyeksi keuangan, dan kondisi industri regional tanpa harus terhambat jarak.</p>

<h2>Alur dan Proses Pelaksanaan Penilaian Bisnis</h2>
<p>Penilaian bisnis memerlukan pendalaman terhadap aspek operasional dan proyeksi keuangan perusahaan melalui enam tahapan kerja:</p>
<ol>
  <li><strong>Diskusi Ruang Lingkup &amp; Tujuan Valuasi:</strong> Menetapkan objek kepemilikan yang dinilai (persentase saham atau entitas), tanggal penilaian (<em>cut-off date</em>), tujuan penilaian, serta dasar nilai yang relevan.</li>
  <li><strong>Penyampaian Penawaran &amp; Perikatan:</strong> Pengiriman surat penawaran resmi dilanjutkan dengan penandatanganan surat perikatan kerja dan kesepakatan kerahasiaan data (NDA/pakta integritas).</li>
  <li><strong>Pengumpulan Dokumen &amp; Wawancara Manajemen:</strong> Tim penilai mengumpulkan data keuangan historis, dokumen legal perseroan, serta melakukan diskusi dengan manajemen mengenai kinerja operasional dan rencana bisnis ke depan.</li>
  <li><strong>Tinjauan Lapangan &amp; Analisis Industri:</strong> Peninjauan fasilitas operasional utama perusahaan serta analisis kondisi makroekonomi, prospek industri terkait, dan profil risiko usaha.</li>
  <li><strong>Pemodelan Valuasi:</strong> Perhitungan nilai menggunakan pendekatan yang diakui SPI, meliputi Pendekatan Pendapatan (<em>Discounted Cash Flow</em> / DCF), Pendekatan Pasar (pembanding perusahaan sejenis/transaksi sebanding), dan/atau Pendekatan Aset (<em>Adjusted Net Asset Method</em>).</li>
  <li><strong>Review Mutu &amp; Penerbitan Laporan:</strong> Pembahasan asumsi teknis, pemeriksaan pengendalian mutu internal, dan penyerahan laporan penilaian bisnis resmi.</li>
</ol>

<h2>Dokumen yang Perlu Disiapkan</h2>
<p>Untuk memulai proses penilaian bisnis, dokumen utama yang umumnya perlu disiapkan oleh perusahaan meliputi:</p>
<ul>
  <li><strong>Dokumen Legal Perusahaan:</strong> Akta pendirian beserta seluruh perubahannya, SK pengesahan Kemenkumham, Nomor Induk Berusaha (NIB), izin operasional usaha, dan daftar susunan pemegang saham terkini.</li>
  <li><strong>Data Keuangan Historis:</strong> Laporan keuangan yang telah diaudit (atau laporan keuangan internal manajemen) selama 3 hingga 5 tahun terakhir beserta rincian akun aset tetap, piutang, dan liabilitas.</li>
  <li><strong>Proyeksi &amp; Rencana Bisnis:</strong> Rencana kerja dan anggaran perusahaan (RKAP) atau proyeksi laporan laba rugi, arus kas, rencana belanja modal (<em>capex</em>), serta kapasitas produksi/penjualan untuk 5 tahun ke depan.</li>
</ul>

<h2>Estimasi Waktu Pengerjaan</h2>
<p>Karena penilaian bisnis melibatkan analisis laporan keuangan historis, pemodelan arus kas masa depan, dan terkadang dikombinasikan dengan <a href="/layanan/penilaian-properti">penilaian aset tetap perusahaan</a>, waktu pengerjaannya lebih panjang dibandingkan penilaian properti tunggal—umumnya berkisar antara <strong>2 hingga 4 minggu kerja</strong> setelah data keuangan dan dokumen operasional diterima secara lengkap. Jadwal kerja terperinci selalu kami cantumkan dalam surat penawaran. Untuk informasi umum lainnya, silakan baca halaman <a href="/faq">Tanya Jawab (FAQ)</a> atau hubungi tim kami melalui halaman <a href="/contact-us">Contact Us</a>.</p>
`.trim(),
  },
  'studi-kelayakan': {
    slug: 'studi-kelayakan',
    title: 'Studi Kelayakan',
    titleEn: 'Feasibility Study',
    description:
      'Jasa konsultasi penyusunan studi kelayakan proyek investasi (Feasibility Study) di Palembang, Sumatera Selatan, dan Sumatera mencakup aspek pasar, teknis, manajemen, hukum, lingkungan, dan keuangan.',
    icon: 'fas fa-project-diagram',
    order: 3,
    content: `
<p><strong>Studi Kelayakan</strong> (<em>Feasibility Study</em>) adalah layanan jasa konsultasi independen dari KJPP Henricus Judi Adrianto &amp; Rekan (KJPP HJA'R) yang menyajikan kajian menyeluruh mengenai layak atau tidaknya suatu rencana proyek investasi dijalankan. Sebelum investor, perusahaan, maupun pemerintah daerah menanamkan modal dalam jumlah signifikan—atau sebelum bank menyetujui fasilitas kredit investasi—diperlukan analisis objektif yang menguji apakah proyek tersebut memiliki permintaan pasar yang nyata, dapat dibangun dan dioperasikan secara teknis, patuh terhadap regulasi, serta mampu menghasilkan imbal hasil finansial dan kemampuan bayar kembali (<em>repayment capacity</em>) yang memadai.</p>

<h2>Aspek Kajian dalam Studi Kelayakan</h2>
<p>Setiap laporan studi kelayakan yang disusun oleh tim konsultan dan penilai KJPP HJA'R membedah rencana proyek secara terintegrasi melalui enam aspek utama:</p>
<ul>
  <li><strong>Aspek Pasar dan Pemasaran:</strong> Analisis struktur pasar, pasokan dan permintaan (<em>supply and demand</em>), profil konsumen sasaran, tingkat persaingan di wilayah sekitar proyek, proyeksi serapan pasar, serta strategi penetapan harga atau tarif.</li>
  <li><strong>Aspek Teknis dan Teknologis:</strong> Evaluasi kelayakan lokasi lahan, aksesibilitas transportasi dan logistik, ketersediaan bahan baku serta utilitas (listrik, air, telekomunikasi), tata letak fasilitas, pemilihan kapasitas mesin/teknologi, jadwal pembangunan fisik, serta kewajaran Rencana Anggaran Biaya (RAB).</li>
  <li><strong>Aspek Manajemen dan Organisasi:</strong> Kajian struktur organisasi pengelola proyek, kebutuhan tenaga kerja, kompetensi manajemen pelaksana, dan tata kelola operasional saat proyek beroperasi komersial.</li>
  <li><strong>Aspek Hukum dan Perizinan:</strong> Tinjauan atas legalitas badan usaha, status penguasaan lahan, kesesuaian dengan Rencana Tata Ruang Wilayah (RTRW), serta kelengkapan izin usaha dan persetujuan bangunan.</li>
  <li><strong>Aspek Sosial dan Lingkungan:</strong> Identifikasi dampak proyek terhadap masyarakat sekitar dan pemenuhan dokumen pengelolaan lingkungan hidup (AMDAL, UKL-UPL, atau SPPL).</li>
  <li><strong>Aspek Keuangan dan Ekonomi:</strong> Penyusunan proyeksi laporan laba rugi, neraca, dan arus kas sepanjang umur proyek, struktur pendanaan (porsi modal sendiri dan kredit bank), serta pengujian indikator kelayakan investasi seperti <em>Net Present Value</em> (NPV), <em>Internal Rate of Return</em> (IRR), <em>Payback Period</em>, <em>Benefit-Cost Ratio</em>, dan analisis sensitivitas terhadap perubahan pendapatan atau biaya.</li>
</ul>

<h2>Konteks Proyek Investasi di Palembang dan Sumatera Selatan</h2>
<p>Di <a href="/kjpp-palembang">Kota Palembang</a>, <a href="/kjpp-sumatera-selatan">Sumatera Selatan</a>, dan <a href="/kjpp-sumatera">Pulau Sumatera</a>, studi kelayakan independen sangat dibutuhkan untuk mendukung pengajuan pembiayaan perbankan (kredit investasi dan sindikasi), kerja sama pemanfaatan aset daerah/BUMD, maupun ekspansi korporasi swasta. Jenis proyek yang lazim dikaji meliputi pengembangan kawasan perumahan dan ruko komersial, pembangunan pabrik pengolahan kelapa sawit dan karet, fasilitas pergudangan dan pelabuhan sungai, rumah sakit dan klinik kesehatan, hotel, hingga proyek infrastruktur dan pengadaan fasilitas publik daerah.</p>

<h2>Alur dan Proses Penyusunan Studi Kelayakan</h2>
<p>Proses penyusunan studi kelayakan di KJPP HJA'R dilaksanakan melalui enam tahapan terstruktur:</p>
<ol>
  <li><strong>Diskusi Konsep Proyek &amp; Kebutuhan Pengguna:</strong> Memahami jenis proyek, kapasitas rencana, nilai investasi awal, struktur pembiayaan yang direncanakan, serta persyaratan spesifik dari bank atau investor tujuan.</li>
  <li><strong>Penyampaian Penawaran &amp; Perikatan Kerja:</strong> Pengiriman surat penawaran resmi yang memuat ruang lingkup kajian, jadwal penyelesaian, dan biaya konsultasi, dilanjutkan dengan penandatanganan surat perikatan.</li>
  <li><strong>Pengumpulan Data &amp; Survei Lokasi Proyek:</strong> Tim kami melakukan peninjauan langsung ke lokasi rencana proyek untuk mengamati kondisi tapak, infrastruktur pendukung, kompetitor sejenis, serta mengumpulkan data pasar sekunder dan primer.</li>
  <li><strong>Evaluasi Teknis &amp; Pemodelan Finansial:</strong> Analisis kelayakan teknis dan penyusunan model proyeksi keuangan multi-tahun beserta skenario optimis, moderat, dan pesimis.</li>
  <li><strong>Pemaparan Draf &amp; Diskusi Klarifikasi:</strong> Pembahasan draf kajian bersama pemberi tugas untuk memverifikasi kelengkapan data teknis dan asumsi operasional.</li>
  <li><strong>Review Mutu &amp; Penerbitan Laporan Final:</strong> Penyempurnaan laporan melalui pengendalian mutu internal dan penyerahan buku laporan Studi Kelayakan resmi.</li>
</ol>

<h2>Dokumen yang Perlu Disiapkan</h2>
<p>Agar penyusunan kajian berjalan efektif, dokumen dan informasi awal yang perlu disiapkan oleh pemilik proyek antara lain:</p>
<ul>
  <li><strong>Profil Perusahaan &amp; Legalitas:</strong> Akta pendirian dan perubahan perusahaan, NIB, perizinan usaha, serta profil manajemen/pemrakarsa proyek.</li>
  <li><strong>Data Lahan &amp; Rencana Teknis:</strong> Salinan bukti penguasaan/kepemilikan lahan, lokasi koordinat tapak, gambar rencana (<em>masterplan</em>/<em>siteplan</em>), spesifikasi mesin atau peralatan utama, serta Rencana Anggaran Biaya (RAB) pembangunan.</li>
  <li><strong>Data Operasional &amp; Asumsi Usaha:</strong> Rencana kapasitas produksi atau layanan, struktur harga jual/tarif rencana, estimasi biaya operasional rutin, serta rencana skema pendanaan (target plafon kredit dan tenor pinjaman bila diajukan ke bank).</li>
</ul>

<h2>Estimasi Waktu Pengerjaan</h2>
<p>Waktu penyelesaian laporan studi kelayakan bergantung pada skala investasi, kompleksitas teknis proyek, serta kelengkapan data RAB dan rencana usaha dari klien. Secara umum, penyusunan studi kelayakan memerlukan waktu sekitar <strong>2 hingga 4 minggu kerja</strong> sejak survei lapangan dilaksanakan dan dokumen teknis diterima lengkap. Setelah proyek berjalan, layanan ini juga dapat dilanjutkan dengan <a href="/layanan/pengawasan-proyek">Pengawasan Proyek (Project Monitoring)</a>. Untuk informasi lebih lanjut mengenai prosedur kerja kami, silakan kunjungi halaman <a href="/faq">Tanya Jawab (FAQ)</a> atau hubungi kami melalui halaman <a href="/contact-us">Contact Us</a>.</p>
`.trim(),
  },
  'pengawasan-proyek': {
    slug: 'pengawasan-proyek',
    title: 'Pengawasan Proyek',
    titleEn: 'Project Monitoring',
    description:
      'Layanan pengawasan dan pemantauan proyek pembangunan (Project Monitoring) independen di Palembang, Sumatera Selatan, dan Sumatera untuk memastikan kesesuaian progres fisik, jadwal, dan anggaran biaya.',
    icon: 'fas fa-hard-hat',
    order: 4,
    content: `
<p><strong>Pengawasan Proyek</strong> (<em>Project Monitoring</em>) adalah layanan pemantauan independen yang diberikan oleh KJPP Henricus Judi Adrianto &amp; Rekan (KJPP HJA'R) untuk memeriksa, memverifikasi, dan melaporkan kesesuaian antara kemajuan fisik pelaksanaan proyek konstruksi di lapangan dengan jadwal waktu penyelesaian serta Rencana Anggaran Biaya (RAB) yang telah ditetapkan. Layanan ini memberikan kepastian objektif bagi pihak perbankan pemberi kredit investasi/konstruksi, pemilik proyek (<em>project owner</em>), maupun investor bahwa dana pembangunan digunakan secara tepat sasaran sesuai tahapan prestasi kerja.</p>

<h2>Mengapa Pemantauan Proyek Independen Dibutuhkan?</h2>
<p>Dalam proyek pembangunan gedung, pabrik, perumahan, maupun infrastruktur yang dibiayai melalui fasilitas kredit perbankan, pencairan dana pinjaman umumnya dilakukan secara bertahap (per termin) mengikuti persentase penyelesaian fisik di lapangan. Pihak kreditur dan pemilik proyek memerlukan pihak ketiga yang independen untuk memverifikasi klaim progres dari kontraktor pelaksana. Melalui layanan pengawasan proyek KJPP HJA'R, pengguna laporan memperoleh manfaat utama berikut:</p>
<ul>
  <li><strong>Verifikasi Progres Fisik yang Objektif:</strong> Memastikan bobot persentase pekerjaan yang terpasang di lapangan benar-benar sesuai dengan spesifikasi teknis dan volume dalam kontrak.</li>
  <li><strong>Pengendalian Pencairan Termin Kredit:</strong> Menjadi dasar pertimbangan independen bagi bank sebelum mencairkan termin pinjaman konstruksi tahap berikutnya.</li>
  <li><strong>Deteksi Dini Deviasi Jadwal &amp; Biaya:</strong> Mengidentifikasi potensi keterlambatan jadwal (deviasi terhadap kurva S) atau pembengkakan biaya (<em>cost overrun</em>) sejak dini agar langkah mitigasi dapat segera diambil.</li>
  <li><strong>Dokumentasi Visual dan Teknis Berkala:</strong> Menyediakan rekam jejak kemajuan proyek yang terdokumentasi secara sistematis dari tahap persiapan lahan, struktur, arsitektur, mekanikal-elektrikal, hingga penyelesaian akhir.</li>
</ul>

<h2>Konteks Layanan Pengawasan Proyek di Palembang dan Sumatera Selatan</h2>
<p>Berkantor pusat di <a href="/kjpp-palembang">Palembang</a>, tim teknis KJPP HJA'R dapat melakukan kunjungan inspeksi berkala secara cepat ke lokasi proyek konstruksi di Kota Palembang maupun di seluruh kabupaten/kota <a href="/kjpp-sumatera-selatan">Sumatera Selatan</a> dan <a href="/kjpp-sumatera">Pulau Sumatera</a>. Penugasan pemantauan proyek yang relevan di wilayah ini meliputi pembangunan gedung komersial dan perkantoran, pengembangan kawasan perumahan, pembangunan gudang dan fasilitas logistik, konstruksi pabrik pengolahan kelapa sawit atau karet, instalasi mesin industri, hingga pembangunan fasilitas kesehatan dan infrastruktur daerah.</p>

<h2>Alur dan Proses Pelaksanaan Pengawasan Proyek</h2>
<p>Pelaksanaan <em>Project Monitoring</em> di KJPP HJA'R mengikuti tahapan kerja yang sistematis pada setiap periode pemantauan:</p>
<ol>
  <li><strong>Penetapan Lingkup &amp; Jadwal Pemantauan:</strong> Menentukan frekuensi pemantauan (kunjungan tunggal pada titik termin tertentu atau pemantauan berkala bulanan/per termin) sesuai kebutuhan bank atau pemilik proyek.</li>
  <li><strong>Penawaran &amp; Surat Perikatan:</strong> Penyampaian surat penawaran tertulis beserta rincian biaya per kunjungan/laporan, dilanjutkan dengan penandatanganan surat perikatan kerja.</li>
  <li><strong>Telaah Dokumen Kontrak &amp; Baseline Proyek:</strong> Tim teknis mempelajari dokumen kontrak konstruksi, RAB, gambar kerja (DED), spesifikasi teknis, serta jadwal induk pelaksanaan (<em>Master Schedule</em> / Kurva S).</li>
  <li><strong>Inspeksi Fisik di Lokasi Proyek:</strong> Pemeriksaan langsung ke tapak proyek untuk menghitung volume pekerjaan terpasang, memeriksa material utama di lokasi (<em>material on site</em>), dan mendokumentasikan progres setiap item pekerjaan bersama pengawas lapangan/kontraktor.</li>
  <li><strong>Analisis Perbandingan Progres &amp; Biaya:</strong> Membandingkan realisasi bobot fisik di lapangan dengan rencana pada Kurva S, laporan klaim kontraktor, serta realisasi serapan anggaran biaya.</li>
  <li><strong>Penerbitan Laporan Pemantauan Proyek:</strong> Penyusunan dan penyerahan laporan resmi yang memuat ringkasan eksekutif persentase progres fisik, analisis deviasi, dokumentasi foto berpenanda waktu, serta catatan teknis bagi pemberi tugas.</li>
</ol>

<h2>Dokumen yang Perlu Disiapkan</h2>
<p>Untuk mendukung verifikasi lapangan yang akurat, dokumen proyek yang perlu disiapkan oleh pemberi tugas meliputi:</p>
<ul>
  <li><strong>Dokumen Perencanaan &amp; Perizinan:</strong> Salinan sertifikat lahan, Persetujuan Bangunan Gedung (PBG) atau IMB, serta gambar rencana/gambar kerja konstruksi (<em>Detailed Engineering Design</em> / DED).</li>
  <li><strong>Dokumen Kontrak &amp; Anggaran:</strong> Kontrak kerja konstruksi (SPK) dengan kontraktor pelaksana, Rencana Anggaran Biaya (RAB) terperinci beserta bobot masing-masing pekerjaan, dan jadwal pelaksanaan proyek (Kurva S).</li>
  <li><strong>Dokumen Kemajuan Berkala:</strong> Laporan progres mingguan/bulanan dari kontraktor atau konsultan pengawas internal, berita acara opname pekerjaan (bila mengajukan pencairan termin), serta laporan hasil pemantauan tahap sebelumnya.</li>
</ul>

<h2>Estimasi Waktu Pengerjaan</h2>
<p>Untuk setiap kali kunjungan inspeksi lapangan (per termin atau per periode laporan), penyusunan laporan pengawasan proyek umumnya diselesaikan dalam waktu <strong>3 hingga 7 hari kerja</strong> setelah kunjungan lapangan dilakukan dan dokumen opname/klaim progres diterima lengkap. Apabila proyek berada pada tahap perencanaan awal sebelum konstruksi dimulai, Anda juga dapat memanfaatkan layanan <a href="/layanan/studi-kelayakan">Studi Kelayakan Proyek</a> atau <a href="/layanan/penilaian-properti">Penilaian Properti</a> untuk aset agunan pendukung. Silakan kunjungi halaman <a href="/faq">Tanya Jawab (FAQ)</a> untuk informasi umum atau hubungi kami melalui halaman <a href="/contact-us">Contact Us</a> guna mendiskusikan jadwal pemantauan proyek Anda.</p>
`.trim(),
  },
}
