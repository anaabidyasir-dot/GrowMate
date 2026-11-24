# Keamanan, privasi, dan batasan MVP

**GrowMate bukan aplikasi siap produksi.** Fitur login berjalan secara lokal: kata sandi di-hash menggunakan PBKDF2 dengan salt di browser, tetapi kepemilikan akun, role, sesi, laporan, dan akses konten **tidak divalidasi server**. Orang yang mengontrol browser/DevTools dapat mengubah datanya. Jangan gunakan akun atau data akademik asli untuk percobaan.

## Kontrol yang saat ini ada

- Server lokal hanya melayani `index.html`, script/style `src/`, dan berkas media `assets/`. Berkas seperti `.git/`, `.env`, `package.json`, serta dokumen internal tidak dilayani lewat URL aplikasi.
- Content Security Policy, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, dan pembatasan framing digunakan pada server.
- Input teks yang disisipkan ke markup di-*escape*. Tautan eksternal Opportunity diperiksa skema HTTPS dan menggunakan perlindungan `noopener`.
- Berbagai formulir menerapkan validasi ukuran/tipe file dan batas panjang input di sisi browser. Ini **bukan pengganti validasi server**.
- Tombol report menyimpan jenis, alasan, keterangan, dan waktu secara lokal; hide atau blokir dilakukan hanya setelah pilihan pengguna. Riwayat dapat dipulihkan sebagian.

## Risiko yang belum terselesaikan

1. **Identitas dan hak akses:** sesi/role mudah dimodifikasi di browser. Perlu autentikasi dan otorisasi server, MFA opsional, verifikasi institusi serta pembatasan akses per kampus.
2. **Moderasi:** laporan tidak terkirim, akun diblokir hanya secara lokal. Perlu antrean moderasi, *rate limiting*, mekanisme banding, audit log, dan perlindungan penyalahgunaan.
3. **Privasi dan retensi:** belum ada kebijakan penghapusan data lintas perangkat, kontrol ekspor data, atau enkripsi data pengguna di server.
4. **Media:** belum ada antivirus, scanning konten, penyimpanan objek aman, pembatasan server, atau pembersihan metadata media.
5. **Sinkronisasi sosial:** pengikut dan postingan lintas perangkat belum tersedia. Jumlah pengikut pada persona contoh adalah ilustrasi, bukan metrik aktif.
6. **Integrasi kampus:** tidak boleh menerima NIM atau dokumen mahasiswa asli sebelum aturan persetujuan, keamanan, dan tata kelola data dipenuhi.


