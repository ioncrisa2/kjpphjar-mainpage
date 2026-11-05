# 🔐 Rencana Teknis Role & Permission Panel Admin — KJPP HJA'R CMS

> **Dokumen perencanaan dan pelacakan (*tracking*) fitur multi-user dengan hak akses per menu.**
> Tujuan: user selain super admin bisa login ke panel admin dan hanya mengakses menu/aksi yang diizinkan.
> Contoh kebutuhan awal: **Penilai Publik / Pimpinan Cabang** hanya boleh menulis artikel, upload foto galeri, dan menambah klien/rekanan.
>
> **Status:** ✅ Fase 1–4 dikerjakan 5 November 2026 (di atas commit `78b9ad3`) — Fase 5 (uji manual) belum
> **Dianalisis pada:** 4 November 2026 (kondisi kode per commit `6d4aaaf`)
> **Catatan:** nomor baris di dokumen ini bisa bergeser bila file sudah berubah sejak analisis.

## 🧾 Catatan Implementasi (5 November 2026)

Penyimpangan dari rencana di bawah, beserta alasannya:

| Rencana awal | Yang dikerjakan | Alasan |
|---|---|---|
| Katalog di `server/utils/permissions.ts` | `shared/permissions.ts` | Dipakai bersama server dan frontend (menu, halaman, tombol) |
| `require-admin.ts` dipecah | Diganti `server/utils/require-auth.ts` (`requireAuth`, `requirePermission`, `requireSuperAdmin`, `hasPermission`) | Semua pemanggil memang harus diubah; nama lama menyesatkan |
| Tabel aturan di dalam `admin-auth.ts` | `server/utils/route-permissions.ts` (modul murni) + `tests/route-permissions.test.mjs` | Bisa diuji tanpa Nuxt: `npm test` (Node ≥ 22.18) |
| `users.manage`, `roles.manage` sebagai permission | Tidak ada di katalog; rute `/api/admin/users`, `/api/admin/roles`, `/api/admin/permissions` hanya untuk super admin lewat default-deny | Pemegang `roles.manage` bisa menambah izin ke role-nya sendiri (eskalasi). Otomatis memenuhi aturan "hanya super admin boleh memberi role admin" |
| `Role` ikut backup | `roles` dikecualikan dari backup, sama seperti `users` | Restore memvalidasi `uniqueKeys`; restore ke database baru (disaster recovery) akan gagal 409 karena seed sudah membuat role `admin` dengan `_id` berbeda |
| Modul Staff belum ada | Tambah `staff.view/create/update/delete` | Modul Staff ditambahkan setelah analisis (commit `7c94ec6`) |
| Hanya `blog.manage_all` | Tambah `gallery.manage_all` dan `clients.manage_all` | Diperlukan agar D2 ("milik sendiri") bisa ditegakkan di Galeri dan Klien. Tanpa manage_all: unggulan/urutan foto dan urutan klien tidak bisa diubah |
| Admin galeri memakai `GET /api/gallery` publik | `GET /api/gallery?admin=true` (privat, `gallery.view`) | Daftar admin perlu disaring per pemilik. Respons publik galeri/klien tidak lagi memuat `createdBy`/`updatedBy` |
| Penulis dikunci bila user punya `leaderId` | Bila tidak punya `leaderId`, penulis = nama akun | Mencegah kontributor mengatasnamakan Pimpinan lain |

Hal lain:
- Seed membuat role sistem `admin` (selalu) dan role contoh **Kontributor Cabang** (`kontributor`) hanya saat koleksi `roles` masih kosong.
- `login.vue` kini menampilkan pesan untuk akun nonaktif / role tidak dikenal (403) dan rate limit (429).
- Login ulang sekali diperlukan setelah deploy karena format JWT berubah.

---

## 📌 Ringkasan

**Skala perubahan: sedang — tidak perlu rombak total.** Fondasi yang sudah ada mendukung:

- Semua guard API terpusat di satu file, `server/middleware/admin-auth.ts`. Cukup ubah logika "admin atau bukan" menjadi "punya permission X atau tidak".
- Identitas user dibaca ulang dari database di setiap request (`server/utils/require-admin.ts:28-29`). Perubahan role atau penonaktifan user langsung berlaku tanpa menunggu token kedaluwarsa.
- Field `role` sudah ada di `server/models/User.ts:28-31`, dengan komentar *"in case we want to add multiple roles later"*.

Yang belum ada: konsep permission, UI kelola user/role, menu & halaman yang menyesuaikan hak akses, dan pencatatan kepemilikan data (siapa membuat apa).

