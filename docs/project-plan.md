# 📋 Project Plan — KJPP HJA'R Website CMS

> **Dokumen ini adalah panduan teknis pengembangan lengkap.**
> Dibuat berdasarkan brainstorming & diskusi arsitektur proyek.
> Selalu update dokumen ini bila ada keputusan atau perubahan baru.

---

## 📌 Ringkasan Proyek

| | |
|---|---|
| **Nama Proyek** | KJPP Henricus Judi Adrianto dan Rekan — Website + CMS |
| **Status Saat Ini** | Full-stack CMS (Nuxt 3 + MongoDB) |
| **Target** | Full-stack CMS (Nuxt 3 + MongoDB) |
| **Developer** | 1 orang (pemilik proyek) |
| **Deployment Target** | Hostinger Node.js Hosting |
| **Database** | MongoDB Atlas (production) + MongoDB Local (development) |

---

## 🎯 Tujuan Migrasi

Baseline sebelum migrasi adalah SPA statis dengan **semua data hardcoded** langsung di dalam file `.vue`.
Implementasi saat ini sudah memindahkan konten operasional ke CMS dan database.

Migrasi ini bertujuan untuk:

1. **Dinamis** — semua konten bisa dikelola tanpa sentuh kode
2. **SEO-friendly** — Nuxt SSR membuat konten bisa diindex Google dengan benar
3. **Skalabel** — mudah menambah halaman, konten, atau fitur baru
4. **Operasional** — form kontak berfungsi dan mengirim notifikasi email

---

## 🏛️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                    NUXT 3 (Full-stack)                       │
│                  Hostinger Node.js Hosting                   │
│                                                              │
│  ┌─────────────────────┐    ┌──────────────────────────┐    │
│  │   Public Pages      │    │   Admin Panel            │    │
│  │   (SSR — SEO OK)    │    │   (Client-only — CSR)    │    │
│  │                     │    │                          │    │
│  │ / → Beranda         │    │ /admin → Dashboard       │    │
│  │ /about-us           │    │ /admin/gallery           │    │
│  │ /gallery            │    │ /admin/branches          │    │
│  │ /rekan-klien        │    │ /admin/leaders           │    │
│  │ /contact-us         │    │ /admin/clients           │    │
│  │ /layanan/:slug      │    │ /admin/services          │    │
│  │ /blog               │    │ /admin/blog              │    │
│  │ /blog/:slug         │    │ /admin/contacts          │    │
│  │ /karir              │    │ /admin/careers           │    │
│  └─────────────────────┘    └──────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  server/api/                          │   │
│  │  REST endpoints yang dikonsumsi oleh pages           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             File Storage (Local Disk)                 │   │
│  │    ${UPLOADS_DIR}/gallery/ → foto galeri             │   │
│  │    ${UPLOADS_DIR}/leaders/ → foto pimpinan           │   │
│  │    ${UPLOADS_DIR}/clients/ → logo klien              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ Mongoose connection string
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB                                    │
│   Development: mongodb://localhost:27017/kjpphjar_dev        │
│   Production:  mongodb+srv://...atlas.mongodb.net/kjpphjar   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Tech Stack

### Core
| Teknologi | Peran | Versi Target |
|---|---|---|
| **Nuxt 3** | Full-stack framework (Vue 3 based) | latest |
| **TypeScript** | Type safety | latest |
| **TailwindCSS** | Styling | v3 |
| **MongoDB** | Database | — |
| **Mongoose** | ODM (schema + validation) | latest |

### Server / Backend
| Teknologi | Peran |
|---|---|
| **Nuxt Server Routes** | REST API endpoints (`/server/api/`) |
| **H3** | HTTP framework bawaan Nitro (Nuxt engine) |
| **Multer** | File upload middleware |
| **Sharp** | Auto-resize & thumbnail generation |
| **Nodemailer** | Kirim email notifikasi form kontak |
| **jsonwebtoken** | JWT untuk admin authentication |
| **bcryptjs** | Hash password admin |

### Frontend
| Teknologi | Peran |
|---|---|
| **Pinia** | State management |
| **Vue Router** | Routing (bawaan Nuxt) |
| **VueUse** | Composable utilities |
| **AOS** | Scroll animations |
| **Swiper** | Slider/carousel |
| **Leaflet** | Peta interaktif |
| **Vue Easy Lightbox** | Lightbox galeri foto |

