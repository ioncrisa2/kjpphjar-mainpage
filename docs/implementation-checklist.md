# ✅ Implementation Checklist — KJPP HJA'R CMS

> **Dokumen ini adalah panduan step-by-step pengerjaan proyek.**
> Centang setiap item setelah selesai dikerjakan.
> Jangan skip langkah, terutama pada Fase 0-1.
>
> **Referensi utama:** [`project-plan.md`](./project-plan.md)

---

## FASE 0 — Setup & Inisialisasi

### 0.1 — Init Project Nuxt 3

- [x] Buat folder project baru (misal: `kjpphjar-cms`) di luar folder Vue lama
- [x] Jalankan `npx nuxi@latest init kjpphjar-cms`
- [x] Pilih package manager: `npm`
- [x] Masuk ke folder project: `cd kjpphjar-cms`
- [x] Verifikasi struktur folder Nuxt default terbuat dengan benar
- [x] Jalankan `npm run dev` dan pastikan halaman default Nuxt muncul di browser

### 0.2 — Setup Dependencies

- [x] Install TailwindCSS: `npm install -D tailwindcss @tailwindcss/typography postcss autoprefixer`
- [x] Init TailwindCSS config: `npx tailwindcss init`
- [x] Install Pinia: `npm install pinia @pinia/nuxt`
- [x] Install Mongoose: `npm install mongoose`
- [x] Install Multer: `npm install multer`
- [x] Install `@types/multer`: `npm install -D @types/multer`
- [x] Install Sharp: `npm install sharp`
- [x] Install Nodemailer: `npm install nodemailer`
- [x] Install `@types/nodemailer`: `npm install -D @types/nodemailer`
- [x] Install jsonwebtoken: `npm install jsonwebtoken`
- [x] Install `@types/jsonwebtoken`: `npm install -D @types/jsonwebtoken`
- [x] Install bcryptjs: `npm install bcryptjs`
- [x] Install `@types/bcryptjs`: `npm install -D @types/bcryptjs`
- [x] Install VueUse: `npm install @vueuse/nuxt @vueuse/core`
- [x] Install Leaflet: `npm install leaflet`
- [x] Install `@types/leaflet`: `npm install -D @types/leaflet`
- [x] Install slugify (untuk auto-generate slug): `npm install slugify`
- [x] Install nuxt sitemap module: `npm install @nuxtjs/sitemap`

### 0.3 — Konfigurasi `nuxt.config.ts`

- [x] Tambahkan module: `@pinia/nuxt`, `@nuxtjs/sitemap`, `@vueuse/nuxt`
- [x] Tambahkan konfigurasi TailwindCSS via `postcss`
- [x] Setup `runtimeConfig` untuk environment variables:
  - `mongodbUri`
  - `jwtSecret`
  - `jwtExpiresIn`
  - `smtpHost`, `smtpPort`, `smtpSecure`, `smtpUser`, `smtpPass`
  - `mailTo`
  - `public.baseUrl`
- [x] Set `ssr: true` (default, tapi pastikan eksplisit)
- [x] Sediakan route `/uploads/*` yang membaca media dari direktori persisten `UPLOADS_DIR`

### 0.4 — Setup TailwindCSS

- [x] Update `tailwind.config.ts` — salin config dari proyek Vue lama (warna primary/secondary, font, dll)
- [x] Buat `assets/css/main.css` dengan `@tailwind base/components/utilities`
- [x] Import `main.css` di `nuxt.config.ts`
- [x] Verifikasi Tailwind bekerja dengan tambahkan class Tailwind di halaman test

### 0.5 — Setup Environment Files

- [x] Buat file `.env` di root project (TIDAK di-commit ke git)
- [x] Isi `.env` dengan nilai development:
  ```
  MONGODB_URI=mongodb://localhost:27017/kjpphjar_dev
  JWT_SECRET=            ← string random min 32 karakter
  JWT_EXPIRES_IN=7d
  SMTP_HOST=smtp.hostinger.com
  SMTP_PORT=465
  SMTP_SECURE=true
  SMTP_USER=
  SMTP_PASS=
  MAIL_TO=
  ```
- [x] Buat `.env.example` (template tanpa nilai, ini yang di-commit)
- [x] Pastikan `.env` masuk ke `.gitignore`