| Ukuran | Perkiraan |
|---|---|
| File baru | ± 18 |
| File diubah | ± 45 (sekitar separuhnya hanya 1–3 baris) |
| Total baris | ± 1.500–2.000 |
| Waktu versi lengkap | 6–8 hari kerja |
| Waktu versi minimum | 2–3 hari kerja |

---

## 🔍 1. Kondisi Saat Ini (Penghalang Multi-Role)

| Lokasi | Masalah |
|---|---|
| `server/utils/require-admin.ts:14,30` | Hardcode `role === 'admin'`; role lain langsung 403 |
| `server/api/auth/login.post.ts:66` | Role selain `admin` ditolak saat login (401) |
| `server/middleware/admin-auth.ts:20-38` | Hanya membedakan rute privat vs publik; tidak ada pembeda per modul/aksi |
| 12 handler memanggil `requireAdmin()` langsung | `analytics/*` (5), `settings/*` (4), `contacts/export`, `auth/me`, `auth/profile` — semua akan menolak role non-admin |
| `server/middleware/maintenance.ts:43`, `server/middleware/analytics.ts:51` | Bypass mode maintenance hanya untuk admin |
| `middleware/auth.ts` | Hanya cek sudah login, tidak cek hak akses halaman |
| `components/admin/AdminSidebar.vue:18-67` | Menu hardcoded, semua menu selalu tampil |
| `components/admin/AdminHeader.vue` | Link Inbox + fetch jumlah pesan belum dibaca selalu jalan; link profil mengarah ke `/admin/settings` |
| `pages/admin/index.vue:5-8` | Dashboard memanggil `/api/contacts` (privat) dan menampilkan aksi cepat ke Cabang/Pimpinan |
| `pages/admin/settings.vue:15-20` | Tab "Profil & Keamanan" (ganti password) ada di dalam halaman Pengaturan — user terbatas tidak bisa ganti password sendiri |
| Tidak ada API/UI kelola user | User hanya bisa dibuat lewat env seed `ADMIN_USERNAME` (`server/plugins/seed.ts:13-37`) |
| `BlogPost`, `Gallery`, `Client` tidak punya `createdBy` | Belum bisa membatasi "hanya boleh edit milik sendiri" |
| `components/admin/blog/BlogPostForm.vue:13` | Form blog memanggil `GET /api/admin/categories` → izin blog harus ikut mengizinkan baca kategori |

✅ Sudah benar dan harus dipertahankan: koleksi `users` tidak ikut backup (`server/utils/backup-registry.ts:22-34`), sehingga hash password tidak bocor lewat file backup.

---

## 🧭 2. Prinsip Desain

1. **Yang dicek kode adalah permission, bukan nama role.** Kode bertanya "user ini punya `blog.create`?". Role hanyalah kumpulan permission, sehingga variasi role berapa pun tidak memerlukan perubahan kode.
2. **Daftar permission ditulis di kode**, karena setiap permission terikat ke endpoint tertentu.
3. **Role disimpan di database** (koleksi `roles`) dan disusun lewat checklist di UI. Super admin bisa membuat role baru tanpa deploy.
4. **Role sistem `admin`** selalu punya semua permission dan tidak bisa diedit/dihapus. Key tetap `'admin'` sehingga user lama tidak perlu dimigrasi.
5. **Default-deny:** endpoint privat yang belum dipetakan ke permission hanya bisa diakses super admin. Ini melanjutkan prinsip di komentar `server/middleware/admin-auth.ts:17-19`.
6. **Server adalah penentu akhir.** Menyembunyikan menu/tombol di UI hanya untuk kenyamanan, bukan keamanan.

---

## 🗂️ 3. Katalog Permission

| Modul | Permission |
|---|---|
| Dashboard | (semua user yang login) |
| Analitik | `analytics.view`, `analytics.purge` |
| Layanan | `services.view`, `services.create`, `services.update`, `services.delete` |
| FAQ | `faq.view`, `faq.create`, `faq.update`, `faq.delete` |
| Blog | `blog.view`, `blog.create`, `blog.update`, `blog.delete`, `blog.publish`, `blog.manage_all`, `blog.categories` |
| Karir | `careers.view`, `careers.create`, `careers.update`, `careers.delete` |
| Galeri | `gallery.view`, `gallery.create`, `gallery.update`, `gallery.delete` |
| Pimpinan | `leaders.view`, `leaders.create`, `leaders.update`, `leaders.delete` |
| Cabang | `branches.view`, `branches.create`, `branches.update`, `branches.delete` |
| Klien & Rekanan | `clients.view`, `clients.create`, `clients.update`, `clients.delete` |
| Inbox Kontak | `contacts.view`, `contacts.update`, `contacts.export` |
| Kontak Footer | `contact_persons.view`, `contact_persons.create`, `contact_persons.update`, `contact_persons.delete` |
| Pengaturan | `settings.manage`, `settings.backup`, `settings.restore` |
| Sistem | `users.manage`, `roles.manage` (disarankan khusus super admin) |

