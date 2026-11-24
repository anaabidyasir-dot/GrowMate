export const CATEGORIES = [
  'Algoritma & Pemrograman', 'Matematika Diskrit', 'Sistem Digital',
  'Pengantar Teknologi Informasi', 'Desain Produk', 'Kewirausahaan', 'Lainnya'
];

// Nama dan deskripsi ringkas mengikuti materi persona dalam folder "Materi web/profile".
export const PEERS = [
  { id: 'kenzie', followersExample: 47, avatar: './assets/peers/L1.webp', bio: 'Mahasiswa Arsitektur yang tertarik desain ruang minimalis, kurasi galeri seni, dan tata pencahayaan interior.', name: 'Kenzie Raditya Pratama', username: '@kenzieraditya', program: 'Arsitektur', color: '#e2e8f1', ink: '#36475c', focus: 'Desain ruang dan kolaborasi kreatif' },
  { id: 'almira', followersExample: 82, avatar: './assets/peers/P3.webp', bio: 'Mahasiswi Manajemen Bisnis yang tertarik pada industri F&B, pemasaran kreatif, dan pengembangan UMKM.', name: 'Almira Syifa Kirana', username: '@almirakirana', program: 'Manajemen Bisnis', color: '#f4e5db', ink: '#8c4f35', focus: 'Brand strategy dan kewirausahaan' },
  { id: 'nayla', followersExample: 36, avatar: './assets/peers/P1.webp', bio: 'Mahasiswi Ilmu Kelautan yang tertarik pada ekosistem pesisir, konservasi terumbu karang, dan riset lapangan.', name: 'Nayla Azzahra Putri', username: '@nayla.azzahra', program: 'Ilmu Kelautan', color: '#d7ebef', ink: '#286b80', focus: 'Lingkungan pesisir dan riset lapangan' },
  { id: 'damian', followersExample: 59, avatar: './assets/peers/L4.webp', bio: 'Mahasiswa DKV yang mendalami desain karakter gim, ilustrasi digital, dan proyek kreatif.', name: 'Damian Ezra Kusuma', username: '@damianezra', program: 'DKV', color: '#e5e2f7', ink: '#594b94', focus: 'Ilustrasi digital dan game art' },
  { id: 'aurelia', followersExample: 65, avatar: './assets/peers/P2.webp', bio: 'Mahasiswi Psikologi yang senang berdiskusi tentang perkembangan remaja, perilaku, dan psikologi sosial.', name: 'Aurelia Calista Putri', username: '@aureliacalista', program: 'Psikologi', color: '#f5e5eb', ink: '#965c76', focus: 'Perilaku dan psikologi sosial' },
  { id: 'alvian', followersExample: 41, avatar: './assets/peers/L3.webp', bio: 'Mahasiswa Ilmu Hukum yang berfokus pada hukum bisnis, kajian perundang-undangan, dan legal drafting.', name: 'Alvian Mahendra Putra', username: '@alvianmahendra', program: 'Ilmu Hukum', color: '#e7ece9', ink: '#466f5a', focus: 'Riset hukum dan legal drafting' }
];