### 0.6 — Setup Folder Struktur

- [x] Buat folder `server/models/`
- [x] Buat folder `server/utils/`
- [x] Buat folder `server/middleware/`
- [x] Buat folder `server/api/auth/`
- [x] Buat folder `server/api/gallery/`
- [x] Buat folder `server/api/branches/`
- [x] Buat folder `server/api/leaders/`
- [x] Buat folder `server/api/clients/`
- [x] Buat folder `server/api/services/`
- [x] Buat folder `server/api/blog/`
- [x] Buat folder `server/api/careers/`
- [x] Buat folder `server/api/contacts/`
- [x] Buat folder `components/layout/`
- [x] Buat folder `components/ui/`
- [x] Buat folder `components/admin/`
- [x] Buat folder `composables/`
- [x] Buat folder `middleware/`
- [x] Buat folder `layouts/`
- [x] Gunakan struktur runtime `uploads/gallery`, `uploads/leaders`, `uploads/clients`, dan `uploads/blog`
- [x] Tambahkan `/uploads/` ke `.gitignore` dan gunakan `UPLOADS_DIR` absolut pada production
- [x] Salin semua aset dari proyek Vue lama (`/public/assets/`) ke Nuxt baru

---

## FASE 1 — Backend: Database & API

### 1.1 — Koneksi MongoDB

- [x] Buat `server/utils/db.ts` — singleton koneksi Mongoose
  - Pastikan koneksi hanya dibuat sekali (singleton pattern)
  - Handle event `connected`, `error`, `disconnected`
  - Gunakan `MONGODB_URI` dari `runtimeConfig`
- [x] Test koneksi: jalankan dev server, verifikasi log "MongoDB connected" muncul

### 1.2 — Mongoose Models

Buat setiap model mengikuti schema di `project-plan.md`. Setiap model harus:
- Punya TypeScript interface yang mirror schema-nya
- Gunakan `strict: true` (default Mongoose, jangan diubah)
- Timestamp fields (`createdAt`, `updatedAt`) via `{ timestamps: true }`

- [x] Buat `server/models/Gallery.ts`
  - Field required: `filename`, `imageUrl`, `thumbnailUrl`, `uploadedAt`
  - Field optional: `title`, `category`, `isFeatured` (default: false), `order` (default: 0)
- [x] Buat `server/models/Branch.ts`
  - Field required: `name`, `city`, `phone`, `email`, `address`, `latitude`, `longitude`
  - Field optional: `mapsUrl`, `isActive` (default: true), `order` (default: 0)
- [x] Buat `server/models/Leader.ts`
  - Field required: `name`, `position`, `photoUrl`, `order`
  - Field optional: `bio`, `isActive` (default: true)
- [x] Buat `server/models/Client.ts`
  - Field required: `name`, `logoUrl`
  - Field optional: `category`, `order` (default: 0), `isActive` (default: true)
- [x] Buat `server/models/Service.ts`
  - Field required: `title`, `titleEn`, `slug`, `description`, `icon`
  - Field optional: `content`, `isActive` (default: true), `order` (default: 0)
  - Slug harus `unique: true`
- [x] Buat `server/models/BlogPost.ts`
  - Field required: `title`, `slug`, `content`, `publishedAt`
  - Field optional: `excerpt`, `coverImageUrl`, `tags` (array, default: []), `isPublished` (default: false), `author`
  - Slug harus `unique: true`
- [x] Buat `server/models/Career.ts`
  - Field required: `title`, `location`, `type`, `description`, `postedAt`
  - Field optional: `requirements` (array, default: []), `closingDate`, `isActive` (default: true)
  - `type` enum: `['Full-time', 'Part-time', 'Internship']`
- [x] Buat `server/models/ContactSubmission.ts`
  - Field required: `fullname`, `email`, `message`, `submittedAt`
  - Field optional: `phone`, `city`, `isRead` (default: false), `branch`

### 1.3 — Server Utils

- [x] Buat `server/utils/auth.ts`
  - Fungsi `generateToken(username: string): string` — buat JWT
  - Fungsi `verifyToken(token: string)` — verifikasi JWT, return payload atau throw
