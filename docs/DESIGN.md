# Prinsip desain & HCI

## Tujuan interaksi

GrowMate dirancang untuk mengurangi hambatan ketika mahasiswa ingin mencari materi, memulai diskusi, atau memeriksa kesempatan. Bahasa utama sederhana, warna dan tipografi mengikuti identitas yang sudah ada.

## Keputusan UI/UX yang diterapkan

- **Kontrol ringkas di HP:** share, report, dan bookmark menggunakan ikon dengan `aria-label`/`title`. Tindakan berisiko memerlukan langkah konfirmasi.
- **Minimalkan pilihan pada kartu:** tombol *Sembunyikan* langsung dihapus. Pengguna baru menentukan hide setelah mengirim laporan; konfirmasi mempunyai pilihan jelas Ya/Tidak.
- **Kontrol pengguna:** preferensi sembunyikan dan blokir dapat dibatalkan melalui riwayat pada Pengaturan.
- **Informasi profil:** metrik postingan, materi, opportunity, dan pengikut disusun dalam empat kartu. Pada layar sempit metrik beralih ke dua kolom agar teks tidak terlalu padat.
- **Konsistensi:** komponen utama menggunakan pola tombol, margin, hierarki judul, dan warna serupa; aksi utama ditonjolkan dan aksi sekunder tidak mendominasi.
- **Aksesibilitas:** tombol ikon diberi nama aksesibel, fokus keyboard terlihat, dialog memiliki judul, dan target sentuh pada fitur baru diarahkan minimal sekitar 36–44 px.
- **Umpan balik status:** alur laporan membedakan pencatatan lokal dari pengiriman ke moderator; tidak ada klaim sukses server palsu.

## Hal yang masih perlu diuji dengan pengguna nyata

Uji task completion, waktu mencari materi, keterpahaman ikon bendera, mudah tidaknya menemukan riwayat, pembaca layar, pemakaian keyboard secara menyeluruh, kontras mode gelap, serta pengalaman pada perangkat dan jaringan terbatas. Tidak ada klaim hasil usability study di dokumen ini.
