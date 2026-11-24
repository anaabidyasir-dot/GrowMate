# Panduan penggunaan GrowMate

## Masuk pertama kali

Jalankan `npm start`, kunjungi `http://localhost:3000`, lalu buat akun **Mahasiswa** dengan data percobaan. Simpan username dan password pengujian untuk masuk lagi pada browser yang sama.

## Navigasi dasar

- **Beranda:** baca postingan, berikan like, tulis komentar, simpan, atau bagikan. Klik nama penulis untuk melihat profilnya.
- **Learning:** pilih materi, baca bab, tandai bab selesai, bagikan materi sendiri jika diperlukan.
- **Opportunity:** telusuri kesempatan berposter, cek detail dan sumber, simpan, bagikan, atau kirim laporan.
- **Ask Space:** pilih mahasiswa, grup, atau contoh ruang kampus; kirim pesan atau permintaan chat dalam simulasi lokal.
- **Profil saya:** ubah bio, avatar, sampul; buka arsip dan statistik.
- **Pengaturan:** ubah preferensi, lihat riwayat interaksi, dan pulihkan konten yang disembunyikan.

## Melaporkan dan menyembunyikan

1. Klik ikon bendera pada postingan, materi, opportunity, atau profil publik anggota.
2. Pilih alasan laporan, isi keterangan opsional, lalu tekan **Simpan laporan**.
3. Aplikasi bertanya apakah item ingin disembunyikan (atau akun diblokir jika melaporkan akun).
4. **Tidak, tetap tampil**: konten tetap terlihat. **Ya, sembunyikan**: konten hilang dari katalog lokal.
5. Untuk mengembalikan, buka **Pengaturan → Riwayat aktivitas → Diblokir**, lalu pilih **Tampilkan lagi** atau **Buka blokir**.

Laporan **tidak dikirim** ke tim moderasi; pengubahan status hanya berlaku untuk akun/browser yang sedang dipakai.

## Berbagi konten

Tombol share menampilkan menu sistem pada perangkat yang mendukungnya atau menyalin URL. Tautan dapat dibuka, tetapi konten buatan pengguna tidak otomatis tersinkronisasi ke perangkat penerima sebelum ada backend.

## Pemecahan masalah

- Halaman kosong: pastikan server berjalan di terminal; hindari membuka berkas HTML langsung.
- Data tidak muncul di browser lain: itu batas penyimpanan lokal, bukan bug sinkronisasi.
- Media gagal: periksa ukuran dan format; kapasitas penyimpanan browser terbatas.
- Kesulitan menjalankan `npm`: gunakan `node server.mjs`.