- [x] Buat `server/utils/mailer.ts`
  - Setup Nodemailer transporter dengan SMTP Hostinger dari env
  - Fungsi `sendContactNotification(data: ContactData)` — kirim email notifikasi
  - Template email yang informatif (nama, email, pesan, waktu submit)
- [ ] Buat `server/utils/upload.ts`
  - Setup Multer dengan storage `diskStorage`
  - Konfigurasi destination ke `UPLOADS_DIR` sesuai jenis file
  - Validasi file type (jpg, jpeg, png, webp saja)
  - Validasi max size: 10MB
  - Generate nama file unik: `${Date.now()}-${uuidv4()}.${ext}`
- [ ] Buat `server/utils/image.ts`
  - Fungsi `generateThumbnail(inputPath, outputPath)` menggunakan Sharp
  - Resize max width 600px, quality 80%, output WebP
  - Pertahankan original (tidak diubah), hanya buat versi thumbnail baru

### 1.4 — Server Middleware (Auth Guard)

- [x] Buat `server/middleware/admin-auth.ts`
  - Intercept semua request ke `/api/admin/*`
  - Ambil JWT dari cookie `admin_token`
  - Verifikasi dengan `verifyToken()`
  - Jika invalid/expired: return 401 Unauthorized
  - Jika valid: lanjutkan request

### 1.5 — API Routes: Auth

- [x] Buat `server/api/auth/login.post.ts`
  - Terima `{ username, password }` dari body
  - Cek kecocokan di database (tabel User) dengan `bcrypt.compare()`
  - Jika valid: generate JWT, set `httpOnly` cookie `admin_token`, return `{ success: true }`
  - Jika invalid: return 401
- [x] Buat `server/api/auth/logout.post.ts`
  - Clear cookie `admin_token`
  - Return `{ success: true }`
- [x] Buat `server/api/auth/me.get.ts`
  - Cek cookie, verifikasi JWT
  - Return status auth (untuk cek di client apakah sudah login)

### 1.6 — API Routes: Gallery

- [x] Buat `server/api/gallery/index.get.ts` (PUBLIC)
  - Query params: `?category=`, `?featured=true`, `?page=`, `?limit=`
  - Return array foto + pagination info
  - Sort by `order` asc, lalu `uploadedAt` desc
- [x] Buat `server/api/gallery/index.post.ts` (ADMIN)
  - Handle multipart upload via Multer
  - Validasi file
  - Proses dengan Sharp → generate thumbnail
  - Simpan ke MongoDB
  - Return dokumen Gallery yang baru dibuat
- [x] Buat `server/api/gallery/[id].patch.ts` (ADMIN)
  - Update field: `title`, `category`, `isFeatured`, `order`
  - Tidak bisa update `imageUrl` atau `thumbnailUrl` via endpoint ini
- [x] Buat `server/api/gallery/[id].delete.ts` (ADMIN)
  - Hapus file original dari disk
  - Hapus file thumbnail dari disk
  - Hapus dokumen dari MongoDB

### 1.7 — API Routes: Branches

- [x] Buat `server/api/branches/index.get.ts` (PUBLIC)
  - Return semua cabang dimana `isActive: true`
  - Sort by `order` asc
- [x] Buat `server/api/branches/index.post.ts` (ADMIN)
  - Validasi semua required fields
  - Simpan ke MongoDB
- [x] Buat `server/api/branches/[id].put.ts` (ADMIN)
  - Update semua field yang dikirim
- [x] Buat `server/api/branches/[id].delete.ts` (ADMIN)
  - Hard delete dari MongoDB

### 1.8 — API Routes: Leaders

- [x] Buat `server/api/leaders/index.get.ts` (PUBLIC)
  - Return semua pimpinan dimana `isActive: true`
  - Sort by `order` asc
- [ ] Buat `server/api/leaders/index.post.ts` (ADMIN)
  - Handle upload foto pimpinan via Multer
  - Simpan ke `${UPLOADS_DIR}/leaders/`
  - Tidak perlu thumbnail untuk foto pimpinan
  - Simpan ke MongoDB
- [ ] Buat `server/api/leaders/[id].put.ts` (ADMIN)
  - Jika ada file baru diupload, hapus foto lama dari disk
  - Update data MongoDB
- [ ] Buat `server/api/leaders/[id].delete.ts` (ADMIN)
  - Hapus foto dari disk
  - Hapus dokumen dari MongoDB

