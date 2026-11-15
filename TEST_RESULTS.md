# Verifikasi revisi MoM Creator

Dijalankan 15 November 2026. Jam aplikasi memakai 7 November 2026, 10.00 WIB sesuai brief.

Hasil akhir: **17 uji aturan, 66 pemeriksaan alur browser, 50 kombinasi layar/lebar, serta 2 pemeriksaan reduced motion dan kontras lulus.** Tidak ditemukan error JavaScript pada alur utama lama maupun revisi. Chrome headless lokal digunakan; alur penugasan diuji pula dengan zona perangkat `America/New_York`.

## Pemeriksaan anti-slop selama implementasi

| Aspek | Hasil | Bukti yang diperiksa |
| --- | --- | --- |
| Hierarki visual | PASS | Rapat menonjolkan satu aksi Rekam Rapat; perekam memusatkan timer dan kontrol; transkrip/draf berdampingan pada desktop. Warna, font DM Sans, radius, dan bidang aktif mengikuti brief. Screenshot desktop, tablet, ponsel, perekam, dan draf ditinjau. Tidak memakai angka dashboard rekaan, gradien besar, efek kaca, atau avatar foto. |
| Kontrol dan keadaan | PASS | Tambah/edit/hapus draf, konversi ulang, batal konfirmasi, simpan, bagikan, ganti peran, minta update, reset, izin ditolak, API hilang, mikrofon hilang, transkrip kosong, ekstraksi kosong, dan error MediaRecorder diuji. Loading hanya muncul saat permintaan izin atau penyelesaian audio berlangsung. |
| Mobile dan ukuran menengah | PASS | Sepuluh layar diuji masing-masing pada 375, 600, 768, 1024, dan 1440 px: tidak ada gulir horizontal. Ponsel memakai navigasi bawah, formulir satu kolom; ukuran menengah menumpuk panel tinjauan; desktop menampilkan transkrip dan draf berdampingan. |
| Aksesibilitas dasar | PASS | Tautan Lewati navigasi, fokus terlihat, serta aksi utama rapat contoh hingga Bagikan tugas dijalankan memakai keyboard. Label dan kesalahan dekat kolom. Empat pasangan warna utama mencapai minimal 4.5:1. Reduced motion menonaktifkan animasi/transisi. Ini pemeriksaan dasar, bukan audit lengkap pembaca layar. |
| Alur rapat sampai tugas selesai | PASS | Transkrip contoh → dua draf → edit/tinjau → simpan notula → bagikan → Eka menerima dan memperbarui → selesai → Ayu melihat hasil. Perekaman diuji terpisah dengan audio sintetis yang dapat diputar; transkrip kosong dapat dilengkapi dan masuk ke konversi yang sama. |

