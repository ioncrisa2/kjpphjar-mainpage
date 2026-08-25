# 🚀 Roadmap & Rencana Teknis Fitur Lanjutan — KJPP HJA'R CMS

> **Dokumen Perencanaan dan Pelacakan (*Tracking*) Fitur Lanjutan**
> Dibuat untuk melacak implementasi 3 modul besar:
> 1. **Modul 1: App Settings (Pengaturan Global, Footer, Maintenance Mode & Backup)**
> 2. **Modul 2: Advanced Blog & Article Management (SEO, Kategori, Featured, Views, Editor)**
> 3. **Modul 3: Web Analytics & Visitor Tracking (Statistik Pengunjung Internal)**

---

## 📌 Ringkasan & Arsitektur Modul

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         KJPP HJA'R ADVANCED MODULES                      │
├──────────────────────────┬───────────────────────┬───────────────────────┤
│    1. APP SETTINGS       │   2. ADVANCED BLOG    │     3. ANALYTICS      │
├──────────────────────────┼───────────────────────┼───────────────────────┤
│ • Info Footer & Kontak   │ • Kategori & Tags     │ • Total Views Tracker │
│ • Link Sosmed & Maps     │ • SEO & Social Preview│ • Top Visited Pages   │
│ • Maintenance Mode       │ • Featured Articles   │ • Device & Browser    │
│ • Backup DB (One-Click)  │ • Reading Time & Views│ • Traffic Referrers   │
│ • Restore DB Data        │ • Image Uploader RTF  │ • Non-blocking Engine │
└──────────────────────────┴───────────────────────┴───────────────────────┘
```

---

## 🛠️ MODUL 1: App Settings (Pengaturan Aplikasi)

### 1.1 Deskripsi & Tujuan
Membuat menu pusat konfigurasi website agar admin dapat mengubah informasi global (alamat, footer, sosmed, maps) tanpa menyentuh kode, mengaktifkan mode maintenance saat perbaikan sistem, serta mengunduh cadangan data (*backup*) berkala.

### 1.2 Skema Database (`server/models/Setting.ts`)
```typescript
{
  siteName: { type: String, default: "KJPP Henricus Judi Adrianto & Rekan" },
  footerAddress: {
    headOffice: { type: String, default: "" },
    googleMapsEmbedUrl: { type: String, default: "" },
    googleMapsUrl: { type: String, default: "" }
  },
  socialMedia: {
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    facebook: { type: String, default: "" },
    youtube: { type: String, default: "" }
  },
  generalContacts: {
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" }
  },
  copyrightText: { type: String, default: "" },
  maintenanceMode: {
    isActive: { type: Boolean, default: false },
    message: { type: String, default: "Website sedang dalam pemeliharaan rutin. Silakan kembali beberapa saat lagi." },
    expectedEndTime: { type: Date }
  }
}
```

### 1.3 Endpoint API
*   `GET /api/settings` — Mengambil data pengaturan (publik).
*   `PUT /api/settings` — Memperbarui pengaturan (khusus admin, terproteksi auth).
*   `GET /api/settings/backup` — Menghasilkan file `.json` atau `.zip` berisi seluruh koleksi database dan metadata.
*   `POST /api/settings/restore` — Mengunggah file `.json` untuk memulihkan data database.

### 1.4 Komponen & Halaman Frontend
*   `pages/admin/settings.vue` — Tampilan form pengaturan terbagi menjadi 3 tab:
    1. **Umum & Footer:** Alamat, Google Maps, Sosial Media, Copyright.
    2. **Mode Maintenance:** Switch On/Off, pesan pemberitahuan, estimasi waktu selesai.
    3. **Backup & Restore:** Tombol "Download Backup Database" dan dropzone "Restore Data".
*   `components/layout/AppFooter.vue` — Menyesuaikan agar membaca data dinamis dari `/api/settings`.
*   `server/middleware/maintenance.ts` / `middleware/maintenance.global.ts` — Mengalihkan rute publik ke `/maintenance` jika aktif (kecuali rute `/admin`, `/api/auth`, dan user berstatus login).

### 1.5 Checklist Pengerjaan Modul 1
- [x] Buat model `server/models/Setting.ts`
- [x] Buat handler API `server/api/settings/index.get.ts` & `index.put.ts`
- [x] Buat handler API `server/api/settings/backup.get.ts` (Download JSON / Zip)
- [x] Buat handler API `server/api/settings/restore.post.ts` (Import JSON)
- [x] Buat halaman admin `pages/admin/settings.vue`
- [x] Tambahkan menu "Pengaturan" di sidebar `layouts/admin.vue`
- [x] Buat halaman publik `pages/maintenance.vue`
- [x] Buat middleware `server/middleware/maintenance.ts` untuk pengalihan saat maintenance aktif
- [x] Integrasikan `components/layout/AppFooter.vue` dengan data dinamis dari setting

---

## 📝 MODUL 2: Advanced Blog & Article Management

### 2.1 Deskripsi & Tujuan
Meningkatkan fungsionalitas artikel untuk mendukung performa SEO Google, pengelompokan topik (Kategori & Tags), kalkulasi waktu baca, *social share preview*, dan fitur artikel unggulan (*featured post*).

### 2.2 Perubahan Skema Database
*   **Model Kategori Baru (`server/models/Category.ts`):**
    ```typescript
    {
      name: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      description: { type: String },
      isActive: { type: Boolean, default: true }
    }
    ```
*   **Update Model Blog (`server/models/BlogPost.ts`):**
    *   Tambah `categoryId: { type: Schema.Types.ObjectId, ref: 'Category' }`
    *   Tambah `isFeatured: { type: Boolean, default: false }`
    *   Tambah `views: { type: Number, default: 0 }`
    *   Tambah `readingTime: { type: Number, default: 1 }` (dalam menit)
    *   Tambah `metaTitle: { type: String }`
    *   Tambah `metaDescription: { type: String }`
    *   Tambah `status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' }`

