# Skenario demonstrasi untuk penjurian

Panduan ini dirancang untuk menunjukkan fungsi yang **dapat diuji hari ini**. Semua data yang muncul dalam akun adalah data contoh pada perangkat review.

## Persiapan

1. Jalankan `npm start` dari folder proyek, kemudian buka `http://localhost:3000`.
2. Buat akun mahasiswa uji. Pakai email fiktif, misalnya `penguji@example.test`, dan kata sandi khusus demo.
3. Jika browser lama masih menyimpan akun sebelumnya, gunakan akun baru agar alur lebih mudah diperiksa.

## Alur demonstrasi sekitar 5–8 menit

1. **Beranda:** lihat feed diskusi; buka profil salah satu penulis. Profil publik menampilkan jumlah Postingan, Materi, Opportunity, dan **Pengikut**. Pengikut akun contoh merupakan angka ilustratif. Coba **Ikuti** untuk melihat perubahan di akun lokal.
2. **Konten:** klik ikon bendera di postingan. Pilih alasan, simpan, lalu pilih **Tidak, tetap tampil**. Ulangi pada postingan lain dan pilih **Ya, sembunyikan**. Tidak ada tombol sembunyikan langsung di feed.
3. **Learning Space:** buka materi, lihat detail bab, dan coba fitur bagikan serta laporkan. Setelah laporan disimpan, pilih apakah materi ditampilkan lagi atau disembunyikan.
4. **Opportunity:** perhatikan kartu dengan poster; dua contoh lama yang tidak memiliki poster sudah dihapus. Coba simpan, bagikan, lihat detail, dan laporkan satu opportunity.
5. **Pengaturan:** buka Riwayat aktivitas, lihat laporan dan konten yang disembunyikan. Coba **Tampilkan lagi** untuk memulihkan konten. Gunakan opsi **Buka blokir** jika diperlukan.
6. **Ask Space:** buka layanan kampus dan coba **Ajukan chat**. Perubahan hanya terjadi pada data lokal; tidak ada petugas kampus yang menerima pesan sungguhan.
7. **Profil saya:** ganti sampul atau avatar menggunakan gambar uji. Amati statistik di dalam kartu profil pada desktop, serta susunannya pada HP.

## Cara menjelaskan batasan dengan transparan

- Laporan dan blokir: lokal di browser, belum tersedia moderator maupun server.
- Jumlah pengikut profil contoh: ilustrasi, bukan metrik dari database nyata.
- Kontak kampus: ilustrasi untuk validasi alur. Akun kampus belum diverifikasi institusi.
- Ajakan dan chat: simulasi interaksi yang tersimpan lokal.
- Informasi beasiswa/lomba: sumber dan tenggat perlu diperiksa langsung; aplikasi tidak menjamin keaktifan kegiatan.

**Narasi singkat:** "GrowMate mempertemukan diskusi mahasiswa, materi, dan kesempatan pengembangan diri dalam satu antarmuka. MVP ini sudah memungkinkan alur penggunaan dan uji UI/UX, sedangkan sinkronisasi akun, moderasi, dan integrasi kampus direncanakan pada tahap backend."
