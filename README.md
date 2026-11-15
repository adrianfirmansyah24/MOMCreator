# MoM Creator

Prototipe statis untuk alur **Masuk → Rapat → Rekam / Transkrip → Draf To-do → Notula → Penugasan → Pembaruan progres**. Mengikuti brief revisi dan referensi ungu dari pengguna. HTML semantik, CSS, dan JavaScript tanpa framework, backend, atau kunci API.

## Jalankan

Dari folder proyek:

```bash
python3 -m http.server 8000
```

Buka **http://localhost:8000/#/masuk**. Tidak perlu instalasi paket untuk menjalankan aplikasi. Gunakan server lokal ini, bukan membuka `index.html` melalui `file://`, agar modul JavaScript dan izin mikrofon dapat bekerja.

Pengunjung baru masuk melalui layar login demo. Pilih akun Ayu atau Eka untuk mengisi email dan kata sandi, lalu tekan **Masuk**. Ayu membuka Rapat; Eka membuka Tugas Saya. Untuk berganti akun, buka avatar profil → **Keluar akun**, lalu masuk kembali. Pengalih peran di navbar sudah dihapus. Navigasi memakai hash, termasuk dukungan kembali, maju, serta refresh. Rute lama `#/notula` dan `#/perlu-perhatian` tetap tersedia.

## Demo sejak awal

1. Masuk menggunakan akun demo **Ayu · Koordinator**, lalu pilih **Rekam Rapat**, lalu isi **Persiapan Webinar · Demo**.
2. Untuk demo konsisten, pilih **Gunakan Transkrip Contoh**. Materi fiktif diberi label. Alternatifnya pilih **Tempel Transkrip**, atau rekam mikrofon.
3. Klik **Buat Draf To-do**. Contoh menghasilkan satu keputusan dan dua draf: poster untuk Eka dengan tenggat 8 November 2026, 17.00 WIB; panduan moderator untuk Rani tanpa tenggat.
4. Tinjau keputusan, edit tugas, tambah/hapus baris bila perlu, lalu **Simpan Notula**. Belum ada notifikasi penugasan.
5. Buka tugas poster dari notula baru dan **Bagikan tugas**. Keluar lewat menu profil dan masuk sebagai Eka, lalu buka notifikasinya, pilih **Saya sanggup**, lalu **Mulai mengerjakan** atau **Tandai selesai**.
6. Keluar dan masuk kembali sebagai Ayu. Buka rapat baru dari riwayat untuk melihat hasil pada tugas yang sama. Asal rapat dan kutipan transkrip tetap terhubung.

Konversi ulang teks yang sama mempertahankan hasil tinjauan. Jika teks berubah, aplikasi meminta konfirmasi sebelum mengganti keputusan dan draf. Ekstraksi lokal mengenali penugasan eksplisit, bukan semua kalimat; tenggat ambigu tetap kosong. Ini bukan layanan AI.

## Mikrofon, audio, dan transkripsi

- **Mulai Rekam** meminta mikrofon setelah diklik. Timer memakai waktu mulai sebenarnya; level suara dihitung dari input Web Audio API. **Hentikan Rekaman** menghasilkan pemutar audio.
- Opsi **Buat transkrip otomatis** tersedia jika browser menyediakan `SpeechRecognition` atau `webkitSpeechRecognition`. Bahasa `id-ID`, tidak aktif secara default. Penjelasan bahwa browser dapat menggunakan layanan daring ditampilkan sebelum mulai.
- Audio dan pengenalan suara diproses terpisah. Kegagalan transkripsi mempertahankan audio. Segmen final yang diterima disimpan satu per baris; teks dapat dikoreksi. Tidak ada teks contoh yang dimasukkan diam-diam sebagai hasil mikrofon.
- Jika izin ditolak, mikrofon tidak ada, atau API tidak tersedia, penjelasan dan alternatif transkrip tetap ditampilkan.
- Pindah layar atau keluar akun selama merekam menawarkan **Tetap merekam** atau **Hentikan dan simpan**. Track mikrofon, timer, dan AudioContext dibersihkan setelah stop, pembatalan, atau kesalahan.
- Audio disimpan hanya di memori sesi. Pemutar menjelaskan bahwa audio hilang setelah refresh, sedangkan teks serta draf tetap tersimpan. Gunakan localhost atau HTTPS untuk perekaman.

## Data demo dan pelacakan

Jam awal **7 November 2026, 10.00 WIB**. Semua validasi dan pengingat memakai jam demo. Tenggat masukan dikonversi eksplisit ke UTC+07:00; tampilan memakai `Asia/Jakarta`, termasuk pada perangkat dengan zona lain. **Majukan waktu** menambah 1 jam atau 1 hari. **Reset demo** meminta konfirmasi.