### 2.3 Endpoint API
*   `GET /api/categories` — Daftar kategori aktif untuk halaman publik.
*   `GET /api/admin/categories` & `POST /api/admin/categories` — Daftar dan tambah kategori dari admin.
*   `PUT /api/admin/categories/[id]` & `DELETE /api/admin/categories/[id]` — Edit & hapus kategori dari admin.
*   `POST /api/admin/blog/upload-image` — Endpoint upload gambar langsung dari editor konten admin.
*   `PATCH /api/blog/[slug]/view` — Increment view counter artikel saat dibaca.

### 2.4 Fitur UI Admin & Publik
*   **Admin (`pages/admin/blog/`):**
    *   Tab/Dropdown pemilihan Kategori.
    *   Input Tags interaktif (tag-input).
    *   Kotak SEO: Meta Title, Meta Description, serta *Live Preview Google Search snippet*.
    *   Checklist "Jadikan Artikel Utama (*Featured Post*)".
    *   Indikator status: Draft vs Published vs Terjadwal.
*   **Publik (`pages/blog/` & `pages/blog/[slug].vue`):**
    *   Filter artikel berdasarkan Kategori & Tag.
    *   Hero section untuk *Featured Post* di beranda atau halaman utama blog.
    *   Tampilan estimasi waktu membaca (misal: "⏱️ 3 min read") dan tanggal rilis.
    *   Komponen *Related Articles* (Artikel Terkait) di bagian bawah konten.
    *   Tombol Share cepat ke WhatsApp, LinkedIn, Twitter/X, & Facebook.

### 2.5 Checklist Pengerjaan Modul 2
- [x] Buat model `server/models/Category.ts` dan update `server/models/BlogPost.ts`
- [x] Buat API publik kategori di `server/api/categories/index.get.ts` dan CRUD admin di `server/api/admin/categories/`
- [x] Buat API upload gambar editor di `server/api/admin/blog/upload-image.post.ts`
- [x] Buat API increment view `server/api/blog/[slug]/view.patch.ts`
- [x] Update form admin `pages/admin/blog/create.vue` & `[id].vue`:
  - [x] Integrasi pilihan kategori & tag chips
  - [x] Form Meta SEO & Card Preview Google
  - [x] Toggle Featured Post & Status Publikasi
  - [x] Auto-calculate reading time
- [x] Update tabel `pages/admin/blog/index.vue` (kolom kategori, featured badge, views counter)
- [x] Update halaman publik `pages/blog/index.vue` (filter kategori, search bar, banner featured post)
- [x] Update halaman publik `pages/blog/[slug].vue` (waktu baca, view counter, social share, related posts)

---

## 📊 MODUL 3: Web Analytics & Visitor Tracking

### 3.1 Deskripsi & Tujuan
Menyediakan ringkasan statistik kunjungan website secara *real-time* langsung di dalam panel admin tanpa memerlukan instalasi skrip pihak ketiga yang berat atau melanggar privasi.

### 3.2 Skema Database (`server/models/AnalyticsLog.ts`)
```typescript
{
  path: { type: String, required: true },       // misal: "/layanan/studi-kelayakan"
  referrer: { type: String, default: "Direct" },// misal: "google.com", "instagram.com"
  device: { type: String, default: "desktop" }, // "mobile", "desktop", "tablet"
  browser: { type: String, default: "other" },  // "Chrome", "Safari", "Edge", dll
  ipHash: { type: String },                     // Disimpan dalam bentuk Hash untuk anonimitas & unique visitor
  visitedAt: { type: Date, default: Date.now }
}
```

### 3.3 Server Tracker Middleware (`server/middleware/analytics.ts`)
*   Mendeteksi setiap request halaman publik (mengabaikan request static assets `/assets/*`, `/uploads/*`, dan rute `/admin/*`).
*   Mengambil User-Agent (deteksi perangkat & browser) dan Referrer URL.
*   Menyimpan log secara *asynchronous* / *non-blocking* agar performa loading website tetap 100% cepat.

