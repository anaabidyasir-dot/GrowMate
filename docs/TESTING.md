# Pemeriksaan kualitas

## Tes otomatis

Jalankan dari folder `GrowMate`:

```bash
npm test
```

Perintah menjalankan sepuluh skrip pemeriksaan berikut:

1. `community-smoke.mjs` — penyimpanan laporan, block, hide, riwayat, share link.
2. `revision-smoke.mjs` — registrasi, navigasi, posting, komentar, progres, ajakan.
3. `experience-smoke.mjs` — Opportunity, Ask Space, grup, dan alur kampus.
4. `learning-smoke.mjs` — editor, validasi teks, dan rating materi.
5. `cover-smoke.mjs` — gambar sampul.
6. `upgrades-smoke.mjs` — simulasi publikasi kampus dan perubahan akun.
7. `ui-upgrades-smoke.mjs` — fitur Pengaturan, bahasa/tema, kontrol UI.
8. `archive-fab-smoke.mjs` — arsip dan tombol tambah responsif.
9. `report-flow-smoke.mjs` — laporan → konfirmasi Ya/Tidak, blokir, pengikut.
10. `server-smoke.mjs` — server statis, batas berkas publik, dan header dasar.

Catatan: `npm test` menjalankan **10 skrip**. Penomoran daftar pemeriksaan di atas adalah sepuluh pengujian teknis yang terpisah (bukan persentase cakupan unit test). Lulus tes tidak menjamin sistem bebas celah keamanan atau cacat antarmuka.

## Pemeriksaan manual yang disarankan

- HP 320/375/390 px dan desktop 1024/1440 px; pastikan tidak ada *horizontal overflow* atau tombol bertumpuk.
- Buka popup profil publik; periksa empat metrik, urutan tab, dan aksi Ikuti/Blokir/Laporkan.
- Dari Beranda, Learning, dan Opportunity, periksa tidak ada tombol hide langsung. Uji dua pilihan setelah laporan dan pemulihannya di Pengaturan.
- Jalankan navigasi keyboard (`Tab`, `Enter`, `Escape`) dan pastikan label/kontras dapat dibaca pada tema terang serta gelap.
- Buka Console dan Network untuk mendeteksi error JavaScript, gagal memuat gambar/PDF, dan sumber yang tidak aman.
- Coba akun dan konten baru untuk memastikan data contoh lama tidak menutupi data pengguna baru.

## Pemeriksaan tampilan Chromium

Renderer Chromium menjalankan JavaScript dan CSS yang sama dari aplikasi dalam halaman pengujian lokal-in-memory. Pengujian mencakup lebar 320, 375, 390, 650, 768, 1024, dan 1440 px pada Beranda, Learning, Opportunity, Pengaturan, Profil, dan Ask Space. Hasil pemeriksaan tidak menemukan horizontal overflow maupun uncaught JavaScript error pada skenario tersebut. Pengujian server HTTP diperiksa terpisah melalui `server-smoke.mjs`; ini **bukan** audit end-to-end lintas browser/perangkat.

Screenshot hasil tersedia di `docs/screenshots/`.

## Status

Pengujian otomatis terakhir dilakukan saat penyusunan paket revisi ini (23 November 2026). Gunakan hasil `npm test` terbaru sebagai bukti pengujian ketika mengunggah ke GitHub. Tidak ada klaim hasil audit penetrasi atau pengujian pengguna yang belum dilakukan.
