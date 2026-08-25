# Deployment Hostinger

Proyek ini dijalankan sebagai aplikasi Nuxt SSR, bukan static site. Target yang
didukung adalah Hostinger Node.js Web App (Business/Cloud) atau Hostinger VPS.

## Build settings hPanel

- Framework: Nuxt.js
- Node.js: 22.x atau 24.x
- Build command: `npm run build`
- Start command: `npm run start`
- Port: `3000`
- Output directory bila diminta: `.output`
- Entry file bila diminta: `.output/server/index.mjs`

Hostinger menempatkan hasil build backend Nuxt pada
`/home/{username}/domains/{domain}/nodejs`. Karena folder build dapat diganti saat
redeploy, jangan menyimpan upload pengguna di dalamnya.

## Environment production

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
NUXT_PUBLIC_BASE_URL=https://domain-anda.com

MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER/kjpphjar
JWT_SECRET=rahasia-acak-minimal-32-karakter
JWT_EXPIRES_IN=7d
ANALYTICS_HASH_SECRET=rahasia-acak-berbeda-minimal-32-karakter

ADMIN_USERNAME=admin-production
ADMIN_PASSWORD=password-bootstrap-minimal-12-karakter
SEED_DEMO_DATA=false

UPLOADS_DIR=/home/USERNAME/domains/DOMAIN/uploads
TRUST_PROXY=true

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@domain-anda.com
SMTP_PASS=rahasia-email
MAIL_TO=alamat-penerima@domain-anda.com

WHATSAPP_NUMBER=628xxxxxxxxxx
```

Ganti `USERNAME` dan `DOMAIN` dengan nilai akun Hostinger. Buat folder `uploads`
sebagai sibling folder `nodejs` melalui File Manager atau SSH sebelum uji upload. Production sengaja
menolak upload bila `UPLOADS_DIR` kosong atau bukan path absolut.

`ADMIN_USERNAME` dan `ADMIN_PASSWORD` hanya dipakai untuk membuat akun pertama
pada database yang masih kosong. Setelah akun terbentuk, rotasi atau hapus nilai
bootstrap tersebut dari hPanel dan redeploy.

## Database dan backup

Gunakan MongoDB Atlas atau replica set lain yang mendukung transaction. Preview
restore dapat berjalan pada MongoDB standalone, tetapi commit restore ditolak
agar tidak menghasilkan pemulihan parsial.

Backup dari admin berisi data logical Extended JSON dan manifest upload. File
binary pada `UPLOADS_DIR` tidak masuk ke JSON, jadi folder tersebut harus ikut
backup Hostinger/File Manager secara terpisah.

## Verifikasi setelah deploy

1. Buka halaman publik dan pastikan SSR muncul di view-source.
2. Login ke `/admin/login`, lalu uji upload satu gambar galeri dan satu cover blog.
3. Pastikan URL `/uploads/...` dapat dibuka setelah restart dan setelah redeploy.
4. Uji formulir kontak sampai email diterima.
5. Periksa `/sitemap.xml`, `/robots.txt`, maintenance mode, dan dashboard analytics.
6. Jalankan preview backup/restore sebelum mengizinkan commit restore production.

Jika upload hilang setelah redeploy, hentikan penggunaan fitur upload dan
konfirmasi bahwa `UPLOADS_DIR` menunjuk ke folder persisten di luar `nodejs`, bukan
ke path relatif di dalam hasil build.