### 1.9 — API Routes: Clients

- [x] Buat `server/api/clients/index.get.ts` (PUBLIC)
  - Query param: `?category=`
  - Return semua klien dimana `isActive: true`
  - Sort by `category` asc, lalu `order` asc
- [x] Buat `server/api/clients/index.post.ts` (ADMIN)
  - Handle upload logo
  - Simpan info klien
- [x] Buat `server/api/clients/[id].put.ts` (ADMIN)
- [x] Buat `server/api/clients/[id].delete.ts` (ADMIN)
  - Hapus logo dari disk
  - Hapus dokumen dari MongoDB

### 1.10 — API Routes: Services

- [x] Buat `server/api/services/index.get.ts` (PUBLIC)
  - Return semua layanan dimana `isActive: true`
  - Sort by `order` asc
- [ ] Buat `server/api/services/[slug].get.ts` (PUBLIC)
  - Return satu layanan berdasarkan `slug`
  - Return 404 jika tidak ditemukan
- [ ] Buat `server/api/services/index.post.ts` (ADMIN)
  - Auto-generate `slug` dari `title` menggunakan `slugify`
  - Cek uniqueness slug sebelum simpan
- [ ] Buat `server/api/services/[id].put.ts` (ADMIN)
  - Jika `title` berubah, regenerate `slug`
  - Cek uniqueness slug baru
- [ ] Buat `server/api/services/[id].delete.ts` (ADMIN)

### 1.11 — API Routes: Blog

- [x] Buat `server/api/blog/index.get.ts` (PUBLIC)
  - Query params: `?page=`, `?limit=`, `?tag=`
  - Return hanya `isPublished: true`
  - Sort by `publishedAt` desc
  - Jangan return field `content` di list (hanya di detail) — hemat bandwidth
- [ ] Buat `server/api/blog/[slug].get.ts` (PUBLIC)
  - Return artikel lengkap termasuk `content`
  - Return 404 jika tidak ditemukan atau `isPublished: false`
- [ ] Buat `server/api/blog/index.post.ts` (ADMIN)
  - Auto-generate `slug` dari `title`
  - Jika `excerpt` kosong, auto-generate dari 160 karakter pertama `content`
  - Handle upload `coverImage` via Multer ke `${UPLOADS_DIR}/blog/`
- [ ] Buat `server/api/blog/[id].put.ts` (ADMIN)
  - Handle update termasuk replace cover image
  - Jika cover image baru diupload, hapus yang lama
- [ ] Buat `server/api/blog/[id].delete.ts` (ADMIN)
  - Hapus cover image dari disk
  - Hapus dokumen dari MongoDB

### 1.12 — API Routes: Careers

- [x] Buat `server/api/careers/index.get.ts` (PUBLIC)
  - Return hanya `isActive: true`
  - Filter otomatis: jika `closingDate` sudah lewat, jangan tampilkan
  - Sort by `postedAt` desc
- [x] Buat `server/api/careers/index.post.ts` (ADMIN)
- [x] Buat `server/api/careers/[id].put.ts` (ADMIN)
- [x] Buat `server/api/careers/[id].delete.ts` (ADMIN)

### 1.13 — API Routes: Contacts

- [x] Buat `server/api/contacts/submit.post.ts` (PUBLIC)
  - Validasi: `fullname`, `email`, `message` wajib ada
  - Validasi format email
  - Simpan ke MongoDB dengan `submittedAt: new Date()`, `isRead: false`
  - Kirim email notifikasi via `sendContactNotification()`
  - Return `{ success: true, message: '...' }` ke frontend
  - Return 400 jika validasi gagal
- [x] Buat `server/api/contacts/index.get.ts` (ADMIN)
  - Query params: `?isRead=false`, `?page=`, `?limit=`
  - Sort by `submittedAt` desc
  - Return total count juga (untuk badge notifikasi di admin)
- [x] Buat `server/api/contacts/[id].patch.ts` (ADMIN)
  - Toggle `isRead` field

### 1.14 — Testing Backend