Keterangan permission khusus Blog:
- `blog.publish` — boleh menyimpan status `published`/`scheduled`. Tanpa ini, artikel dipaksa `draft`.
- `blog.manage_all` — boleh melihat/mengedit/menghapus artikel milik siapa pun, mengubah penulis, dan mengatur `isFeatured`.
- `blog.categories` — boleh tambah/ubah/hapus kategori. (Membaca kategori cukup `blog.view`.)

Catatan Pengaturan: `PUT /api/settings` menyimpan pengaturan umum dan maintenance dalam satu payload (`server/api/settings/index.put.ts`), jadi cukup satu permission `settings.manage`. Memisah "umum" vs "maintenance" memerlukan pembandingan field di handler.

---

## 🛠️ 4. Rincian Perubahan

### 4.1 Model Data

**`server/models/User.ts` (ubah)**
- `role: string` tetap, tetapi artinya menjadi `Role.key`. User lama dengan `role: 'admin'` otomatis tetap super admin.
- Field baru:
  ```typescript
  isActive:     { type: Boolean, default: true },
  leaderId:     { type: Schema.Types.ObjectId, ref: 'Leader', default: null }, // penulis artikel
  tokenVersion: { type: Number, default: 0 },                                 // untuk paksa logout
  lastLoginAt:  { type: Date, default: null },
  createdBy:    { type: Schema.Types.ObjectId, ref: 'User', default: null },
  ```

**`server/models/Role.ts` (baru)**
```typescript
{
  key:         { type: String, required: true, unique: true, trim: true, lowercase: true },
  name:        { type: String, required: true, maxlength: 80 },
  description: { type: String, maxlength: 300 },
  permissions: { type: [String], default: [] },   // divalidasi terhadap katalog di kode
  isSystem:    { type: Boolean, default: false }, // true untuk 'admin', tidak bisa diedit/dihapus
}
```

**`BlogPost`, `Gallery`, `Client` (ubah — untuk fase kepemilikan data)**
- Tambah `createdBy` dan `updatedBy` (ObjectId ref `User`).
- Data lama tanpa `createdBy` dianggap milik admin.

**`server/utils/backup-registry.ts` (ubah)**
- Tambahkan `Role`. `User` tetap **tidak** ikut backup.

### 4.2 Inti Autentikasi Server

**`server/utils/permissions.ts` (baru)** — katalog permission + type:
```typescript
export const PERMISSIONS = {
  'blog.view':   { group: 'Blog', label: 'Lihat artikel' },
  'blog.create': { group: 'Blog', label: 'Tulis artikel' },
  // ...
} as const
export type Permission = keyof typeof PERMISSIONS
```

**`server/utils/auth.ts` (ubah)**
- Payload JWT menjadi `{ sub: userId, tv: tokenVersion }` (sebelumnya `{ username }`).
- Saat password direset, password diganti, atau user dinonaktifkan → `tokenVersion++` → semua sesi lama user tersebut langsung tidak berlaku.

**`server/utils/require-admin.ts` (ubah, dipecah)**
```typescript
requireAuth(event): Promise<SessionUser>   // login + isActive + role valid; cache di event.context
requirePermission(event, perm | perm[])    // 403 jika tidak punya salah satunya
hasPermission(user, perm): boolean         // super admin selalu true

interface SessionUser {
  id: string
  username: string
  name: string
  roleKey: string
  roleName: string
  isSuperAdmin: boolean
  permissions: string[]
  leaderId: string | null
}
```
Role boleh di-cache di memori beberapa detik agar tidak menambah query per request.

**`server/api/auth/login.post.ts` (ubah)**
- Ganti `user.role !== 'admin'` dengan cek `isActive` dan role ada.
- Isi `lastLoginAt`.

**`server/api/auth/me.get.ts` (ubah)**
- Kembalikan juga `permissions`, `roleName`, `isSuperAdmin`, `leaderId`.

**`server/api/auth/profile.put.ts` (ubah)**
- Pakai `requireAuth` — semua user boleh mengubah nama & password sendiri.
- Setelah ganti password: `tokenVersion++`, lalu set ulang cookie agar sesi saat ini tetap berjalan.

### 4.3 Guard API (`server/middleware/admin-auth.ts`) — perubahan terbesar di server