Riwayat **Persiapan Webinar** memuat lima tugas awal sesuai brief: poster draf, materi pembicara terhambat, panduan moderator terhambat, tautan pendaftaran dikerjakan dan lewat tenggat, serta formulir diterima tanpa progres. Untuk memeriksa prioritas, buka **Tindak Lanjut**: materi → tautan → formulir → panduan.

Ayu dapat **Minta Update** pada formulir. Eka membuka notifikasi dan melaporkan hambatan “Akses untuk mengedit formulir belum diberikan.” Ayu melihat **Ditanggapi**. Konfirmasi kesanggupan tidak dihitung sebagai update progres. Permintaan terbuka tidak bisa dikirim ulang. Setelah progres dicatat, permintaan berikutnya tersedia.

Pengingat diterbitkan satu kali per tugas dan tenggat. Untuk poster dengan tenggat 8 November, 17.00 WIB, terima tugas lalu majukan jam ke 7 November, 17.00 WIB. Refresh tidak menggandakan pengingat. Tugas selesai tidak menerima pengingat baru. Indikator Lewat tenggat tetap terpisah dari status pekerjaan.

Ayu dapat menugaskan dirinya dan mengubah progres tugasnya sendiri. Eka hanya dapat membuka tugas serta notifikasinya. Alur login ini adalah simulasi lokal untuk prototipe. Kredensial akun contoh ada di sisi klien; belum ada autentikasi server.

## Penyimpanan dan kompatibilitas

`localStorage`, kunci `mom-creator-demo-v1`, menyimpan rapat, transkrip, keputusan, draf, tugas, notifikasi, log, dan jam demo. Data versi sebelumnya dimigrasikan dengan menambahkan hubungan ke rapat awal; perubahan tugas yang kompatibel tidak direset. Browser, profil, perangkat, dan origin lain mempunyai demo sendiri. `localhost` dan `127.0.0.1` adalah origin yang berbeda.

Jika storage diblokir, aplikasi tetap berjalan sementara dengan peringatan bahwa data hilang setelah refresh. Log lokal tersedia pada properti `logs`: `task_shared`, `task_accepted`, `progress_updated`, `attention_opened`, `update_requested`, `update_responded`, dan `task_completed`. Log terkait menyimpan kode tugas, waktu demo, tenggat awal, status sebelum/sesudah, atau asal rapat dan jumlah perhatian sesuai aktivitasnya.

## Struktur

```text
index.html
assets/styles.css
js/app.js
js/auth.js
js/auth-view.js
js/demo-data.js
js/state.js
js/meetings.js
js/meeting-views.js
js/recording.js
js/extract-todos.js
tests/
```

`recording.js` mengurus perangkat dan audio; `extract-todos.js` mengolah teks; `meetings.js` mengurus rapat/draf; `state.js` memvalidasi penugasan dan transisi. Teks pengguna di-escape saat masuk template, dan toast memakai `textContent`. Font DM Sans dimuat dari Google Fonts dengan font sistem sebagai cadangan.

## Pengujian

Uji aturan memakai Node.js tanpa paket tambahan:

```bash
npm test
```

Uji browser memakai Chrome dan Playwright Core; server port 8000 harus berjalan:

```bash
npm run test:browser
```

Pada mesin ini, Playwright Core yang sudah tersedia dipakai otomatis. Di mesin lain, pasang `playwright-core` lalu gunakan Chrome, atau tentukan `PLAYWRIGHT_MODULE` dan `CHROME_PATH`. Uji perekaman memakai perangkat audio sintetis Chrome; SpeechRecognition diuji melalui simulasi segmen dan error, tanpa mengirim audio ke layanan pengenalan daring.

Lihat [TEST_RESULTS.md](TEST_RESULTS.md) untuk hasil PASS/FAIL, cakupan, dan batasan. [DESIGN.md](DESIGN.md) mencatat arahan visual dari brief. Screenshot berada di folder `tests/`.

## Siap Vercel

`index.html` ada di tingkat teratas, aset memakai jalur relatif. `vercel.json` menetapkan situs tanpa framework, tanpa build, dan output `.`. Tidak perlu environment variable.

- Impor Git: Root Directory adalah folder ini, Framework Preset **Other**, Build Command kosong, Output Directory **.**.
- Unggah langsung: gunakan `mom-creator-vercel.zip` atau folder hasil ekstraknya. ZIP memuat `index.html`, `assets/`, `js/`, dan `vercel.json` di tingkat teratas.
- Sesudah deployment, uji ulang di URL HTTPS: izin mikrofon, alur rapat sampai tugas selesai, refresh halaman detail, dan tampilan ponsel. Data lokal tidak ikut berpindah ke domain publik.