export const INITIAL_POSTS = [
  {id:'p6',authorId:'kenzie',type:'explore',category:'Pengantar Teknologi Informasi',title:'Menggunakan AI dengan tanggung jawab',body:'Infografis komunitas tentang penggunaan AI sebagai alat bantu belajar. Tetap periksa hasil, cantumkan sumber, dan kerjakan pemahamanmu sendiri.',media:'./assets/posts/ai-etika.webp',mediaName:'ai-etika.webp',created:'2026-11-21T09:00:00+07:00',helpful:6,comments:[]},
  { id:'p1', authorId:'damian', type:'explore', category:'Desain Produk', title:'Merancang antarmuka yang mudah dipahami', body:'Tiga prinsip yang kupakai saat menyusun tampilan aplikasi: hirarki yang jelas, teks yang terbaca, dan aksi utama yang tidak tersembunyi.', visual:'interface', created:'2026-11-20T09:15:00+07:00', helpful:24, comments:[{author:'Kenzie Raditya Pratama', text:'Contoh hierarkinya membantu banget.'}] },
  { id:'p2', authorId:'almira', type:'discussion', category:'Kewirausahaan', title:'Ada yang tertarik menyusun ide bisnis bareng?', body:'Lagi mengumpulkan ide usaha kecil berbasis masalah sehari-hari mahasiswa. Kalau punya sudut pandang desain, teknologi, atau pemasaran, boleh tulis di sini.', created:'2026-11-19T13:00:00+07:00', helpful:16, comments:[{author:'Nayla Azzahra Putri', text:'Bisa mulai dari riset kebutuhan mahasiswa dulu.'}] },
  { id:'p3', authorId:'kenzie', type:'explore', category:'Algoritma & Pemrograman', title:'Peta alur: dari masalah ke solusi', body:'Sebelum menulis kode, aku biasanya menggambar alur keputusan dan memecah masalah jadi bagian-bagian kecil.', visual:'flow', created:'2026-11-18T11:30:00+07:00', helpful:32, comments:[] },
  { id:'p4', authorId:'nayla', type:'discussion', category:'Pengantar Teknologi Informasi', title:'Cara membagi peran dalam proyek lintas jurusan?', body:'Bagaimana cara membagi tanggung jawab supaya riset, desain, dan pengembangan aplikasi bisa berjalan seimbang? Penasaran dengan pengalaman teman-teman.', created:'2026-11-17T15:20:00+07:00', helpful:19, comments:[] },
  {id:'p9',authorId:'kenzie',type:'discussion',category:'Pengantar Teknologi Informasi',title:'Komputasi cahaya: menarik, tapi cek sumbernya',body:'Ada infografis yang mengklaim chip berbasis cahaya akan jauh lebih cepat dari silikon. Sebelum percaya angkanya, aku ingin mencari publikasi riset asli: apakah hasilnya uji laboratorium, simulasi, atau produk yang siap dipakai?',media:'./assets/posts/chip-cahaya-diskusi.png',mediaName:'chip-cahaya-diskusi.png',created:'2026-11-23T09:15:00+07:00',helpful:18,comments:[{author:'Alvian Mahendra Putra',text:'Klaim angka tanpa metode pengujian memang sebaiknya diperiksa dulu.'}]},
  {id:'p10',authorId:'almira',type:'discussion',category:'Kewirausahaan',title:'Cara membaca kabar viral tentang saham teknologi',body:'Berita pasar bisa berubah cepat. Kalau melihat gambar tentang harga saham perusahaan teknologi, cek tanggal peristiwa, sumber berita, konteks pergerakan, dan laporan resminya. Gambar ini bahan diskusi, bukan rekomendasi investasi.',media:'./assets/posts/nvidia-berita-diskusi.png',mediaName:'nvidia-berita-diskusi.png',created:'2026-11-22T20:00:00+07:00',helpful:9,comments:[]},
  { id:'p7', authorId:'alvian', type:'discussion', category:'Pengantar Teknologi Informasi', title:'Checklist aman sebelum berbagi portofolio', body:'Kalau mengunggah proyek ke publik, cek dulu apakah ada API key, data pribadi, atau tautan internal yang tidak perlu ikut terbuka. Aku biasanya mulai dengan memeriksa file konfigurasi dan izin akses.', created:'2026-11-22T16:10:00+07:00', helpful:13, comments:[{author:'Damian Ezra Kusuma',text:'Penting juga memastikan kredit aset visual tertulis dengan jelas.'}] },
  { id:'p8', authorId:'almira', type:'explore', category:'Kewirausahaan', title:'Riset kecil untuk ide usaha mahasiswa', body:'Kami mewawancarai beberapa mahasiswa tentang kendala mencari rekan proyek. Hasil awalnya: lebih mudah mulai dari masalah yang spesifik, baru mencari fitur yang benar-benar dibutuhkan.', created:'2026-11-22T10:20:00+07:00', helpful:21, comments:[{author:'Nayla Azzahra Putri',text:'Setuju. Validasi ke calon pengguna membantu menghindari fitur yang tidak perlu.'}] },
  { id:'p5', authorId:'aurelia', type:'discussion', category:'Matematika Diskrit', title:'Tips belajar konsep logika tanpa menghafal?', body:'Aku lebih mudah memahami konsep lewat contoh sehari-hari. Kalau ada cara menjelaskan proposisi dan implikasi secara visual, boleh berbagi.', created:'2026-11-16T10:05:00+07:00', helpful:11, comments:[] }
];