Rangkaian kondisi `||` diganti dengan **tabel aturan** `method + path (+ query) → permission`. Semua kondisi saat ini (`?all=true`, `?admin=true`, pengecualian publik) wajib dipertahankan.

```typescript
const RULES: RouteRule[] = [
  { m: 'POST',   p: '/api/admin/blog/upload-image',     perm: ['blog.create', 'blog.update'] },
  { m: 'GET',    p: /^\/api\/admin\/blog(\/[^/]+)?$/,   perm: 'blog.view' },
  { m: 'POST',   p: '/api/admin/blog',                  perm: 'blog.create' },
  { m: 'PUT',    p: /^\/api\/admin\/blog\/[^/]+$/,      perm: 'blog.update' },
  { m: 'DELETE', p: /^\/api\/admin\/blog\/[^/]+$/,      perm: 'blog.delete' },
  { m: 'GET',    p: '/api/admin/categories',            perm: 'blog.view' },       // dipakai form blog
  { m: '*',      p: /^\/api\/admin\/categories/,        perm: 'blog.categories' },
  { m: 'POST',   p: '/api/gallery',                     perm: 'gallery.create' },
  { m: 'PATCH',  p: /^\/api\/gallery\/[^/]+$/,          perm: 'gallery.update' },
  { m: 'DELETE', p: /^\/api\/gallery\/[^/]+$/,          perm: 'gallery.delete' },
  { m: 'GET',    p: '/api/clients', q: { all: 'true' }, perm: 'clients.view' },
  { m: 'POST',   p: '/api/clients',                     perm: 'clients.create' },
  { m: 'PUT',    p: '/api/clients/reorder',             perm: 'clients.update' },
  { m: 'PUT',    p: /^\/api\/clients\/[^/]+$/,          perm: 'clients.update' },
  { m: 'DELETE', p: /^\/api\/clients\/[^/]+$/,          perm: 'clients.delete' },
  // ... services, faq, careers, leaders, branches, contacts, contact-persons,
  //     analytics, settings, users, roles
]
```

Alur middleware:
1. Rute publik → dilewatkan.
2. Rute privat → `requireAuth`.
3. Ada aturan yang cocok → `requirePermission`.
4. Privat tetapi tidak ada aturan → **hanya super admin**.

Pemetaan lengkap endpoint yang saat ini privat:

| Endpoint | Method | Permission |
|---|---|---|
| `/api/admin/blog`, `/api/admin/blog/:id` | GET | `blog.view` |
| `/api/admin/blog` | POST | `blog.create` |
| `/api/admin/blog/:id` | PUT | `blog.update` |
| `/api/admin/blog/:id` | DELETE | `blog.delete` |
| `/api/admin/blog/upload-image` | POST | `blog.create` atau `blog.update` |
| `/api/admin/categories` | GET | `blog.view` |
| `/api/admin/categories`, `/:id` | POST/PUT/DELETE | `blog.categories` |
| `/api/services`, `/:id`, `/reorder` | POST/PUT/DELETE | `services.create/update/delete` |
| `/api/faq?admin=true` | GET | `faq.view` |
| `/api/faq`, `/:id`, `/reorder` | POST/PUT/DELETE | `faq.create/update/delete` |
| `/api/careers?admin=true` | GET | `careers.view` |
| `/api/careers`, `/:id` | POST/PUT/DELETE | `careers.create/update/delete` |
| `/api/gallery`, `/:id` | POST/PATCH/DELETE | `gallery.create/update/delete` |
| `/api/leaders`, `/:id` | POST/PUT/DELETE | `leaders.create/update/delete` |
| `/api/branches`, `/:id` | POST/PUT/DELETE | `branches.create/update/delete` |
| `/api/clients?all=true` | GET | `clients.view` |
| `/api/clients`, `/:id`, `/reorder` | POST/PUT/DELETE | `clients.create/update/delete` |
| `/api/contacts`, `/api/contacts/unread-count` | GET | `contacts.view` |
| `/api/contacts/:id` | PATCH | `contacts.update` |
| `/api/contacts/export` | GET | `contacts.export` |
| `/api/contact-persons`, `/:id` | POST/PUT/DELETE | `contact_persons.create/update/delete` |
| `/api/analytics/*` (kecuali `track`) | GET | `analytics.view` |
| `/api/analytics/purge` | DELETE | `analytics.purge` |
| `/api/settings` | PUT | `settings.manage` |
| `/api/settings/backup` | GET | `settings.backup` |
| `/api/settings/restore` | POST | `settings.restore` |
| `/api/admin/users/*` | semua | `users.manage` |
| `/api/admin/roles/*`, `/api/admin/permissions` | semua | `roles.manage` |
| `/api/auth/me`, `/api/auth/profile`, `/api/settings/session` | semua | cukup login |