Belum dipublikasikan ke Vercel. Perekaman fisik dan transkripsi daring perlu dicoba pada perangkat pengguna. Perubahan tenggat setelah penugasan, saran AI, prasyarat tugas, dan ringkasan rapat berikutnya tetap di luar cakupan sesuai brief.

## Tampilan dari referensi video

Halaman Rapat memakai komposisi mikrofon 3D di tengah, tulisan latar besar, kartu notula/tugas yang bisa dibuka, dan gerak pointer yang ringan. Kalender tujuh hari menyaring tenggat; ringkasan dan pembagian tugas mengikuti data demo. Desktop menempatkan riwayat dan prioritas berdampingan; ponsel menumpuknya.

Aset lokal: [`assets/microphone-studio.png`](assets/microphone-studio.png). Dibuat dengan built-in imagegen; prompt dan catatan alpha tersedia di [ASSET_NOTES.md](ASSET_NOTES.md). Screenshot final ada pada [desktop](tests/desktop.png), [tablet](tests/tablet.png), dan [ponsel](tests/mobile.png).

## Login dan sesi demo

| Akun | Email contoh | Kata sandi contoh | Halaman awal |
| --- | --- | --- | --- |
| Ayu · Koordinator | `ayu@mom.test` | `MomDemo2026!` | Rapat |
| Eka · PIC | `eka@mom.test` | `MomDemo2026!` | Tugas Saya |

Tombol akun pada layar masuk mengisi form secara otomatis; reviewer cukup memilih akun lalu menekan Masuk. Form memvalidasi email dan kata sandi serta menyediakan tampil/sembunyi kata sandi. Tidak ada pendaftaran atau pengiriman kredensial ke server.

Sesi disimpan di `sessionStorage` dengan kunci `mom-creator-session-v1`, hanya memuat nama identitas demo dan versi. Kata sandi yang diketik tidak disimpan. Logout menghapus sesi dan mempertahankan rapat/tugas lokal. Jika storage sesi diblokir, login berlaku sementara sampai refresh. Tautan tugas sebelum login dipulihkan setelah masuk; pemeriksaan hak peran tetap berlaku.

Layar login memakai seluruh viewport. Desktop menampilkan ilustrasi dan form berdampingan; ponsel memakai satu kolom dengan kontrol 44–51 px dan input 16 px. [Preview login ponsel](tests/login-mobile.png) · [Preview login desktop](tests/login-desktop.png).

## Beranda dan navbar setiap akun

Setelah login biasa, Ayu langsung membuka beranda Rapat yang menampilkan mikrofon, notula terakhir, dan ringkasan tindak lanjut. Navbar Ayu: **Rapat · Notula · Tindak Lanjut · Tugas Saya · Notifikasi**. Menu Notula membuka arsip rapat yang sudah disimpan, lalu detail notula terkait.

Eka langsung membuka **Tugas Saya**. Beranda pribadi menampilkan tugas prioritas, jumlah tugas yang perlu konfirmasi/masih aktif/selesai, serta alur **Terima tugas → Kerjakan → Kabarkan progres**. Navbar Eka: **Tugas Saya · Notifikasi**. Daftar dan ringkasannya hanya memakai penugasan milik Eka.

Desktop memakai navbar atas dan konten penuh tanpa sidebar; ponsel memakai navigasi bawah. Nama serta peran akun tercantum pada kepala aplikasi. Penanda menu aktif mengikuti halaman/detail yang dibuka. Keluar dan masuk akun lain tetap melalui avatar profil. Tautan langsung tugas/notifikasi tetap dapat dipulihkan setelah login.

[Preview Ayu desktop](tests/ayu-desktop.png) · [Ayu ponsel](tests/ayu-mobile.png) · [Eka desktop](tests/eka-desktop.png) · [Eka ponsel](tests/eka-mobile.png).

## Keterbacaan

`assets/readability.css` memusatkan skala teks agar perubahan desain tidak mengecilkan tulisan kembali: isi utama 16 px, keterangan 14 px, metadata minimal 12 px, serta judul halaman 32–36 px. Navbar ponsel memakai 11 px untuk lima menu dan 13 px untuk dua menu PIC, dengan ikon dan area sentuh yang lebih besar. Status, tenggat, formulir, dan tombol dibesarkan.

Kalimat pembuka disederhanakan menjadi “Rekam rapat. Bagikan tugas.” Kartu notula/tugas dibuat tegak, dan kartu pada HP ditumpuk agar teks tetap lapang. Font yang lebih besar tetap mendukung navigasi, role access, dan reduced motion.
