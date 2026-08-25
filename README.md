# KJPP HJA'R - Fullstack CMS & Company Profile

Selamat datang di repositori resmi untuk website **KJPP HJA'R**. Aplikasi ini sebelumnya berupa *static site* berbasis Vue 3 + Vite, dan kini telah di-upgrade secara menyeluruh menjadi aplikasi **Fullstack (Nuxt 3 + Node.js + MongoDB)** yang dilengkapi dengan sistem **Content Management System (CMS)** untuk mengelola seluruh konten website secara dinamis.

## 🚀 Fitur Utama

- **Company Profile Dinamis**: Halaman publik (Beranda, Tentang Kami, Layanan, Galeri, dll) yang kontennya dapat diperbarui langsung melalui Admin Panel tanpa perlu mengubah kode sumber.
- **Admin Panel (CMS)**: Halaman khusus Admin yang diamankan dengan *JWT (JSON Web Token)* dan *httpOnly cookies*.
- **Manajemen Layanan & Blog**: Terintegrasi dengan *Quill WYSIWYG Editor* untuk penulisan artikel dan deskripsi layanan dengan format *rich text*.
- **Upload & Image Processing**: Mendukung unggah gambar (logo klien, foto pimpinan, galeri, cover artikel) dengan proses auto-generate thumbnail menggunakan library `sharp` agar website tetap cepat.
- **Inbox Kontak**: Pengunjung dapat mengirim pesan melalui form Contact Us yang langsung tersimpan di database dan memunculkan notifikasi "Belum Dibaca" bagi Admin.
- **SSR (Server-Side Rendering)**: Menggunakan Nuxt 3 dengan mode *Universal Rendering* untuk SEO yang optimal dan performa tinggi.

## 🛠️ Tech Stack (Teknologi yang Digunakan)

- **Frontend**: Vue 3, Nuxt 3, TailwindCSS
- **Backend**: Nitro (Nuxt API Routes), Node.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Image Processing**: Multer, Sharp
- **Editor**: Quill Editor (@vueup/vue-quill)

## 📋 Prasyarat

Pastikan perangkat Anda telah terinstall:
- [Node.js](https://nodejs.org/en/) (Versi 18 atau ke atas)
- [MongoDB](https://www.mongodb.com/) (Lokal atau menggunakan MongoDB Atlas / Cloud)

## ⚙️ Cara Menjalankan Project (Local Development)

### 1. Install Dependencies
```sh
npm install
```

### 2. Setup Environment Variables
Salin file `.env.example` menjadi `.env` dan sesuaikan nilainya:
```sh
cp .env.example .env
```
Pastikan `MONGODB_URI` sudah menunjuk ke server MongoDB Anda yang aktif. (Contoh: `mongodb://localhost:27017/kjpphjar`).
Ganti `JWT_SECRET` dengan string unik dan panjang.

### 3. Jalankan Development Server
```sh
npm run dev
```
Website publik dapat diakses di: `http://localhost:3000`
Admin Panel dapat diakses di: `http://localhost:3000/admin/login`

> **Info bootstrap admin:** akun pertama hanya dibuat pada database kosong bila
> `ADMIN_USERNAME` dan `ADMIN_PASSWORD` (minimal 12 karakter) tersedia di environment.

## 📦 Build untuk Production (Hostinger)

Untuk menjalankan di Hostinger Node.js Web App:

1. **Build Project**
   ```sh
   npm run build
   ```
2. **Jalankan Aplikasi**
   Nuxt 3 akan menghasilkan file `.mjs` server di dalam direktori `.output`. Gunakan command berikut untuk menjalankan aplikasi:
   ```sh
   npm run start
   ```

Gunakan Node.js 22 atau 24, port `3000`, dan set semua environment variables di hPanel.
Panduan lengkap tersedia di [`docs/deployment-hostinger.md`](docs/deployment-hostinger.md).

---
*Dikembangkan dengan ❤️ untuk kelancaran operasional dan pembaruan informasi KJPP HJA'R.*