**Handler yang memanggil `requireAdmin` langsung (wajib disesuaikan):**

| File | Ganti menjadi |
|---|---|
| `server/api/analytics/overview.get.ts` | `requirePermission(event, 'analytics.view')` |
| `server/api/analytics/devices.get.ts` | `requirePermission(event, 'analytics.view')` |
| `server/api/analytics/sources.get.ts` | `requirePermission(event, 'analytics.view')` |
| `server/api/analytics/top-pages.get.ts` | `requirePermission(event, 'analytics.view')` |
| `server/api/analytics/purge.delete.ts` | `requirePermission(event, 'analytics.purge')` |
| `server/api/settings/index.put.ts` | `requirePermission(event, 'settings.manage')` |
| `server/api/settings/backup.get.ts` | `requirePermission(event, 'settings.backup')` |
| `server/api/settings/restore.post.ts` | `requirePermission(event, 'settings.restore')` |
| `server/api/settings/session.get.ts` | `requireAuth(event)` |
| `server/api/contacts/export.get.ts` | `requirePermission(event, 'contacts.export')` |
| `server/api/auth/me.get.ts` | `requireAuth(event)` |
| `server/api/auth/profile.put.ts` | `requireAuth(event)` |
| `server/middleware/maintenance.ts` | `requireAuth(event)` (lihat keputusan D5) |
| `server/middleware/analytics.ts` | `requireAuth(event)` (ikut keputusan D5) |

### 4.4 API Baru

| File | Fungsi |
|---|---|
| `server/api/admin/users/index.get.ts` | Daftar user (tanpa field password) |
| `server/api/admin/users/index.post.ts` | Tambah user (username, nama, password awal, role, leaderId) |
| `server/api/admin/users/[id].put.ts` | Ubah nama, role, leaderId, aktif/nonaktif |
| `server/api/admin/users/[id].delete.ts` | Hapus user |
| `server/api/admin/users/[id]/reset-password.post.ts` | Reset password + `tokenVersion++` |
| `server/api/admin/roles/index.get.ts` | Daftar role + jumlah user per role |
| `server/api/admin/roles/index.post.ts` | Tambah role |
| `server/api/admin/roles/[id].put.ts` | Ubah nama/deskripsi/permission (tolak jika `isSystem`) |
| `server/api/admin/roles/[id].delete.ts` | Hapus role (tolak jika `isSystem` atau masih dipakai user) |
| `server/api/admin/permissions.get.ts` | Katalog permission untuk checklist di UI |

**Aturan pengaman yang wajib ada:**
- Super admin terakhir tidak boleh dihapus, dinonaktifkan, atau diturunkan rolenya.
- User tidak bisa menonaktifkan atau mengubah role dirinya sendiri.
- Hanya super admin yang boleh memberi role `admin` (mencegah eskalasi hak akses).
- Permission yang disimpan ke role divalidasi terhadap katalog; key yang tidak dikenal ditolak.
- Password minimal 12 karakter (sama dengan aturan yang sudah ada di `profile.put.ts` dan seed).

### 4.5 Kepemilikan Data & Alur Publish (Blog)

Perubahan di `server/api/admin/blog/` (`index.post.ts`, `[id].put.ts`, `[id].delete.ts`, `index.get.ts`, `[id].get.ts`):

- Saat create: isi `createdBy = user.id`. Saat update: isi `updatedBy`.
- User **tanpa** `blog.manage_all`:
  - daftar artikel hanya menampilkan miliknya sendiri;
  - GET/PUT/DELETE artikel milik orang lain → 403;
  - `isFeatured` tidak bisa diubah (nilai lama dipertahankan);
  - jika user punya `leaderId`, maka `leaderId` dan `author` artikel dipaksa ke data Pimpinan miliknya (dropdown penulis dikunci di form). Cocok dengan atribusi penulis yang sudah ada lewat `leaderId` (`server/models/BlogPost.ts:38`).
- User **tanpa** `blog.publish`:
  - status dipaksa `draft`; admin/editor yang mempublikasikan;
  - artikel yang sudah `published` tidak bisa diubah olehnya (atau perubahannya mengembalikan ke `draft` — lihat keputusan D3).

Pola yang sama bisa diterapkan ke Galeri (`server/api/gallery/`) dan Klien (`server/api/clients/`) bila keputusan D2 menghendaki "hanya milik sendiri".

### 4.6 Frontend