- [ ] Test semua endpoint dengan tool seperti Postman, Insomnia, atau Bruno
- [ ] Test auth flow: login → dapat cookie → akses admin endpoint → berhasil
- [ ] Test auth guard: akses admin endpoint tanpa cookie → dapat 401
- [ ] Test upload foto galeri: file tersimpan di disk, thumbnail terbuat, data masuk MongoDB
- [ ] Test form submit: data masuk MongoDB, email terkirim
- [ ] Test CRUD semua collection: create, read, update, delete berjalan tanpa error

---

## FASE 2 — Admin Panel

### 2.1 — Layout Admin

- [x] Buat `layouts/admin.vue`
  - Struktur: sidebar kiri (220px) + konten kanan (flex-1)
  - Tidak ada header publik (header admin sendiri)
  - Responsif: sidebar collapse di mobile
- [x] Buat `components/admin/AdminSidebar.vue`
  - Logo/nama aplikasi di atas
  - Menu navigasi: Dashboard, Gallery, Cabang, Pimpinan, Klien, Layanan, Blog, Karir, Inbox
  - Badge merah untuk Inbox jika ada pesan belum dibaca
  - Tombol Logout di bawah
  - Active state untuk menu yang sedang dibuka
- [x] Buat `components/admin/AdminHeader.vue`
  - Breadcrumb sederhana
  - Info username yang sedang login

### 2.2 — Auth Admin (Frontend)

- [ ] Buat composable `composables/useAuth.ts`
  - Fungsi `login(username, password)`
  - Fungsi `logout()`
  - State `isAuthenticated`
- [x] Buat middleware client `middleware/auth.ts`
  - Cek status auth sebelum masuk halaman `/admin/*`
  - Jika belum login, redirect ke `/admin/login`
- [x] Buat halaman `pages/admin/login.vue`
  - Form sederhana: username + password
  - Tombol Login
  - Handle error (credentials salah)
  - Setelah login sukses, redirect ke `/admin`
  - Jika sudah login dan akses `/admin/login`, redirect ke `/admin`
- [x] Set halaman login dengan `definePageMeta({ layout: false })` — tanpa layout admin

### 2.3 — Dashboard Admin

- [x] Buat `pages/admin/index.vue`
  - Ambil statistik via API:
    - Jumlah foto galeri
    - Jumlah submission kontak yang belum dibaca
    - Jumlah lowongan aktif
    - Jumlah artikel published
  - Tampilkan dalam card sederhana
  - Link cepat ke setiap section

### 2.4 — Admin: Gallery

- [x] Buat `pages/admin/gallery.vue`
  - **Section Upload:** drag-and-drop atau click upload, preview sebelum submit
  - Field tambahan: `title` (opsional), `category` (text input bebas), `isFeatured` (checkbox)
  - Progress bar saat upload berlangsung
  - **Section List:** grid foto (3 kolom)
    - Setiap foto: tampilkan thumbnail, judul, kategori, badge "Featured"
    - Tombol Edit (ubah title, category, isFeatured, order)
    - Tombol Hapus (dengan konfirmasi)
  - Filter by kategori
  - Setelah upload sukses, list refresh otomatis

### 2.5 — Admin: Branches (Cabang)

- [x] Buat `pages/admin/branches.vue`
  - List semua cabang dalam tabel
  - Tombol "Tambah Cabang" → buka modal form
  - Modal form berisi semua field Branch (nama, kota, telepon, email, alamat, lat, lng, mapsUrl, isActive)
  - Validasi lat/lng harus angka
  - Tombol Edit → buka modal dengan data terisi
  - Tombol Hapus dengan konfirmasi

### 2.6 — Admin: Leaders (Pimpinan)

- [x] Buat `pages/admin/leaders.vue`
  - List dalam tabel: foto (kecil), nama, jabatan, order, status
  - Tombol Tambah → buka modal
  - Modal form: upload foto, nama, jabatan, bio (textarea), order, isActive
  - Tombol Edit (foto bisa diganti atau tetap)
  - Tombol Hapus dengan konfirmasi

### 2.7 — Admin: Clients (Klien)

- [x] Buat `pages/admin/clients.vue`
  - List dalam grid (logo tampil langsung)
  - Tombol Tambah → buka modal
  - Modal form: upload logo, nama, kategori (text), order, isActive
  - Tombol Edit
  - Tombol Hapus dengan konfirmasi
  - Filter by kategori

### 2.8 — Admin: Services (Layanan)