export const INITIAL_MODULES = [
  {id:'m1',authorId:'kenzie',category:'Algoritma & Pemrograman',title:'Percabangan & Perulangan (If–Else, For, While)',summary:'Memahami alur kontrol program menggunakan kondisi dan pengulangan melalui contoh kasus dasar.',content:['Mengapa program perlu memilih jalur berbeda','Kondisi if, else if, dan else','Perulangan for dan while','Latihan membaca alur program'],duration:35,peers:['kenzie','damian'],progress:60},
  {id:'m2',authorId:'aurelia',category:'Matematika Diskrit',title:'Logika Proposisi, Tabel Kebenaran & Himpunan',summary:'Dasar penalaran matematis untuk memahami pernyataan, operator logika, dan hubungan himpunan.',content:['Proposisi dan operator logika','Membuat tabel kebenaran','Implikasi serta ekuivalensi','Operasi dasar himpunan'],duration:40,peers:['aurelia','alvian'],progress:35},
  {id:'m3',authorId:'damian',category:'Sistem Digital',title:'Sistem Bilangan Biner, Oktal & Heksadesimal',summary:'Konversi antar basis bilangan dan pengenalan gerbang logika digital.',content:['Sistem bilangan dan basis','Konversi biner dan desimal','Heksadesimal dalam komputasi','Gerbang AND, OR, dan NOT'],duration:35,peers:['damian'],progress:0},
  {id:'m4',authorId:'kenzie',category:'Pengantar Teknologi Informasi',title:'Arsitektur Komputer & Sistem Operasi Dasar',summary:'Pengenalan komponen CPU, hierarki memori, perangkat I/O, serta cara kerja sistem operasi.',content:['Komponen komputer','Memori dan penyimpanan','Proses di sistem operasi','Input dan output'],duration:45,peers:['kenzie'],progress:100},
  {id:'m6',authorId:'alvian',category:'Pengantar Teknologi Informasi',title:'Etika Digital dan Privasi Data',summary:'Mengenali izin aplikasi, jejak digital, dan kebiasaan aman saat menggunakan platform belajar.',content:['Data pribadi dan data publik','Memahami izin aplikasi','Mengenali tautan mencurigakan','Latihan audit privasi sederhana'],duration:30,peers:['alvian','aurelia'],progress:0},
  {id:'m7',authorId:'almira',category:'Kewirausahaan',title:'Validasi Ide Bisnis dengan Wawancara Pengguna',summary:'Menyusun pertanyaan yang tidak mengarahkan jawaban dan merangkum hasil riset awal.',content:['Merumuskan masalah pengguna','Menulis pertanyaan terbuka','Mencatat pola jawaban','Merangkum hipotesis bisnis'],duration:40,peers:['almira','damian'],progress:0},
  {id:'m5',authorId:'damian',category:'Desain Produk',title:'Dasar UX: Menyusun Alur Pengguna',summary:'Merancang alur yang masuk akal sebelum membuat layar dan komponen antarmuka.',content:['Memahami kebutuhan pengguna','Menulis skenario tugas','Menyusun user flow','Menguji prototipe sederhana'],duration:30,peers:['damian','kenzie'],progress:0}
];

// Opportunity cards now come from the reference catalog and user-shared entries.
export const INITIAL_OPPORTUNITIES = [];

export const INITIAL_ALERTS = [
  {id:'a1',title:'Cek agenda praktikum minggu ini',body:'Pastikan jadwal dan ruang praktikum sesuai informasi resmi dari dosen atau sistem akademik kampus.',accent:'coral'},
  {id:'a2',title:'Selesaikan rangkuman belajar',body:'Tinjau kembali catatan materi yang sedang dipelajari sebelum pertemuan berikutnya.',accent:'blue'}
];

export const INITIAL_SCHEDULE = [
  {id:'s1',time:'08.00–09.40',title:'Algoritma & Pemrograman',place:'Ruang belajar',topic:'Percabangan & perulangan'},
  {id:'s2',time:'10.00–11.40',title:'Matematika Diskrit',place:'Ruang belajar',topic:'Logika proposisi'},
  {id:'s3',time:'13.00–14.40',title:'Sistem Digital',place:'Ruang belajar',topic:'Representasi bilangan'}
];

export function initialAccount(me) {
  return {
    me: {...me, username:'@'+me.name.trim().toLowerCase().replace(/[^a-z0-9]+/g,'.').replace(/^\.|\.$/g,''), program:'Informatika', semester:'Semester 1', bio:'Belajar, berbagi ide, dan bertumbuh bersama.',description:'Sedang membangun kebiasaan belajar dan berkolaborasi lewat proyek kecil yang bermakna.',year:'2026', nim:'', avatar:''},
    posts:INITIAL_POSTS.map(p=>({...p,comments:p.comments.map(c=>({...c}))})),
    modules:INITIAL_MODULES.map(m=>({...m,content:[...m.content],peers:[...m.peers]})),
    opportunities:INITIAL_OPPORTUNITIES.map(o=>({...o,skills:[...o.skills]})),
    notes:[{id:'n1',title:'Target belajar minggu ini',body:'Review logika if/else dan rangkum materi Matematika Diskrit.'},{id:'n2',title:'Catatan kelompok',body:'Tentukan peran anggota dan tulis pertanyaan sebelum diskusi.'}],
    alerts:INITIAL_ALERTS.map(a=>({...a})), schedule:INITIAL_SCHEDULE.map(s=>({...s})),
    liked:[],saved:[],following:[],interested:[],readNotifications:[],
    settings:{reminder:true}
  };
}