**`composables/useAdminAuth.ts` (baru)**
```typescript
export function useAdminAuth() {
  const session = useState<AdminSession | null>('admin-session', () => null)
  const can = (p: string | string[]) =>
    !!session.value?.isSuperAdmin ||
    [p].flat().some((x) => session.value?.permissions.includes(x))
  // fetchSession(), clearSession() ...
  return { session, can }
}
```

**`middleware/auth.ts` (ubah)**
- Selain cek login, baca `to.meta.permission`. Jika user tidak punya → arahkan ke `/admin` dengan pesan "Anda tidak memiliki akses ke halaman tersebut".
- Tambah deklarasi type `PageMeta.permission` di folder `types/`.

**Semua halaman admin (± 20 file) — tambah `permission` di `definePageMeta`:**

| Halaman | Permission |
|---|---|
| `pages/admin/index.vue` | (tanpa — semua user login) |
| `pages/admin/analytics.vue` | `analytics.view` |
| `pages/admin/services/index.vue`, `[id].vue` / `create.vue` | `services.view` / `services.update` / `services.create` |
| `pages/admin/faq/index.vue`, `[id].vue` / `create.vue` | `faq.view` / `faq.update` / `faq.create` |
| `pages/admin/blog/index.vue` | `blog.view` |
| `pages/admin/blog/create.vue` | `blog.create` |
| `pages/admin/blog/[id].vue` | `blog.update` |
| `pages/admin/blog/categories.vue` | `blog.categories` |
| `pages/admin/careers.vue` | `careers.view` |
| `pages/admin/gallery.vue` | `gallery.view` |
| `pages/admin/leaders.vue` | `leaders.view` |
| `pages/admin/branches.vue` | `branches.view` |
| `pages/admin/clients.vue` | `clients.view` |
| `pages/admin/contacts.vue` | `contacts.view` |
| `pages/admin/contact-persons/index.vue` | `contact_persons.view` |
| `pages/admin/settings.vue` | `settings.manage` atau `settings.backup` |
| `pages/admin/profile.vue` (baru) | (tanpa — semua user login) |
| `pages/admin/users.vue` (baru) | `users.manage` |
| `pages/admin/roles.vue` (baru) | `roles.manage` |

**`components/admin/AdminSidebar.vue` (ubah)**
- Setiap item menu diberi `permission`; kategori yang semua item-nya tersembunyi ikut disembunyikan.
- `fetchUnreadCount()` hanya dipanggil jika `can('contacts.view')`.
- Tambah menu di grup "Sistem": **Pengguna** (`/admin/users`) dan **Role & Hak Akses** (`/admin/roles`).

**`components/admin/AdminHeader.vue` (ubah)**
- Link Inbox + badge hanya tampil jika `contacts.view`.
- Link profil diarahkan ke `/admin/profile`; tampilkan nama role di samping nama user.
- Tambah label breadcrumb: `users`, `roles`, `profile`, `faq`.

**`pages/admin/index.vue` (ubah)**
- Kartu statistik dan aksi cepat disaring sesuai permission.
- Jangan memanggil `/api/contacts` jika user tidak punya `contacts.view`.

**`pages/admin/settings.vue` (ubah) + `pages/admin/profile.vue` (baru)**
- Tab "Profil & Keamanan" dipindah ke halaman `/admin/profile`.
- Tab tersisa disaring: "Umum & Footer" dan "Maintenance" → `settings.manage`; "Backup & Restore" → `settings.backup` / `settings.restore`.

**Tombol aksi di dalam halaman (ubah)**
- `pages/admin/blog/index.vue`: tombol Kategori, Hapus, "Tulis artikel".
- `components/admin/blog/BlogPostForm.vue`: link "Kelola" kategori, opsi status Published/Scheduled, dropdown penulis (dikunci bila tanpa `blog.manage_all`), toggle Featured.
- `pages/admin/gallery.vue`, `pages/admin/clients.vue`: tombol Edit, Hapus, Reorder.
- Halaman lain mengikuti pola yang sama (create/update/delete).

**Halaman baru**
- `pages/admin/users.vue` — tabel user, tambah user, ubah role, hubungkan ke Pimpinan, reset password, aktif/nonaktif.
- `pages/admin/roles.vue` — daftar role + matriks checklist permission per modul.

**`pages/admin/login.vue`** — tidak perlu diubah; setelah login tetap ke `/admin` (dashboard selalu bisa diakses).

### 4.7 Seed & Migrasi

- `server/plugins/seed.ts`: pastikan role sistem `admin` ada (`isSystem: true`). Opsional: seed role contoh (lihat bagian 5).
- User lama dengan `role: 'admin'` tetap berfungsi → **tidak perlu skrip migrasi**.
- Efek samping: format JWT berubah, sehingga semua user perlu **login ulang sekali** setelah deploy.