- [x] Buat `pages/admin/services.vue`
  - List dalam tabel: judul, slug, status, urutan
  - Tombol Tambah → buka form (halaman terpisah, bukan modal — kontennya panjang)
  - Form: title, titleEn, icon (input text nama icon), description (textarea singkat), content (rich text editor), isActive, order
  - Tombol Edit → buka halaman form edit
  - Tombol Hapus dengan konfirmasi

### 2.9 — Admin: Blog

- [x] Buat `pages/admin/blog/index.vue` — daftar semua artikel
  - Kolom: judul, slug, status (Draft/Published), tanggal publish
  - Tombol Tambah → buka halaman `pages/admin/blog/create.vue`
  - Tombol Edit → buka `pages/admin/blog/[id].vue`
  - Tombol Hapus dengan konfirmasi
  - Toggle publish/draft langsung dari list (tanpa buka halaman edit)
- [x] Buat `pages/admin/blog/create.vue` dan `pages/admin/blog/[id].vue`
  - Form: judul, cover image upload, excerpt (opsional), content (rich text editor), tags (input), isPublished
  - Menggunakan Quill Editor (vueup/vue-quill) untuk mempermudah.

### 2.10 — Admin: Careers (Lowongan)

- [x] Buat `pages/admin/careers.vue`
  - List: judul, lokasi, tipe, status, tanggal tutup
  - Tombol Tambah → buka modal
  - Modal form: title, location, type (dropdown: Full-time/Part-time/Internship), description (textarea), requirements (textarea, satu per baris), closingDate (date input), isActive
  - Tombol Edit
  - Tombol Hapus

### 2.11 — Admin: Contact Inbox

- [x] Buat `pages/admin/contacts.vue`
  - List semua submission, sort by terbaru
  - Highlight baris yang belum dibaca (bold atau warna berbeda)
  - Klik baris → expand tampilkan pesan lengkap + mark as read otomatis
  - Filter: Semua / Belum Dibaca
  - Tampilkan: nama, email, telepon, kota, pesan, waktu submit

### 2.12 — Komponen UI Reusable Admin

- [x] Buat `components/ui/Modal.vue` — modal generic dengan slot
- [x] Buat `components/ui/WysiwygEditor.vue` — rich text editor menggunakan Quill

---

## FASE 3 — Halaman Publik (SSR)

### 3.1 — Layout Publik

- [x] Buat `layouts/default.vue`
  - Pindahkan dan update header dari proyek Vue lama
  - Pindahkan dan update footer dari proyek Vue lama
  - Tambahkan WhatsApp CTA floating button (icon WA di pojok kanan bawah)
    - Link ke `https://wa.me/[nomor-kantor]` dengan pesan default
- [x] Buat `components/layout/AppHeader.vue` — navigasi publik
- [x] Buat `components/layout/AppFooter.vue`

### 3.2 — Halaman Beranda (`pages/index.vue`)

- [x] Gunakan `useAsyncData()` untuk fetch data:
  - Services (semua yang `isActive: true`)
  - Gallery (hanya `isFeatured: true`, limit 6)
  - Leaders (semua yang `isActive: true`)
- [x] Section: Hero banner — teks dan gambar statis (atau bisa dari config)
- [x] Section: Layanan Kami — render dari data `services`
- [x] Section: Kenapa Memilih Kami — bisa tetap hardcoded (konten tidak sering berubah)
- [x] Section: Pengalaman Kami — counter animasi (bisa tetap hardcoded)
- [x] Tambahkan `useHead()` dengan title, meta description, OG tags

### 3.3 — Halaman About Us (`pages/about-us.vue`)

- [x] Fetch data: leaders
- [x] Section: Siapa Kami — teks bisa dibuat configurable via env atau tetap hardcoded
- [x] Section: Visi — hardcoded (tidak sering berubah)
- [x] Section: Misi — hardcoded
- [x] Section: Tim Pimpinan — render dari data `leaders`
- [x] `useHead()` dengan meta SEO

### 3.4 — Halaman Gallery (`pages/gallery.vue`)

- [x] Fetch data: galleries (semua, dengan pagination)
- [x] Tampilkan filter kategori (ambil unique categories dari data)
- [x] Grid foto 3 kolom (responsif)
- [x] Integrasikan lightbox (Vue Easy Lightbox)
- [x] Lazy loading gambar (`loading="lazy"`)
- [x] Gunakan `thumbnailUrl` untuk grid, `imageUrl` untuk lightbox
- [x] `useHead()` dengan meta SEO