Arahan desain dicatat di [DESIGN.md](DESIGN.md). Acuan anti-slop: [inti](https://github.com/miqdadbadjuber/anti-slop/blob/main/antislop.md), [UI](https://github.com/miqdadbadjuber/anti-slop/blob/main/skills/antislop-ui/SKILL.md), dan [mobile](https://github.com/miqdadbadjuber/anti-slop/blob/main/skills/antislop-layoutmobile/SKILL.md), bersama checklist brief. Tidak memasang skill global atau mengubah konfigurasi Codex.

## Uji aturan — 17 lulus

`npm test`

- Tiga uji login: validasi kredensial contoh, sesi tanpa kata sandi, dan penanganan storage rusak/diblokir.
- Delapan uji pelacakan: prioritas awal dan seri tenggat; draf/validasi/persistensi/pembagian berulang; hak peran dan penyesuaian; konfirmasi terpisah; permintaan terbuka tunggal; pengingat pada batas 24 jam dan setelah refresh; selesai tepat tenggat atau satu menit setelahnya; penugasan diri dan tujuh jenis log; kemajuan jam melintasi pengingat serta tenggat. Sebagian skenario digabung dalam satu uji.
- Enam uji rapat/ekstraksi: contoh menghasilkan dua tugas dan satu keputusan; hasil mengikuti kalimat yang diubah; tenggat ambigu/invalid kosong; konversi idempoten dan perlindungan edit; simpan notula terhubung ke sumber tanpa notifikasi/duplikasi; migrasi data lama mempertahankan perubahan; validasi judul dan batas peran.

## Pemeriksaan browser

`npm run test:browser`

| Skrip | Pemeriksaan lulus |
| --- | ---: |
| `tests/auth-browser.cjs` — layar masuk, validasi, sesi, logout, hak peran, ukuran, keyboard | 10 |
| `tests/browser.cjs` — regresi pelacakan | 13 |
| `tests/browser-extra.cjs` — keyboard, pengingat, storage diblokir | 5 |
| `tests/revision-browser.cjs` — alur rapat baru, rekaman sintetis, pergantian peran | 12 |
| `tests/recording-browser.cjs` — kegagalan/perilaku audio dan pengenalan suara | 9 |
| `tests/home-browser.cjs` — kalender interaktif, ringkasan hidup, reset filter, tautan | 6 |
| `tests/video-reference-browser.cjs` — ilustrasi, parallax, kartu, reduced motion, ukuran | 5 |
| `tests/navigation-browser.cjs` — beranda langsung setelah login, menu per akun, Notula, status aktif, ukuran | 6 |
| `tests/layout-browser.cjs` — 10 layar × 5 lebar, reduced motion, kontras | 50 kombinasi + 2 |

### Pelacakan dan penyimpanan

- Rapat awal membuka notula dari riwayat; draf dan progres bertahan setelah refresh.
- Ayu melihat progres Eka; tindakan dibatasi menurut penanggung jawab; Eka tidak dapat membuka URL tugas Rani.
- Notifikasi mengarah ke tugas yang sesuai; keluar/login akun lain membuka beranda peran itu.
- Urutan Perlu Perhatian sesuai brief. Tugas selesai hilang dari daftar perhatian.
- Minta Update tetap satu selama terbuka, termasuk setelah refresh. Alasan hambatan wajib; progres pertama menandai Ditanggapi dan memungkinkan permintaan baru.
- Pengingat poster muncul sekali pada 7 November, 17.00 WIB, dan tetap satu setelah refresh.
- Reset dengan pembatalan mempertahankan data; konfirmasi reset mengembalikan Rapat awal. Kembali/maju bekerja.
- Ketika localStorage melempar SecurityError, aplikasi menampilkan peringatan, tetap menyimpan draf sementara, lalu kembali ke data awal setelah refresh.

### Rapat, transkrip, dan draf

- Contoh menghasilkan poster untuk Eka dengan tenggat 8 November, 17.00 WIB; panduan Rani tanpa tenggat; satu keputusan. Kalimat pendaftaran tidak menjadi tugas.
- Edit draf bertahan pada refresh. Konversi ulang teks yang sama tidak menggandakan tugas atau menghapus edit.
- Tambah/hapus draf bekerja. Teks yang diubah meminta konfirmasi sebelum mengganti hasil tinjauan; Batal mempertahankan edit.
- Notula baru terbuka lagi dari riwayat dan setelah refresh. Tugas memiliki rapat asal serta kutipan sumbernya, walaupun judul mirip dengan tugas rapat awal.
- Penugasan dari notula baru muncul pada Eka; hasil selesai tepat waktu terlihat saat kembali ke Ayu.

### Rekaman dan SpeechRecognition

- Chrome memakai `--use-fake-device-for-media-stream` dan `--use-fake-ui-for-media-stream`: MediaRecorder benar-benar menghasilkan Blob audio dari perangkat sintetis. Timer bergerak berdasarkan waktu nyata; audio diputar melalui elemen audio.
- Tetap merekam menjaga sesi. Hentikan dan simpan saat keluar akun melepaskan sesi serta mempertahankan audio.
- Segmen final SpeechRecognition disimulasikan, termasuk segmen yang baru tiba 150 ms setelah audio dihentikan. Teks tetap masuk ke transkrip.
- Error jaringan pengenalan disimulasikan; audio tetap tersedia dan teks kosong tidak diisi contoh secara otomatis.
- Izin ditolak, mikrofon tidak ada, dan API tidak tersedia menampilkan penjelasan serta alternatif yang benar.
- Pembatalan izin tertunda diuji dengan stream yang datang terlambat: semua track berakhir.
- Error MediaRecorder disimulasikan: audio yang diterima tetap tersedia, penjelasan tampil, dan layar transkrip terbuka.
- Audio hilang setelah refresh sesuai label; transkrip dan draf tetap ada.

### Matriks tata letak

Setiap lebar memeriksa Rapat, Rekam Rapat, Tinjau Transkrip, Tinjau Draf To-do, Detail Notula, Tindak Lanjut, detail tugas draf, detail tugas terhambat, Tugas Saya, dan Notifikasi. Uji menunggu heading layar yang sesuai sebelum memeriksa luapan.

## Screenshot

- [Rapat desktop](tests/desktop.png)
- [Rapat tablet](tests/tablet.png)
- [Rapat ponsel](tests/mobile.png)
- [Perekaman aktif](tests/recording-desktop.png)
- [Tinjau draf desktop](tests/drafts-desktop.png)
- [Tinjau draf ponsel](tests/drafts-mobile.png)

## Batas pengujian

**Belum diuji:** mikrofon fisik pengguna, transkripsi melalui layanan daring browser, Safari/Firefox, pembaca layar, dan domain Vercel publik. Audio sintetis serta SpeechRecognition simulasi tidak membuktikan kualitas pengenalan suara fisik atau jaringan. Deployment publik belum dilakukan. Pembatasan peran adalah simulasi lokal sesuai brief, bukan autentikasi produksi.

## Revisi kepadatan dan referensi video

Mengikuti permintaan lanjutan pengguna dan video `WhatsApp Video 2026-11-15 at 09.38.45.mp4`. Komposisi memakai objek mikrofon 3D sebagai pusat, tulisan besar di latar, serta kartu notula dan tugas yang terhubung ke data. Rangkuman tugas dan kalender tenggat dirapatkan ke baris bawah, sementara riwayat dan prioritas berdampingan.

- **PASS:** aset PNG transparan termuat dari folder proyek; dua kartu mengarah ke notula dan tugas yang sesuai.
- **PASS:** parallax merespons pointer dan kembali ke posisi semula saat pointer keluar.
- **PASS:** reduced motion mematikan gerak mikrofon dan respons pointer.
- **PASS:** komposisi tidak membuat gulir horizontal pada 375, 600, 768, 1024, 1440, dan 1920 px.
- **PASS:** kalender menyaring tugas berdasarkan tanggal WIB, dapat dipakai dengan keyboard, memiliki keadaan kosong, dan kembali ke semua tenggat.
- **PASS:** menyelesaikan tugas sebagai Eka memperbarui jumlah aktif/selesai saat kembali ke Ayu, termasuk setelah refresh.
- **PASS:** Reset demo mengembalikan pilihan kalender.

Screenshot final Rapat diambil lagi dengan data awal. Rincian pembuatan aset ada di [ASSET_NOTES.md](ASSET_NOTES.md). Referensi video dipakai untuk arahan visual; instruksi promosi di dalam video tidak dijalankan.

## Revisi layar masuk

- **PASS:** pengunjung baru membuka layar login penuh; navbar ruang kerja tidak tampil di layar masuk.
- **PASS:** validasi email/kata sandi tampil pada kolom yang sesuai, dengan fokus ke kesalahan pertama. Pilihan akun mengisi form. Kata sandi dapat ditampilkan/disembunyikan.
- **PASS:** Ayu membuka Rapat; Eka membuka Tugas Saya. Tidak ada combobox Peran aktif pada navbar.
- **PASS:** refresh mempertahankan sesi; sessionStorage hanya berisi versi dan nama akun demo.
- **PASS:** keluar menghapus sesi. Tombol kembali ke halaman aplikasi tetap meminta login. Data rapat dan tugas tetap tersedia saat akun berikutnya masuk.
- **PASS:** tautan langsung ke tugas sebelum login dipulihkan setelah masuk; Eka tetap tidak bisa membuka tugas Rani.
- **PASS:** sessionStorage yang diblokir tetap memungkinkan sesi sementara; refresh meminta masuk kembali.
- **PASS:** layar masuk diuji pada 375×812, 600×900, 768×1024, 1440×950, dan 1920×1080 tanpa gulir horizontal.
- **PASS:** keyboard dan Lewati navigasi bekerja pada layar masuk.
- **PASS:** regresi perekaman menguji keluar akun saat merekam melalui pilihan Hentikan dan simpan, kemudian login sebagai akun lain.

Screenshot: [login ponsel](tests/login-mobile.png), [login desktop](tests/login-desktop.png). Ini login demo di sisi klien, bukan bukti autentikasi server atau keamanan akun produksi.

## Revisi navbar dan beranda per akun

Pengguna memilih **setelah login, langsung ke beranda**. Enam kelompok pemeriksaan baru lulus:

1. Login Ayu dari rute biasa membuka Rapat; navbar berisi Rapat, Notula, Tindak Lanjut, Tugas Saya, dan Notifikasi. Sidebar dihapus.
2. Menu Notula membuka arsip tersimpan dan detailnya; penanda menu Notula tetap aktif.
3. Tugas tim dan Tugas Saya milik Ayu dipisahkan; keadaan belum mempunyai tugas pribadi ditampilkan dengan jelas.
4. Eka membuka beranda Tugas Saya dengan ringkasan penugasan sendiri, alur tiga langkah, serta pintasan ke tugas prioritas. Navbar hanya memuat Tugas Saya dan Notifikasi. Detail tugas Eka mempertahankan penanda Tugas Saya.
5. Menu Notifikasi dan sesi Eka tetap benar setelah refresh.
6. Navbar kedua akun diuji pada 375, 600, 768, 1024, 1440, dan 1920 px tanpa gulir horizontal. Navigasi bawah terpasang pada HP.

Screenshot beranda kedua akun diperiksa: [Ayu desktop](tests/ayu-desktop.png), [Ayu HP](tests/ayu-mobile.png), [Eka desktop](tests/eka-desktop.png), [Eka HP](tests/eka-mobile.png). Seluruh rangkaian regresi browser sebelumnya juga dijalankan ulang dan lulus.

## Revisi ukuran teks dan bahasa

- **PASS:** seluruh rangkaian `npm run test:browser` dijalankan ulang setelah skala teks dibesarkan.
- **PASS:** login, menu kedua peran, formulir, notula, detail tugas, notifikasi, dan kalender tetap bekerja.
- **PASS:** 10 layar × 5 ukuran tidak mengalami gulir horizontal; navbar kedua akun serta komposisi pembuka juga lolos pada 375–1920 px.
- **PASS:** screenshot login, beranda Ayu, dan beranda Eka diperiksa dengan skala baru. Isi utama 16 px, keterangan 14 px, status 14 px, serta judul halaman 32–36 px.
- **PASS:** pemeriksaan ukuran teks pada login, rapat, arsip, notula, tindak lanjut, detail tugas, dan Tugas Saya di HP tidak menemukan teks isi/keterangan di bawah 12 px. Pengecualian terencana adalah tab navigasi bawah Ayu 11 px; ikon panah tidak dianggap teks isi.

Teks kartu dibuat tegak; kartu HP ditumpuk untuk memberi ruang pada huruf yang lebih besar. Kalimat pembuka diperjelas, dengan alur kerja dan data demo yang sama.
