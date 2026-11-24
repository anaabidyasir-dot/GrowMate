# Arsitektur aplikasi

## Gambaran

GrowMate adalah SPA sederhana berbasis DOM rendering dan event delegation, tanpa bundler dan tanpa dependensi npm untuk runtime. `server.mjs` melayani `index.html`, berkas `src/*.js`, CSS, dan aset pada `assets/` melalui `127.0.0.1`.
2
```text
Browser
  ├─ index.html → src/app.js (navigasi, auth & state UI)
  ├─ src/data.js (persona serta konten awal)
  ├─ src/community.js (report, block, hidden, history & share URL)
  ├─ src/experiences.js (Opportunity & Ask Space)
  ├─ src/learning-ux.js (materi, bab, rating)
  ├─ src/campus.js (simulasi layanan & admin kampus)
  ├─ src/account-settings.js (perubahan email/password lokal)
  ├─ src/storage.js (akun/sesi di localStorage)
  ├─ src/media-store.js (lampiran IndexedDB)
  ├─ src/i18n.js (label antarmuka multi-bahasa)
  └─ CSS modular (styles → experiences → refinements → community)
```

## Penyimpanan data

- Data akun dan status sosial: `localStorage` per email pada origin yang sama.
- Lampiran dan media lebih besar: `IndexedDB`, dirujuk oleh key dari data akun.
- Direktori kampus uji: `localStorage` pada origin yang sama agar simulasi permintaan/persetujuan dapat dilakukan di browser tunggal.
- Cookie autentikasi, API multiuser, dan database server: **belum ada**.

## Alur laporan dan moderasi lokal

1. Tombol bendera mengisi konteks `kind` dan `id` target.
2. Validasi alasan menggunakan daftar terkontrol di `src/community.js`, simpan ringkasan laporan dan waktu pada akun lokal.
3. Modal kedua bertanya apakah konten ingin disembunyikan; jika target adalah pengguna, menawarkan blokir akun.
4. Pilihan tidak mempertahankan konten. Pilihan ya mengubah array `hidden` atau `blocked` lokal.
5. Beranda, Learning, dan Opportunity memfilter item pada saat render; Pengaturan menyediakan pemulihan.

Tidak ada panggilan jaringan atau petugas moderasi sungguhan dalam alur ini.

## Mengapa beberapa file CSS dipisah?

Kode berasal dari iterasi MVP bertahap. Agar perubahan tetap mudah diaudit tanpa mengganggu seluruh antarmuka, komponen dikelompokkan berdasarkan area (`experiences.css`, `learning-ux.css`, `community.css`) dan beberapa stylesheet penyesuaian. Refaktor CSS selanjutnya dapat menggabungkan aturan lama dan meniadakan override berulang setelah desain stabil. Jangan menganggap semua modul sudah dioptimalkan untuk skala produksi.

## Arah produksi

Server API, database dengan izin per pengguna, autentikasi/session server-side, media storage aman, moderasi, notifikasi, dan pemrosesan permintaan kampus diperlukan sebelum layanan publik. Lihat [ROADMAP.md](ROADMAP.md).