### 3.5 — Halaman Rekan & Klien (`pages/rekan-klien.vue`)

- [x] Fetch data: clients
- [x] Filter by kategori
- [x] Grid logo klien
- [x] `useHead()` dengan meta SEO

### 3.6 — Halaman Contact Us (`pages/contact-us.vue`)

- [x] Fetch data: branches
- [x] Render peta Leaflet untuk setiap cabang
  - Perhatian: Leaflet butuh `client-only` wrapper karena tidak support SSR
  - Gunakan `<ClientOnly>` wrapper untuk komponen peta
- [x] Form kontak: fullname, email, phone, city, message
- [x] Submit ke `POST /api/contacts/submit`
- [x] Tampilkan toast notifikasi sukses/gagal setelah submit
- [x] Validasi form di frontend sebelum kirim
- [x] Reset form setelah submit sukses
- [x] `useHead()` dengan meta SEO

### 3.7 — Halaman Layanan (`pages/layanan/`)

- [x] Buat `pages/layanan/index.vue` — daftar semua layanan
  - Fetch: semua services yang `isActive: true`
  - Grid card layanan, setiap card link ke `/layanan/:slug`
  - `useHead()` dengan meta SEO
- [x] Buat `pages/layanan/[slug].vue` — detail layanan
  - Fetch: satu service berdasarkan `slug`
  - Render `content` (rich text/HTML) dengan sanitasi
  - Handle 404 jika slug tidak ditemukan
  - `useHead()` dengan title dinamis dari nama layanan, meta description, OG tags

### 3.8 — Halaman Blog (`pages/blog/`)

- [x] Buat `pages/blog/index.vue` — daftar artikel
  - Fetch: blog posts (`isPublished: true`), dengan pagination
  - Card artikel: cover image (thumbnail), judul, excerpt, tanggal publish, tags
  - `useHead()` dengan meta SEO
- [x] Buat `pages/blog/[slug].vue` — detail artikel
  - Fetch: satu artikel berdasarkan `slug`
  - Render `content` HTML
  - Tampilkan: cover image, judul, tanggal, tags, konten
  - Handle 404 jika slug tidak ditemukan atau `isPublished: false`
  - `useHead()` dengan title, description dari `excerpt`, OG tags, OG image dari `coverImageUrl`

### 3.9 — Halaman Karir (`pages/karir/index.vue`)

- [x] Fetch: semua careers yang `isActive: true` dan `closingDate` belum lewat
- [x] List lowongan: judul, lokasi, tipe, deskripsi singkat, tanggal tutup
- [x] Setiap lowongan ada tombol "Lamar Sekarang" → arahkan ke email kantor atau WhatsApp
  - Format: `mailto:email@kjpphjar.com?subject=Lamaran%20[Judul%20Lowongan]`
- [x] `useHead()` dengan meta SEO

---

## FASE 4 — SEO & Polish

### 4.1 — Meta Tags & SEO

- [x] Pastikan setiap halaman punya `useHead()` dengan:
  - `title` — format: `[Nama Halaman] | KJPP HJA'R`
  - `meta description` — deskripsi unik per halaman, max 160 karakter
  - `og:title`, `og:description`, `og:image`, `og:url` — untuk sharing sosmed
  - `og:image` default: logo atau gambar hero perusahaan

### 4.2 — Sitemap

- [x] Konfigurasi `@nuxtjs/sitemap` di `nuxt.config.ts`
- [x] Tambahkan route statis: `/`, `/about-us`, `/gallery`, `/rekan-klien`, `/contact-us`, `/blog`, `/karir`, `/layanan`
- [x] Tambahkan route dinamis: `/layanan/:slug`, `/blog/:slug` — fetch dari API
- [x] Verifikasi `sitemap.xml` terbentuk dengan benar di `/sitemap.xml`

### 4.3 — Structured Data (JSON-LD)

- [x] Tambahkan schema `LocalBusiness` di halaman beranda:
  - Nama perusahaan, deskripsi, alamat kantor pusat, telepon, email, URL website

### 4.4 — `robots.txt`