---

## 👥 5. Contoh Konfigurasi Role

| Role | Permission | Menu yang terlihat |
|---|---|---|
| **Super Admin** (sistem) | semua | semua |
| **Kontributor Cabang** (Penilai Publik / Pimpinan Cabang) | `blog.view`, `blog.create`, `blog.update` (milik sendiri), `gallery.view`, `gallery.create`, `clients.view`, `clients.create` | Dashboard, Blog, Galeri, Klien & Rekanan, Profil |
| Editor Konten | `services.*`, `faq.*`, `blog.*` (termasuk `publish`, `manage_all`, `categories`), `careers.*`, `gallery.*` | grup Konten Website |
| Customer Service | `contacts.*`, `contact_persons.*` | Inbox Kontak, Kontak Footer |
| HRD | `careers.*` | Karir |
| Manajemen (lihat saja) | `analytics.view` | Dashboard, Analitik |

---

## ❓ 6. Keputusan yang Masih Terbuka

Harus ditentukan sebelum mulai mengerjakan. Kolom "Rekomendasi" adalah saran hasil analisis.

| # | Pertanyaan | Rekomendasi | Keputusan |
|---|---|---|---|
| D1 | Role diatur lewat UI (database) atau ditulis statis di kode? | Lewat UI/database, karena dibutuhkan banyak variasi role. Bila saat ini cukup 1–2 role, boleh mulai statis — lapisan pengecekan permission sama, sehingga pindah ke database nanti murah. | ✅ UI/database, versi lengkap Fase 1–4 |
| D2 | Kontributor boleh edit/hapus artikel, foto, atau rekanan milik orang lain? | Hanya milik sendiri, tanpa hak hapus. | ✅ Milik sendiri, tanpa hapus (blog, galeri, klien) |
| D3 | Kontributor boleh langsung publish, atau simpan draft lalu disetujui admin? | Draft → disetujui admin/editor. | ✅ Selalu draft; artikel terbit/terjadwal terkunci bagi yang tanpa `blog.publish` |
| D4 | Akun kontributor dihubungkan ke data di menu Pimpinan (penulis artikel otomatis)? | Ya, bila orangnya tercatat di menu Pimpinan. | ✅ Ya (`User.leaderId`, diatur di halaman Pengguna) |
| D5 | Saat maintenance aktif, semua user panel boleh melihat website, atau hanya admin? | Semua user panel (agar kontributor bisa pratinjau artikel). | ✅ Semua user panel |
| D6 | Perlu pembatasan data per cabang (mis. kontributor Surabaya hanya melihat data Surabaya)? | Belum perlu. Galeri/Klien/Blog belum punya kolom cabang; ini tambahan cukup besar dan **di luar estimasi** dokumen ini. | ✅ Belum dikerjakan |

---

## ✅ 7. Tahapan Pengerjaan & Checklist

### Fase 1 — Fondasi Server (± 1,5–2 hari)

- [x] Buat `server/models/Role.ts`
- [x] Tambah field baru di `server/models/User.ts` (`isActive`, `leaderId`, `tokenVersion`, `lastLoginAt`, `createdBy`)
- [x] Buat katalog permission di `shared/permissions.ts` (katalog + type `Permission`)
- [x] Ubah payload JWT di `server/utils/auth.ts` menjadi `{ sub, tv }`
- [x] Ganti `server/utils/require-admin.ts` dengan `server/utils/require-auth.ts` (`requireAuth`, `requirePermission`, `requireSuperAdmin`, `hasPermission`)
- [x] Ganti logika di `server/middleware/admin-auth.ts` dengan tabel aturan + default-deny
- [x] Sesuaikan 12 handler yang memanggil `requireAdmin` langsung (lihat tabel 4.3)
- [x] Sesuaikan `server/middleware/maintenance.ts` dan `server/middleware/analytics.ts`
- [x] Ubah `login.post.ts` (cek `isActive` + role, isi `lastLoginAt`)
- [x] Ubah `me.get.ts` (kembalikan permission & info role)
- [x] Ubah `profile.put.ts` (`requireAuth`, `tokenVersion++` saat ganti password)
- [x] Seed role sistem `admin` di `server/plugins/seed.ts`
- [x] ~~Tambah `Role` ke `server/utils/backup-registry.ts`~~ → `roles` dikecualikan dari backup (lihat Catatan Implementasi)

### Fase 2 — Frontend Sadar Permission (± 1,5–2 hari)