### 3.4 Endpoint API
*   `GET /api/analytics/overview` — Ringkasan total views, unique visitors hari ini, 7 hari terakhir, 30 hari terakhir.
*   `GET /api/analytics/top-pages` — Daftar 10 halaman paling sering dikunjungi.
*   `GET /api/analytics/devices` — Persentase Device (Mobile vs Desktop) & Browser.
*   `GET /api/analytics/sources` — Sumber trafik (Direct, Google Search, Social Media).

### 3.5 Tampilan UI Admin (`pages/admin/analytics.vue`)
*   **Kartu Statistik Utama:**
    *   Total Page Views (Hari Ini, 7 Hari, 30 Hari).
    *   Total Pengunjung Unik (*Unique Visitors*).
*   **Grafik Tren Kunjungan:** Visualisasi grafik garis/batang harian.
*   **Tabel Top Pages:** Halaman paling populer lengkap dengan persentase dan jumlah klik.
*   **Breakdown Perangkat & Sumber Referrer:** Grafik donat / bar progress.

### 3.6 Checklist Pengerjaan Modul 3
- [x] Buat model `server/models/AnalyticsLog.ts`
- [x] Buat middleware `server/middleware/analytics.ts` (Non-blocking tracker)
- [x] Buat handler API ringkasan di `server/api/analytics/` (overview, top-pages, devices, sources)
- [x] Buat halaman admin `pages/admin/analytics.vue` dengan kartu KPI & visualisasi chart
- [x] Tambahkan menu "Analitik" di sidebar navigasi `layouts/admin.vue`
- [x] Buat opsi *clean up / purge logs* otomatis (opsional untuk menjaga ukuran database)

---

## 🗓️ Rekomendasi Urutan Eksekusi (Phase Plan)

| Tahap | Modul | Estimasi Target |
|---|---|---|
| **Fase 1** | **App Settings** | Pengaturan footer, sosial media, mode maintenance, & backup JSON/Zip |
| **Fase 2** | **Advanced Blog** | Kategori, SEO Meta Preview, Featured Article, Waktu Baca, Upload Gambar Editor |
| **Fase 3** | **Web Analytics** | Middleware logging non-blocking, API aggregasi statistik, & Dashboard Visual |

---

## Catatan Implementasi & Operasional

- Backup menggunakan Extended JSON dan registry koleksi eksplisit dengan batas 4 MB atau 100.000 dokumen. Koleksi `users`, log analytics mentah, bucket rate limit, dan binary upload sengaja tidak disertakan. Manifest hanya mencatat file pada `UPLOADS_DIR`.
- Restore selalu diawali preview, menolak koleksi asing dan konflik key unik, serta hanya melakukan merge/upsert. Commit restore membutuhkan MongoDB replica set atau cluster yang mendukung transaction; pada MongoDB standalone, preview tetap tersedia tetapi commit ditolak agar tidak menghasilkan restore parsial.
- Maintenance mode mengembalikan HTTP 503 untuk API publik dan mengalihkan navigasi HTML ke `/maintenance`. Rute autentikasi, pembacaan setting publik, aset, dan sesi admin yang valid tetap dapat digunakan.
- Blog mempertahankan kompatibilitas data lama `isPublished`, sedangkan penulisan baru memakai status `draft`, `published`, atau `scheduled`. Artikel terjadwal baru tampil setelah waktunya tiba.
- Analytics memakai tracker hybrid SSR dan navigasi SPA, menghormati DNT/GPC, tidak menyimpan IP atau User-Agent mentah, menggunakan rate limit MongoDB lintas instance, dan menghapus log mentah otomatis setelah 90 hari. Unique visitor merupakan perkiraan berbasis HMAC IP. Deployment Hostinger wajib mengaktifkan `TRUST_PROXY=true` agar alamat klien dibaca dari reverse proxy tepercaya.
- Upload gambar dibatasi 4 MB, divalidasi berdasarkan byte aktual, dan diubah ulang menjadi WebP. Production mewajibkan `UPLOADS_DIR` absolut pada direktori persisten di luar folder build `nodejs`, misalnya `/home/USERNAME/domains/DOMAIN/uploads`. Folder tersebut perlu dibackup terpisah karena backup JSON hanya membawa manifest, bukan binary.
- Production mewajibkan `JWT_SECRET` minimal 32 karakter. Bootstrap admin database kosong hanya berjalan bila `ADMIN_USERNAME` dan `ADMIN_PASSWORD` (minimal 12 karakter) tersedia di environment.
- Data demo hanya dibuat bila `SEED_DEMO_DATA=true`; nilai default production adalah `false`.
- Target deployment adalah Hostinger Node.js Web App dengan Node.js 22/24, build `npm run build`, start `npm run start`, dan port `3000`. Rincian environment dan verifikasi ada di `docs/deployment-hostinger.md`.

> Status implementasi diperbarui dan diverifikasi pada 25 Agustus 2026.