- [x] Update `public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Disallow: /admin/
  Sitemap: https://domain-anda.com/sitemap.xml
  ```

### 4.5 — Halaman Error

- [x] Update `error.vue` — tampilkan pesan 404 yang informatif
- [x] Tambahkan link kembali ke beranda

### 4.6 — Performance

- [x] Pastikan semua `<img>` di halaman publik pakai `loading="lazy"` dan `width`/`height` attribute
- [x] Gunakan thumbnail (bukan original) di semua tampilan grid/list
- [x] Verifikasi tidak ada blocking resource di head HTML

### 4.7 — WhatsApp CTA

- [x] Buat `components/ui/WhatsAppButton.vue`
  - Floating button di pojok kanan bawah
  - Icon WhatsApp
  - Link ke `https://wa.me/[nomor]?text=[pesan default]`
  - Nomor diambil dari data cabang pusat atau dari env
- [x] Include di `layouts/default.vue`

---

## FASE 5 — Deployment ke Hostinger

### 5.1 — Persiapan

- [ ] Pastikan semua fitur sudah ditest di local development
- [ ] Jalankan `npm run build` — pastikan tidak ada error TypeScript atau build error
- [ ] Test `node .output/server/index.mjs` secara lokal — verifikasi production build berjalan

### 5.2 — MongoDB Atlas

- [ ] Buat akun MongoDB Atlas (jika belum ada)
- [ ] Buat cluster baru (free tier M0 cukup untuk awal)
- [ ] Buat database user dengan username dan password
- [ ] Whitelist IP: tambahkan `0.0.0.0/0` (allow all) atau IP spesifik Hostinger
- [ ] Salin connection string (`mongodb+srv://...`)
- [ ] Connect ke Hostinger via panel Hostinger → "Hubungkan Database" → pilih MongoDB Atlas
- [ ] Masukkan connection string

### 5.3 — Setup Hostinger

- [ ] Masuk ke hPanel Hostinger
- [ ] Setup Node.js Web App dengan Node.js 22 atau 24
- [ ] Set build command: `npm run build`
- [ ] Set start command: `npm run start` dan port `3000`
- [ ] Set semua environment variables di panel Hostinger (lihat daftar di `project-plan.md`)
- [ ] Buat direktori upload persisten di luar folder build `nodejs`, lalu set `UPLOADS_DIR` absolut
- [ ] Aktifkan `TRUST_PROXY=true`
- [ ] Hubungkan repository GitHub atau upload ZIP tanpa `node_modules`

### 5.4 — Testing Production

- [ ] Buka website di domain production — halaman beranda muncul
- [ ] Verifikasi SSR bekerja: cek view-source, pastikan konten ada di HTML (bukan kosong)
- [ ] Test semua halaman publik bisa diakses
- [ ] Test form kontak: submit → email notifikasi diterima di inbox
- [ ] Akses `/admin/login` → bisa login dengan credential yang sudah diset
- [ ] Test upload foto galeri dari admin panel
- [ ] Test tambah cabang baru
- [ ] Test tambah artikel blog + publish
- [ ] Test semua fitur CRUD dari admin panel
- [ ] Verifikasi `/sitemap.xml` bisa diakses
- [ ] Verifikasi `/robots.txt` isinya benar
- [ ] Test di mobile (responsif)

---

## 📌 Catatan Penting

> **Selalu ikuti urutan fase.** Jangan mulai Fase 2 sebelum backend di Fase 1 sudah ditest.

> **Setiap endpoint API yang bersifat write (POST/PUT/PATCH/DELETE) harus dilindungi auth middleware**, kecuali `POST /api/contacts/submit` yang memang endpoint publik.

> **Jangan simpan file upload di dalam source atau bundle Nuxt.** Simpan ke `UPLOADS_DIR`; aplikasi menyajikannya melalui URL `/uploads/*`.

> **Mongoose strict mode harus ON** (default). Jangan pernah set `strict: false` — ini yang menjaga kontrak data tetap konsisten.

> **Slug selalu auto-generate dari title** menggunakan `slugify`. Jangan biarkan admin input slug manual untuk menghindari inkonsistensi.

---

*Dokumen ini adalah panduan pengerjaan. Update checklist seiring progress.*
*Referensi: [`project-plan.md`](./project-plan.md)*