- [x] Buat `composables/useAdminAuth.ts`
- [x] Tambah type `PageMeta.permission` di `types/`
- [x] Ubah `middleware/auth.ts` agar mengecek `to.meta.permission`
- [x] Tambah `permission` di `definePageMeta` semua halaman admin (tabel 4.6)
- [x] Filter menu di `AdminSidebar.vue`
- [x] Sesuaikan `AdminHeader.vue` (Inbox, link profil, nama role, breadcrumb)
- [x] Filter kartu & aksi cepat di `pages/admin/index.vue`
- [x] Buat `pages/admin/profile.vue`, pindahkan tab Profil dari `settings.vue`
- [x] Filter tab di `pages/admin/settings.vue`
- [x] Sembunyikan tombol aksi sesuai permission (blog, form blog, galeri, klien, dst.)

### Fase 3 — Kelola User & Role (± 2 hari)

- [x] API `server/api/admin/users/*` (list, create, update, delete, reset password)
- [x] API `server/api/admin/roles/*` (list, create, update, delete)
- [x] API `server/api/admin/permissions.get.ts`
- [x] Terapkan aturan pengaman (super admin terakhir, diri sendiri, eskalasi, validasi permission)
- [x] Halaman `pages/admin/users.vue`
- [x] Halaman `pages/admin/roles.vue` (matriks checklist)
- [x] Tambah menu Pengguna & Role di sidebar

### Fase 4 — Kepemilikan Data & Alur Publish (± 1–1,5 hari)

- [x] Tambah `createdBy`/`updatedBy` di `BlogPost` (dan `Gallery`, `Client` bila D2 = milik sendiri)
- [x] Isi `createdBy`/`updatedBy` di handler create/update
- [x] Batasi list/GET/PUT/DELETE blog ke milik sendiri bila tanpa `blog.manage_all`
- [x] Paksa status `draft` bila tanpa `blog.publish`
- [x] Kunci `leaderId`/`author` ke Pimpinan milik user bila tanpa `blog.manage_all`
- [x] Kunci `isFeatured` bila tanpa `blog.manage_all`
- [x] Sesuaikan `BlogPostForm.vue` (opsi status & dropdown penulis)

### Fase 5 — Pengujian (± 0,5–1 hari)

- [ ] Buat user uji untuk setiap role contoh di bagian 5
- [ ] Untuk setiap role: menu yang tampil sesuai tabel bagian 5
- [ ] Untuk setiap role: akses langsung via URL ke halaman terlarang → diarahkan ke `/admin`
- [ ] Untuk setiap role: panggil endpoint terlarang langsung (mis. via DevTools/curl) → 403
- [ ] Upload file ke endpoint terlarang → ditolak sebelum file diproses
- [ ] Nonaktifkan user yang sedang login → request berikutnya 401
- [ ] Reset password user yang sedang login → sesi lamanya mati
- [ ] Coba hapus/turunkan super admin terakhir → ditolak
- [ ] Coba ubah role diri sendiri → ditolak
- [ ] Endpoint publik (`/api/contacts/submit`, `/api/analytics/track`, `/api/blog/:slug/view`, GET konten publik) tetap bisa diakses tanpa login
- [ ] Mode maintenance: perilaku bypass sesuai keputusan D5
- [ ] Backup tidak memuat koleksi `users`

**Versi minimum** (role statis di kode, user dibuat via skrip, tanpa UI kelola user/role): Fase 1 + Fase 2 versi ringkas ≈ 2–3 hari.

---

## ⚠️ 8. Risiko & Hal yang Sering Terlewat

- **Proyek belum punya test otomatis.** Tabel aturan guard adalah bagian paling sensitif — satu regex yang salah bisa membuka endpoint. Sebaiknya fungsi pencocokan aturan diberi unit test kecil, ditambah uji manual Fase 5.
- **Menyembunyikan menu ≠ keamanan.** Semua batasan wajib ditegakkan di server.
- **Endpoint baru di masa depan harus didaftarkan ke tabel aturan.** Karena default-deny, endpoint yang lupa didaftarkan hanya bisa diakses super admin (aman), bukan terbuka.
- **Urutan cek izin vs upload.** Guard di server middleware berjalan sebelum body upload dibaca. Jangan memindahkan cek izin ke dalam handler setelah `receiveSingleImage`, supaya user tanpa izin tidak sempat mengunggah file.
- **Dependensi antar endpoint.** Satu halaman bisa memanggil beberapa endpoint (contoh: form blog memanggil kategori dan pimpinan). Saat menyusun role, pastikan semua endpoint yang dipanggil halaman itu ikut diizinkan.
- **Login ulang setelah deploy.** Karena format JWT berubah, informasikan ke semua user sebelum deploy.