---

## 📁 Struktur Folder Nuxt 3

```
kjpphjar-mainpage/
├── assets/
│   └── css/
│       └── main.css
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue
│   │   └── AppFooter.vue
│   ├── ui/                         ← Komponen UI reusable
│   │   ├── AppButton.vue
│   │   ├── AppModal.vue
│   │   └── AppToast.vue
│   └── admin/                      ← Komponen khusus admin
│       ├── AdminSidebar.vue
│       ├── AdminHeader.vue
│       └── FileUpload.vue
├── composables/
│   ├── useAuth.ts                  ← Admin auth logic
│   ├── useToast.ts                 ← Notifikasi toast
│   └── useFileUpload.ts            ← Upload helper
├── layouts/
│   ├── default.vue                 ← Layout halaman publik
│   ├── admin.vue                   ← Layout admin panel
│   └── error.vue
├── middleware/
│   └── auth.ts                     ← Guard halaman /admin/*
├── pages/
│   ├── index.vue                   ← Beranda (SSR)
│   ├── about-us.vue                ← Tentang Kami (SSR)
│   ├── gallery.vue                 ← Galeri (SSR)
│   ├── rekan-klien.vue             ← Rekan & Klien (SSR)
│   ├── contact-us.vue              ← Kontak (SSR)
│   ├── layanan/
│   │   ├── index.vue               ← Daftar Layanan (SSR)
│   │   └── [slug].vue              ← Detail Layanan (SSR)
│   ├── blog/
│   │   ├── index.vue               ← Daftar Blog (SSR)
│   │   └── [slug].vue              ← Detail Artikel (SSR)
│   ├── karir/
│   │   └── index.vue               ← Lowongan Kerja (SSR)
│   └── admin/
│       ├── index.vue               ← Dashboard
│       ├── gallery.vue             ← Kelola Galeri
│       ├── branches.vue            ← Kelola Cabang
│       ├── leaders.vue             ← Kelola Pimpinan
│       ├── clients.vue             ← Kelola Klien
│       ├── services.vue            ← Kelola Layanan
│       ├── blog.vue                ← Kelola Artikel
│       ├── careers.vue             ← Kelola Lowongan
│       └── contacts.vue            ← Inbox Form Kontak
├── public/
│   └── uploads/                    ← File yang diupload (gitignored)
│       ├── gallery/
│       │   ├── original/
│       │   └── thumbnails/
│       ├── leaders/
│       ├── clients/
│       └── blog/
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.post.ts
│   │   │   └── logout.post.ts
│   │   ├── gallery/
│   │   │   ├── index.get.ts        ← GET semua foto
│   │   │   ├── index.post.ts       ← POST upload foto baru
│   │   │   └── [id].delete.ts      ← DELETE foto
│   │   ├── branches/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── leaders/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── clients/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── services/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [slug].get.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── blog/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [slug].get.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── careers/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   └── contacts/
│   │       ├── index.get.ts        ← GET semua submission (admin)
│   │       ├── submit.post.ts      ← POST dari form publik
│   │       └── [id].patch.ts       ← Mark as read
│   ├── middleware/
│   │   └── admin-auth.ts           ← Validasi JWT setiap /api/admin/*
│   ├── models/                     ← Mongoose models
│   │   ├── Gallery.ts
│   │   ├── Branch.ts
│   │   ├── Leader.ts
│   │   ├── Client.ts
│   │   ├── Service.ts
│   │   ├── BlogPost.ts
│   │   ├── Career.ts
│   │   └── ContactSubmission.ts
│   └── utils/
│       ├── db.ts                   ← Koneksi MongoDB (singleton)
│       ├── auth.ts                 ← JWT helpers
│       └── mailer.ts               ← Nodemailer setup
├── docs/                           ← Dokumentasi proyek (folder ini)
│   └── project-plan.md
├── .env                            ← Tidak di-commit ke git
├── .env.example                    ← Template env (di-commit)
├── nuxt.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🗄️ Database Schema (MongoDB + Mongoose)

Prinsip kontrak data:
- **REQUIRED** = wajib ada, error jika kosong
- **OPTIONAL** = boleh kosong, tapi nama field tetap terdefinisi dalam schema
- Tidak ada field di luar schema yang didefinisikan (**strict mode on**)

---

### Collection: `galleries`

```typescript
{
  // REQUIRED
  filename:     string,   // nama file asli setelah sanitasi
  imageUrl:     string,   // path ke file original: /uploads/gallery/original/xxx.jpg
  thumbnailUrl: string,   // path ke thumbnail: /uploads/gallery/thumbnails/xxx.jpg
  uploadedAt:   Date,     // auto: Date.now

  // OPTIONAL
  title:        string?,  // judul/keterangan foto
  category:     string?,  // bebas diisi admin, contoh: "Kegiatan", "Penilaian"
  isFeatured:   boolean,  // default: false — untuk tampil di beranda
  order:        number,   // default: 0 — untuk sorting manual
}
```

> **Catatan:** `category` bertipe `string` bebas (bukan enum), karena kategori ditentukan sendiri
> oleh admin dan bisa berubah sewaktu-waktu. Validasi konsistensi kategori dilakukan di level UI admin.

---

### Collection: `branches`

```typescript
{
  // REQUIRED
  name:       string,   // "Kantor Pusat" / "Cabang Surabaya"
  city:       string,   // "Palembang, Sumatera Selatan"
  phone:      string,
  email:      string,
  address:    string,   // alamat lengkap
  latitude:   number,
  longitude:  number,

  // OPTIONAL
  mapsUrl:    string?,  // link Google Maps
  isActive:   boolean,  // default: true — bisa nonaktifkan tanpa hapus
  order:      number,   // default: 0 — urutan tampil
}
```

---

### Collection: `leaders`

```typescript
{
  // REQUIRED
  name:       string,
  position:   string,   // "Pimpinan Rekan", "Pimpinan Cabang Surabaya"
  photoUrl:   string,   // path ke foto: /uploads/leaders/xxx.jpg
  order:      number,   // urutan tampil

  // OPTIONAL
  bio:        string?,  // biografi singkat (untuk halaman about-us)
  isActive:   boolean,  // default: true
}
```

---

### Collection: `clients`

```typescript
{
  // REQUIRED
  name:       string,
  logoUrl:    string,   // path ke logo: /uploads/clients/xxx.png

  // OPTIONAL
  category:   string?,  // "bank" | "pemerintah" | "swasta" — bebas isi
  order:      number,   // default: 0
  isActive:   boolean,  // default: true
}
```

---

### Collection: `services`

```typescript
{
  // REQUIRED
  title:      string,   // "Konsultasi Pengembangan Properti"
  titleEn:    string,   // "Property Development Consulting"
  slug:       string,   // "konsultasi-pengembangan-properti" — auto-generate dari title
  description: string,  // deskripsi singkat (untuk kartu di beranda)
  icon:       string,   // nama icon atau SVG string

  // OPTIONAL
  content:    string?,  // konten panjang halaman detail (HTML/Markdown)
  isActive:   boolean,  // default: true
  order:      number,   // default: 0
}
```

---

### Collection: `blog_posts`

```typescript
{
  // REQUIRED
  title:        string,
  slug:         string,   // auto-generate, unique
  content:      string,   // konten artikel (format Markdown/HTML)
  publishedAt:  Date,

  // OPTIONAL
  excerpt:      string?,  // ringkasan — jika kosong, auto-ambil 160 char pertama dari content
  coverImageUrl: string?, // gambar cover artikel
  tags:         string[], // default: []
  isPublished:  boolean,  // default: false — draft dulu sebelum dipublish
  author:       string?,  // default: nama dari env config
}
```

---

### Collection: `careers`

```typescript
{
  // REQUIRED
  title:       string,    // "Staff Penilai Properti"
  location:    string,    // "Palembang" / "Remote"
  type:        string,    // "Full-time" | "Part-time" | "Internship"
  description: string,    // deskripsi pekerjaan

  // OPTIONAL
  requirements: string[], // default: []
  closingDate:  Date?,    // tanggal tutup lowongan
  isActive:     boolean,  // default: true
  postedAt:     Date,     // auto: Date.now
}
```

---

### Collection: `contact_submissions`

```typescript
{
  // REQUIRED
  fullname:    string,
  email:       string,
  message:     string,
  submittedAt: Date,      // auto: Date.now

  // OPTIONAL
  phone:       string?,
  city:        string?,
  isRead:      boolean,   // default: false — untuk marking di admin inbox
  branch:      string?,   // cabang yang dituju (jika ada dropdown pilihan cabang)
}
```

---

## 🔐 Sistem Authentication Admin

**Filosofi:** Simple dan aman, tidak over-engineered.
Hanya 1 user (developer), credential disimpan di `.env`.

### Flow Login
```
1. Admin buka /admin
2. Middleware cek JWT cookie → jika tidak ada, redirect ke /admin/login
3. Di halaman login, input username + password
4. Server validasi dengan nilai dari .env
5. Jika valid → generate JWT → set httpOnly cookie (expires: 7 hari)
6. Redirect ke /admin/dashboard
```

### Environment Variables untuk Auth
```env
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=password_bootstrap_minimal_12_karakter
JWT_SECRET=random_string_panjang_minimal_32_karakter
JWT_EXPIRES_IN=7d
```

### Proteksi API Routes
Semua endpoint `/api/admin/*` (write operations) akan dicek JWT-nya via server middleware.
Endpoint publik seperti `GET /api/gallery` tidak perlu auth.

---

## 📧 Sistem Email (Form Kontak)

Menggunakan **Nodemailer** dengan SMTP Hostinger (sudah include di paket hosting).

### Flow Submit Form
```
1. Pengunjung isi form di halaman /contact-us
2. Frontend kirim POST ke /api/contacts/submit
3. Server:
   a. Validasi input (semua field required dicek)
   b. Simpan ke collection contact_submissions
   c. Kirim email notifikasi ke email kantor via SMTP Hostinger
   d. Return response sukses ke frontend
4. Frontend tampilkan toast notifikasi berhasil
```

### Environment Variables Email
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@domain-anda.com
SMTP_PASS=password_email
MAIL_TO=email-penerima@domain-anda.com  # email kantor yang menerima notifikasi
```

---

## 🖼️ Sistem Upload & Pemrosesan Foto

### Tools
- **Multer** — handle multipart/form-data upload
- **Sharp** — resize + generate thumbnail otomatis

### Alur Upload Foto Galeri
```
1. Admin pilih foto di admin panel
2. Frontend kirim POST multipart/form-data ke /api/gallery
3. Server (Multer):
   a. Validasi tipe file (hanya jpg, jpeg, png, webp)
   b. Validasi ukuran maksimal (contoh: max 10MB)
   c. Generate nama file unik: {timestamp}-{uuid}.{ext}
4. Server (Sharp):
   a. Simpan original ke: `${UPLOADS_DIR}/gallery/original/`
   b. Resize ke 800px width → simpan ke: `${UPLOADS_DIR}/gallery/thumbnails/`
   c. Convert ke WebP untuk efisiensi (opsional)
5. Simpan metadata ke collection galleries
6. Return URL foto ke frontend
```

### Spesifikasi Thumbnail
| | Original | Thumbnail |
|---|---|---|
| **Max Width** | 1920px | 600px |
| **Format** | Pertahankan (jpg/png) | WebP |
| **Quality** | 85% | 80% |
| **Lokasi** | `/uploads/gallery/original/` | `/uploads/gallery/thumbnails/` |

---

## 🌐 Halaman Publik (SSR)

Semua halaman publik menggunakan **SSR** agar konten bisa diindex Google.
Data di-fetch di `server-side` menggunakan `useFetch` atau `useAsyncData`.

| Route | Halaman | Data yang di-fetch |
|---|---|---|
| `/` | Beranda | services (highlight), gallery (featured), leaders |
| `/about-us` | Tentang Kami | leaders, company profile (visi/misi dari DB) |
| `/gallery` | Galeri | galleries (dengan pagination + filter kategori) |
| `/rekan-klien` | Rekan & Klien | clients |
| `/contact-us` | Kontak | branches |
| `/layanan` | Daftar Layanan | services (semua) |
| `/layanan/:slug` | Detail Layanan | service by slug |
| `/blog` | Blog | blog_posts (published, pagination) |
| `/blog/:slug` | Detail Artikel | blog_post by slug |
| `/karir` | Lowongan | careers (active) |

---

## 🛠️ Admin Panel (Custom, Client-only)

Admin panel di-render **client-side only** (tidak perlu SEO).

### Halaman Admin

| Route | Fungsi |
|---|---|
| `/admin` | Dashboard — statistik ringkas (jumlah foto, submission baru, dll) |
| `/admin/gallery` | Upload foto, lihat grid, hapus, atur kategori & urutan |
| `/admin/branches` | CRUD data cabang + preview peta |
| `/admin/leaders` | CRUD data pimpinan + upload foto |
| `/admin/clients` | CRUD logo klien + kategori |
| `/admin/services` | CRUD layanan + rich text editor untuk halaman detail |
| `/admin/blog` | CRUD artikel + rich text editor + publish/draft toggle |
| `/admin/careers` | CRUD lowongan kerja + set tanggal tutup |
| `/admin/contacts` | Inbox form kontak — lihat pesan, mark as read |

### UI Admin
- Layout: sidebar kiri + konten kanan
- Styling: TailwindCSS, fungsional, tidak perlu mewah
- Tidak ada library UI component eksternal (supaya bundle ringan)
- Tabel untuk list data, modal/drawer untuk form edit

---

## 🚀 Deployment ke Hostinger

### Environment Variables di Hostinger
Semua variabel berikut perlu diset di panel Hostinger:

```env
# App
NODE_ENV=production
NUXT_PUBLIC_BASE_URL=https://domain-anda.com
HOST=0.0.0.0
PORT=3000
UPLOADS_DIR=/home/USERNAME/domains/DOMAIN/uploads
TRUST_PROXY=true

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.atlas.mongodb.net/kjpphjar

# Auth Admin
ADMIN_USERNAME=xxx
ADMIN_PASSWORD=minimum-12-karakter
JWT_SECRET=xxx
JWT_EXPIRES_IN=7d
ANALYTICS_HASH_SECRET=xxx
SEED_DEMO_DATA=false

# Email (SMTP Hostinger)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@domain-anda.com
SMTP_PASS=xxx
MAIL_TO=email-penerima@domain-anda.com
```

### Build & Start Command
```bash
# Build
npm run build

# Start (untuk Hostinger Node.js)
npm run start
```

Gunakan Node.js 22 atau 24. `UPLOADS_DIR` harus dibuat sebagai direktori persisten
di luar folder build `/home/{username}/domains/{domain}/nodejs`.

---

## 🔄 Environment Development

### `.env` (development — tidak di-commit)
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/kjpphjar_dev
ADMIN_USERNAME=admin
ADMIN_PASSWORD=minimum-12-karakter   # hanya untuk bootstrap akun pertama
JWT_SECRET=dev-secret-minimum-32-characters-long
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=...
SMTP_PASS=...
MAIL_TO=...
```

### `.env.example` (di-commit sebagai template)
Sama seperti di atas tapi semua value dikosongkan atau diisi placeholder.

---

## 📦 Migrasi dari Vue 3 → Nuxt 3

Karena Nuxt 3 berbasis Vue 3, komponen bisa dipindah dengan perubahan minimal.

### Yang Bisa Langsung Dipindah
- Semua komponen `.vue` — struktur `<script setup>` sama
- TailwindCSS config
- Pinia stores (dengan sedikit penyesuaian untuk SSR)
- Gambar & aset dari `public/`

### Yang Perlu Ditulis Ulang
- `vue-router` config → diganti sistem file-based routing Nuxt
- `src/api/axios.ts` → diganti `server/api/` routes
- `src/services/` → logikanya dipindah ke server routes
- `src/main.ts` → diganti `nuxt.config.ts` + `plugins/`
- Data hardcoded di semua view → dipindah ke MongoDB

### Yang Bisa Dihapus
- `vite.config.ts` → digantikan `nuxt.config.ts`
- `env.d.ts` → Nuxt handle otomatis

---

## 📋 Fitur Rekomendasi Tambahan

Selain yang sudah direncanakan, berikut beberapa fitur yang direkomendasikan untuk meningkatkan SEO dan engagement:

### SEO
- **Sitemap otomatis** — Nuxt module `@nuxtjs/sitemap` generate `sitemap.xml` dari semua halaman
- **OG Image otomatis** — Nuxt module `nuxt-og-image` generate gambar preview saat link dibagikan di sosmed
- **Structured Data (JSON-LD)** — tambahkan schema `LocalBusiness` di halaman utama untuk pencarian Google

### Engagement
- **WhatsApp CTA Button** — tombol floating WA di semua halaman publik, terhubung ke nomor kantor
- **Google Analytics / Plausible** — tracking pengunjung tanpa kompleksitas
- **Halaman 404 yang informatif** — sudah ada `error.vue`, perlu diperbaiki

### Operasional
- **Backup otomatis MongoDB Atlas** — Atlas free tier sudah include backup harian
- **Rate limiting form kontak** — cegah spam dengan limit submit per IP (bisa pakai `unstorage` + IP tracking)

---

## 🗓️ Rencana Pengerjaan (Fase)

### Fase 0 — Setup (1 hari)
- [ ] Init project Nuxt 3 baru
- [ ] Setup TailwindCSS, Pinia, TypeScript
- [ ] Konfigurasi Mongoose + koneksi MongoDB
- [ ] Setup `.env` dan `.env.example`
- [ ] Setup folder struktur

### Fase 1 — Backend & Database (2-3 hari)
- [ ] Buat semua Mongoose models (8 collection)
- [ ] Buat server API routes (CRUD semua entitas)
- [ ] Setup sistem auth admin (login, JWT, middleware)
- [ ] Setup file upload (Multer + Sharp)
- [ ] Setup Nodemailer untuk email notifikasi

### Fase 2 — Admin Panel (3-4 hari)
- [ ] Layout admin (sidebar, header)
- [ ] Middleware auth guard untuk `/admin/*`
- [ ] Halaman login admin
- [ ] CRUD Gallery (upload + grid view)
- [ ] CRUD Branches
- [ ] CRUD Leaders
- [ ] CRUD Clients
- [ ] CRUD Services
- [ ] CRUD Blog Posts (dengan rich text editor)
- [ ] CRUD Careers
- [ ] Inbox Contact Submissions

### Fase 3 — Halaman Publik (3-4 hari)
- [ ] Migrasi layout default (header, footer)
- [ ] Halaman Beranda — fetch dari API
- [ ] Halaman About Us — fetch dari API
- [ ] Halaman Gallery — dengan filter kategori + lightbox
- [ ] Halaman Rekan & Klien — fetch dari API
- [ ] Halaman Contact Us — form + peta + data cabang dari API
- [ ] Halaman Layanan (index + detail)
- [ ] Halaman Blog (index + detail)
- [ ] Halaman Karir

### Fase 4 — SEO & Polish (1-2 hari)
- [ ] Setup `useHead()` / meta tags per halaman
- [ ] Sitemap otomatis (`@nuxtjs/sitemap`)
- [ ] Structured Data (JSON-LD LocalBusiness)
- [ ] OG meta tags
- [ ] WhatsApp CTA button
- [ ] Halaman 404 yang informatif
- [ ] Rate limiting form kontak

### Fase 5 — Deployment & Testing (1-2 hari)
- [ ] Setup environment variables di Hostinger
- [ ] Connect MongoDB Atlas via Hostinger panel
- [ ] Build & deploy
- [ ] End-to-end testing semua fitur
- [ ] Testing form kontak (kirim email)
- [ ] Testing upload foto
- [ ] Testing admin panel di production

---

## ❓ Hal yang Masih Perlu Dikonfirmasi

- [ ] **Domain** — apakah sudah punya domain yang akan dipakai? (untuk konfigurasi SMTP dan CORS)
- [ ] **Kategori galeri** — perlu disiapkan daftar awal kategorinya (bisa ditentukan sambil jalan)
- [ ] **Rich text editor** — untuk konten layanan dan blog, pakai editor apa? Opsi: **Tiptap** (Vue-native, open source) atau **Quill**
- [ ] **Nama author default** di blog — apakah pakai nama atau atas nama perusahaan?
- [ ] **Apakah halaman karir perlu form lamaran** di website, atau cukup tampilkan info dan arahkan ke email/WA?

---

## 📌 Dokumen Terkait
- [Checklist Implementasi Utama](./implementation-checklist.md)
- [Roadmap & Rencana Fitur Lanjutan (App Settings, Advanced Blog, Analytics)](./fitur-lanjutan-plan.md)

---

*Dokumen ini akan diupdate seiring progress pengerjaan.*
*Last updated: 2026-08-25*
