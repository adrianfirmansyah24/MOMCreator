# MoM Creator · Brief revisi prototipe web

Letakkan file ini dan dua gambar referensi yang diberikan di folder proyek. Buka foldernya dengan Codex lokal, lalu beri instruksi berikut.

> Baca `BRIEF_CODEX_MOM_CREATOR.md` dan kedua gambar referensi. Lanjutkan prototipe di folder ini. Buat alur Rekam Rapat → Transkrip → Draf To-do → Notula → Penugasan → Pembaruan progres. Terapkan arahan ungu dan pemeriksaan anti-slop dalam brief. Jalankan di localhost, uji kedua peran, dan siapkan folder untuk Vercel.

Acuan fungsi: [PRD MoM Creator · Kelompok 15, versi 1.1](https://docs.google.com/document/d/16nZnymA0dW2jb9anviKxJONAXa36wiNdxSrz-HcAE58/edit). PRD memulai pelacakan setelah notula tersedia. Untuk demo web, tambahkan perekaman, transkrip, dan konversi ke draf to-do sebagai tahap pembuka yang menyambung ke pelacakan. Sumber visualnya adalah referensi Lingua yang diberikan pengguna. Bagian desain di bawah memuat arahnya jika gambar belum ada di folder lokal.

## 1. Cakupan prototipe web

- Jika proyek lokal sudah ada, baca struktur dan perilakunya, lalu perluas alur yang ada. Pertahankan data demo yang masih kompatibel. Gunakan HTML semantik, CSS, dan JavaScript tanpa framework. Jika proyek baru, mulai dari `index.html`, aset CSS, dan modul JavaScript kecil.
- Tampilan awal Koordinator adalah **Rapat**, dengan **Rekam Rapat** sebagai aksi utama. Pengguna juga dapat membuka riwayat rapat dan melanjutkan notula yang sudah tersedia.
- Gunakan navigasi hash agar tombol kembali, maju, dan refresh bekerja di hosting statis. Contoh: `#/rapat`, `#/rapat/baru`, `#/rapat/<kode>/transkrip`, `#/rapat/<kode>/notula`, `#/tindak-lanjut`, `#/tugas-saya`, `#/notifikasi`, dan `#/tugas/<kode>`. Jika repo sudah punya pola rute yang bekerja, ikuti pola itu.
- Simpan rapat, transkrip, keputusan, tugas, pemberitahuan, log, dan jam demo di `localStorage`. Kedua peran membaca kumpulan tugas yang sama pada browser dan origin yang sama. Data browser lain terpisah. Jika penyimpanan diblokir, jalankan dengan penyimpanan sementara dan jelaskan dampaknya pada refresh.
- Peran dipilih lewat pengalih tampilan. Prototipe memakai data fiktif dan notifikasi dalam aplikasi. Siapkan situs statis tanpa kredensial, kunci API, atau backend. Saran Tindak Lanjut berbantuan AI, perubahan tenggat setelah penugasan, pemetaan tugas prasyarat, dan ringkasan rapat berikutnya mengikuti roadmap PRD. Permintaan penyesuaian boleh dicatat sambil mempertahankan tenggat yang sudah berlaku.

## 2. Rekam rapat sampai draf to-do

Alurnya **Rapat → Rekam Rapat → Tinjau Transkrip → Buat Draf To-do → Simpan Notula → Bagikan Tugas**. Saat berganti layar dari rekaman ke transkrip, isi dan konteks rapat tetap tersedia.

| Layar | Isi dan tindakan |
| --- | --- |
| Rapat | Tampilkan rapat terakhir, tanggal, jumlah tugas per rapat yang berasal dari data nyata demo, dan tombol **Rekam Rapat**. Riwayat membuka notula terkait. |
| Rekam Rapat | Judul rapat, pilihan **Buat transkrip otomatis** bila tersedia, tombol **Mulai Rekam**, dan alternatif **Gunakan Transkrip Contoh** atau **Tempel Transkrip**. Saat merekam, tampilkan waktu berjalan, status teks **Sedang merekam**, visual level suara, dan tombol **Hentikan Rekaman**. |
| Tinjau Transkrip | Sesudah berhenti, tampilkan pemutar audio bila rekaman tersedia dan kotak teks yang bisa diedit. Tampilkan sumber secara jujur seperti **Dari mikrofon**, **Transkrip ditempel**, atau **Transkrip contoh**. Tombol **Buat Draf To-do** aktif setelah transkrip berisi teks. |
| Tinjau Draf To-do | Tampilkan keputusan yang dicatat dan baris tugas dari transkrip. Ayu bisa menambah, mengedit, atau menghapus baris. Pada tiap draf tersedia judul, satu penanggung jawab opsional, tenggat opsional, serta kutipan sumber jika berasal dari transkrip. |
| Detail Notula | Simpan rapat, keputusan, serta tugas draf yang sudah ditinjau. Setiap tugas bisa dibuka dari daftar. Dari detail, Ayu melengkapi data wajib dan memilih **Bagikan Tugas** untuk tiap tugas yang siap. |

### Mikrofon dan transkripsi

- **Mulai Rekam** meminta izin mikrofon setelah pengguna menekan tombol. Gunakan `navigator.mediaDevices.getUserMedia({ audio: true })` dan `MediaRecorder`. Uji di localhost atau situs HTTPS. Hitung durasi dari waktu mulai sebenarnya. Jika ada visual level suara, ambil datanya dari audio yang benar-benar masuk melalui Web Audio API. Indikator statis dan timer sudah cukup bila level suara tidak tersedia.
- Rekaman menghasilkan audio yang dapat diputar ulang. Pakai tipe audio yang didukung browser. Untuk demo, simpan audio di memori sesi dan simpan teks serta drafnya di penyimpanan lokal. Jika audio hanya bertahan selama sesi, beri label singkat di dekat pemutar. Lepaskan track mikrofon dan bersihkan timer saat selesai, dibatalkan, atau terjadi kesalahan. Saat pengguna mencoba pindah layar, tawarkan pilihan Tetap merekam atau Hentikan dan simpan.
- Gunakan `SpeechRecognition` atau `webkitSpeechRecognition` bila browser menyediakannya. Atur bahasa `id-ID`. Sebelum mulai, beri pilihan transkripsi otomatis dan jelaskan bahwa browser dapat memakai layanan pengenalan suara daring. Mulai pengenalan setelah pengguna memilih opsi tersebut. Simpan segmen final yang benar-benar diterima, satu segmen per baris agar teks tetap dapat diolah saat browser tidak memberi tanda baca. Saat pengenalan berhenti atau luput menangkap sebagian, pertahankan teks yang sudah ada dan izinkan koreksi. Audio dan transkripsi berjalan sebagai kemampuan terpisah, sehingga kegagalan transkripsi tidak menghapus rekaman yang berhasil. Fitur mikrofon menangkap audio yang sampai ke mikrofon perangkat.
- Saat izin ditolak, mikrofon tidak ada, pengenalan suara tidak tersedia, atau hasil pengenalan kosong, jelaskan keadaan yang sebenarnya. Tawarkan **Tempel Transkrip** dan **Gunakan Transkrip Contoh** pada tempat yang sama. Mode contoh memakai materi fiktif yang diberi label sejak dipilih dan menjalankan konversi to-do yang sama dengan teks yang ditempel. Jangan muncul tiba-tiba sebagai hasil rekaman pengguna.
- Gunakan status proses hanya ketika pekerjaan berlangsung. Jika pemrosesan lokal selesai seketika, langsung tampilkan draf. Tombol berhenti, ulang, dan simpan harus tetap jelas saat permintaan izin atau pengolahan audio gagal.

### Konversi teks menjadi to-do

Buat ekstraksi lokal berbasis aturan sederhana. Pisahkan teks ke kalimat atau baris, lalu ambil calon tindakan yang eksplisit seperti **Eka, tolong siapkan ...**, **Tugas: ...**, atau **Rani perlu ...**. Ambil nama hanya jika muncul di kalimat yang sama dan cocok dengan daftar anggota. Isi tenggat hanya bila tanggal dan jam dapat dibaca dengan jelas sebagai WIB. Frasa seperti **nanti**, **habis itu**, atau **besok** tanpa jam tampil sebagai **Belum ditetapkan**. Kalimat latar belakang biasa tetap tersedia di transkrip. Buat bagian keputusan dari kalimat eksplisit seperti **Keputusan: ...**, dan izinkan isi keputusan diedit. Kalimat yang tidak dikenali masih bisa dijadikan tugas lewat **Tambah tugas**.

Pakai kalimat ini sebagai data contoh untuk pengujian.

```text
Keputusan: Poster webinar perlu memuat foto pembicara.
Eka, tolong siapkan poster webinar paling lambat 8 November 2026 pukul 17.00 WIB.
Rani perlu menyusun panduan moderator.
Pendaftaran sempat dibahas dalam rapat.
```

Hasilnya dua draf. **Siapkan poster webinar** mempunyai penanggung jawab Eka dan tenggat 8 November 2026 pukul 17.00 WIB. **Susun panduan moderator** mempunyai penanggung jawab Rani dan tenggat belum ditetapkan. Kalimat mengenai pendaftaran tetap menjadi teks transkrip. Judul draf boleh dibersihkan dari awalan penugasan, nama, dan frasa tenggat.

Semua hasil masuk sebagai **Draf**, dapat ditinjau, dan belum mengirim notifikasi. Menekan konversi berulang pada teks yang sama tidak menggandakan tugas. Jika teks berubah setelah draf diedit, utamakan draf yang sudah ditinjau dan minta konfirmasi sebelum menggantinya. Buka hasil simpan dari riwayat rapat. Draf tetap terhubung ke rapat asal dan kutipan sumbernya.

Rujukan implementasi: [Izin dan akses mikrofon](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) · [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) · [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

## 3. Dua peran dalam satu aplikasi

Buat pilihan yang jelas di bagian atas, **Koordinator · Ayu** dan **PIC · Eka**. Pada tampilan, jelaskan satu kali bahwa PIC adalah penanggung jawab tugas. Tampilan awal Ayu adalah Rapat, dan tampilan awal Eka adalah Tugas Saya. Bila tautan tugas dibuka lewat notifikasi milik peran yang sesuai, pertahankan konteks tugasnya.

| Peran | Layar | Yang dapat dilakukan |
| --- | --- | --- |
| Koordinator · Ayu | Rapat | Mulai rekaman, gunakan transkrip, tinjau draf to-do, dan buka notula yang tersimpan. |
| Koordinator · Ayu | Detail Notula | Baca keputusan dan daftar tugas, buka tugas, isi judul/deskripsi, pilih satu penanggung jawab dari tim, pilih tenggat, simpan draf, atau bagikan tugas. |
| Koordinator · Ayu | Tindak Lanjut | Lihat Perlu Perhatian, semua tugas rapat, filter status, tenggat, waktu pembaruan terakhir, dan alasan hambatan. Buka detail untuk memakai Minta Update. |
| PIC · Eka | Tugas Saya | Lihat tugas yang sudah dibagikan kepadanya, konfirmasi kesanggupan, minta penyesuaian, ubah status, dan tulis alasan hambatan. |
| PIC · Eka | Notifikasi | Lihat penugasan, permintaan pembaruan, dan pengingat tenggat jika memenuhi syarat. Pilih notifikasi untuk membuka detail tugas tersebut. |

Ayu bisa menjadi penanggung jawab tugasnya sendiri. Bila Ayu menugaskan dirinya, tampilkan **Tugas Saya** dan **Notifikasi** miliknya juga dalam peran Ayu. Batasi tindakan lewat fungsi aplikasi. Ayu hanya bisa mengubah progres tugas bila ia penanggung jawabnya. Eka hanya melihat penugasan dan notifikasi miliknya. Tautan tugas yang tidak tersedia bagi peran aktif perlu memberi pesan singkat dan jalan kembali.

## 4. Aturan yang menentukan perilaku aplikasi

### Penugasan dan status

- Data yang kosong pada notula tampil sebagai **Belum ditetapkan**. Draf boleh belum lengkap dan penyimpanannya tidak memicu notifikasi. Untuk membagikan tugas, wajib ada judul, tepat satu anggota tim, dan tanggal serta jam tenggat yang lebih besar dari waktu demo saat klik. Tampilkan pesan pada kolom terkait saat validasi gagal.
- Pembagian berhasil mengubah status menjadi **Menunggu konfirmasi**, membuat satu notifikasi penugasan, dan menampilkan tugas di Tugas Saya milik penerima. Lindungi operasi agar klik ganda dan pemuatan ulang tidak membuat duplikat.
- **Saya sanggup** mencatat waktu konfirmasi dan mengubah status menjadi **Belum dimulai**. **Minta penyesuaian** wajib disertai alasan, menampilkan status **Perlu penyesuaian**, dan dapat dibaca Ayu. Bila Eka kemudian menyatakan sanggup, simpan konfirmasinya. Ketiadaan tanggapan mempertahankan status **Menunggu konfirmasi**.
- Setelah tugas diterima, Eka bisa memilih **Mulai mengerjakan**, **Laporkan hambatan**, atau **Tandai selesai** sesuai keadaan tugas. Simpan pembaruan status dan waktunya. Saat memilih **Terhambat**, alasan wajib diisi. Dari **Terhambat**, tampilkan tindakan **Lanjutkan pekerjaan**. Kedua peran membaca alasan dan waktu pembaruan dari detail tugas yang sama.
- Simpan waktu konfirmasi, waktu pembaruan progres terakhir, dan waktu selesai secara terpisah. Jika belum ada pembaruan progres, tampilkan **Belum ada update progres** bersama status terakhir.
- **Lewat tenggat** adalah indikator waktu pada tugas yang sudah dibagikan dan belum selesai ketika waktu demo melewati tenggat. Pertahankan pula status terakhir. Tugas yang ditandai selesai pada atau sebelum tenggat tampil sebagai **Selesai · Tepat waktu**. Jika setelah tenggat, tampilkan **Selesai · Terlambat**. Simpan tenggat awal untuk metrik.

### Perlu Perhatian

Ambil tugas yang sudah dibagikan dan belum selesai. Jika tugas memenuhi beberapa kondisi, ambil prioritas tertinggi. Tampilkan alasan dengan bahasa yang konkret, misalnya **Terhambat · Tenggat dalam 6 jam**.

| Urutan | Kondisi |
| --- | --- |
| 1 | Tugas terhambat yang sudah lewat tenggat atau jatuh tempo dalam 24 jam ke depan. |
| 2 | Tugas aktif lainnya yang sudah lewat tenggat. |
| 3 | Tugas terhambat lainnya, atau tugas aktif lainnya yang jatuh tempo dalam 24 jam ke depan. |

Dalam tingkat yang sama, urutkan tenggat paling awal, lalu waktu penugasan paling awal. Perlakukan tenggat tepat pada waktu demo sebagai jatuh tempo sekarang. Ayu tetap memilih tugas yang ia tangani. Di daftar umum, sediakan filter seperti **Semua**, **Menunggu konfirmasi**, **Dikerjakan**, **Terhambat**, dan **Selesai**.

### Minta Update dan pengingat

- Ayu bisa memilih **Minta Update** pada tugas yang sudah dibagikan dan belum selesai, termasuk saat progres terakhir kosong. Simpan waktu permintaan. Buat satu notifikasi yang ditujukan kepada penanggung jawab dan membuka detail tugas terkait. Jangan ubah status tugas.
- Selama permintaan belum ditanggapi, tampilkan **Menunggu pembaruan** dan waktu kirim. Cegah permintaan dan notifikasi ganda. Saat penanggung jawab pertama kali menyimpan pembaruan progres setelah permintaan, catat waktu tanggapan dan tandai permintaan **Ditanggapi**. Konfirmasi kesanggupan adalah catatan terpisah. Permintaan berikutnya tersedia setelah ada tanggapan, selama tugas masih aktif.
- Untuk tugas yang sudah diterima dan belum selesai, simulasi menerbitkan pengingat satu kali saat jam demo mencapai atau melintasi titik 24 jam sebelum tenggat. Gunakan penanda permanen per tugas dan tenggat untuk mencegah duplikasi. Bila tugas baru diterima saat tersisa kurang dari 24 jam dan belum lewat tenggat, tampilkan **Tenggat dekat** sekali. Tugas selesai menghentikan pengingat berikutnya. Catatan lama boleh tetap ada di Notifikasi.
- Saat notifikasi dibuka, tandai sudah dibaca dan arahkan ke tugas terkait. Untuk permintaan update yang diterima Eka saat masih menunggu konfirmasi, Eka bisa menyatakan sanggup sebelum mencatat progres.

## 5. Data contoh dan demo

Sediakan jam demo awal **7 November 2026, 10.00 WIB**. Gunakan `Asia/Jakarta` untuk tampilan. Ubah masukan tanggal dan jam menjadi waktu WIB secara eksplisit agar hasilnya konsisten walaupun perangkat penguji memakai zona lain. Sediakan **Majukan waktu** dengan pilihan 1 jam atau 1 hari dan **Reset demo** dengan konfirmasi. Seluruh validasi dan aturan waktu memakai jam demo yang sama. Gunakan data awal berikut. Ayu dapat memakai riwayat ini untuk menguji pelacakan secara langsung atau membuat rapat baru untuk menguji alur sejak awal.

| Tugas | Penanggung jawab | Tenggat awal, WIB | Keadaan awal |
| --- | --- | --- | --- |
| Siapkan poster webinar | Belum ditetapkan | Belum ditetapkan | Draf. Ayu memilih Eka dan menetapkan 8 November 2026, 17.00 saat demo. |
| Finalisasi materi pembicara | Eka | 7 November 2026, 16.00 | Terhambat. Alasan: “Biodata pembicara belum lengkap.” |
| Susun panduan moderator | Rani | 10 November 2026, 12.00 | Terhambat. Alasan: “Susunan acara belum dikonfirmasi.” |
| Periksa tautan pendaftaran | Eka | 7 November 2026, 09.00 | Dikerjakan. Muncul dengan indikator Lewat tenggat. |
| Siapkan formulir pendaftaran | Eka | 8 November 2026, 09.00 | Sudah diterima, Belum dimulai, belum ada update progres. |

Gunakan rapat **Persiapan Webinar** sebagai sumber. Isi notula secara singkat, misalnya keputusan bahwa poster memerlukan foto pembicara dan tim harus memastikan tautan pendaftaran siap. Pakai nama yang sama di semua layar. Rani hanya contoh anggota lain untuk menguji penyaringan dan prioritas.

### Alur dari awal untuk presentasi

1. Sebagai Ayu, pilih **Rekam Rapat** dan isi judul **Persiapan Webinar · Demo**. Jika mikrofon dan transkripsi tersedia, rekam dan bacakan contoh singkat di bagian 2. Berhenti, putar ulang audio, dan koreksi teks bila diperlukan. Untuk demo yang konsisten di perangkat lain, pilih **Gunakan Transkrip Contoh** sejak layar rekam.
2. Pilih **Buat Draf To-do**. Periksa dua draf dan tenggat Rani yang belum ditetapkan. Simpan notula. Dari notula baru, buka tugas poster dan bagikan ke Eka. Buka **Tugas Saya** atau notifikasi sebagai Eka untuk menerima dan memperbarui tugas. Kembali sebagai Ayu untuk melihat hasilnya.
3. Untuk melihat urutan prioritas dengan data yang sudah disiapkan, pakai rapat **Persiapan Webinar** dari riwayat. Setiap tugas tetap menunjuk ke rapat asalnya meskipun judulnya mirip.

### Uji pelacakan dengan data awal

1. Sebagai Ayu, buka Detail Notula dan pilih **Siapkan poster webinar**. Tetapkan Eka dan tenggat 8 November pukul 17.00. Simpan draf, lalu pilih **Bagikan tugas**.
2. Ganti ke Eka. Buka notifikasi tugas, pilih **Saya sanggup**, lalu **Mulai mengerjakan**. Ganti ke Ayu untuk memeriksa status dan waktu pembaruan. Kembali sebagai Eka dan pilih **Tandai selesai**. Ayu melihat hasil tepat waktu.
3. Sebagai Ayu, buka **Perlu Perhatian**. Di data awal, Finalisasi materi pembicara muncul di atas Periksa tautan pendaftaran, lalu diikuti Siapkan formulir pendaftaran dan Susun panduan moderator. Formulir mendahului panduan karena keduanya ada di tingkat 3 dan tenggat formulir lebih awal.
4. Gunakan **Minta Update** pada Siapkan formulir pendaftaran. Ganti ke Eka, buka notifikasinya, lalu laporkan hambatan “Akses untuk mengedit formulir belum diberikan.” Kembali sebagai Ayu untuk melihat alasan dan status **Ditanggapi**.

Jika mendemokan pengingat, setelah Eka menerima tugas poster, majukan waktu melewati 7 November pukul 17.00 WIB dan periksa satu pengingat. Untuk memastikan kasus selesai sebelum pengingat, mulai ulang skenario dan selesaikan poster sebelum waktu itu.

## 6. Desain ungu dan interaksi

Bagian ini adalah arahan desain proyek. Gunakan tampilan Lingua sebagai acuan untuk latar terang, aksen ungu, kartu yang lapang, navigasi ponsel, dan tombol mikrofon sebagai pusat perhatian. Terapkan hierarki itu ke konteks rapat. Isi produk tetap tentang notula, tugas, status, dan hambatan.

### Tampilan

- **Warna.** Gunakan latar `#F8F7FC`, bidang `#FFFFFF`, teks utama `#201A31`, teks sekunder `#625A73`, garis `#E8E3F2), aksen utama `#6241C8`, dan bidang pilihan aktif `#F0EAFE`. Ungu menandai aksi utama, tab aktif, fokus, dan rekaman. Status terlambat, terhambat, dan selesai memakai label teks beserta warna yang konsisten.
- **Tipografi.** Gunakan DM Sans untuk judul dan isi, dengan font sistem sebagai cadangan. Ukuran dasar 15–16 piksel. Utamakan judul halaman yang tegas, metadata tenang, serta tenggat dan status yang bisa dibaca sekilas. Gunakan angka tabular untuk timer.
- **Bentuk.** Terapkan radius sekitar 10 piksel pada input, 12 piksel pada tombol, dan 16–18 piksel pada panel utama. Panel rapat aktif dan tombol mikrofon boleh lebih ekspresif. Gunakan batas tipis untuk daftar. Pakai bayangan tipis pada dialog atau elemen yang terangkat. Tampilan cukup menggunakan ikon garis yang seragam dan inisial untuk Ayu atau Eka.
- **Komposisi.** Pada layar Rapat, satu panel ungu muda menonjolkan **Rekam Rapat**, lalu riwayat tampil sebagai baris yang mudah dipindai. Layar perekam menaruh timer dan tombol mikrofon di tengah. Pada desktop, Transkrip dan Draf To-do bisa berdampingan jika keduanya mendapat ruang yang cukup. Pada ponsel, tampilkan langkah secara berurutan dengan tombol utama tetap terjangkau.
- **Navigasi.** Pakai navigasi bawah di ponsel. Ayu melihat **Rapat** dan **Tindak Lanjut**, serta akses ke tugas pribadinya saat diperlukan. Eka melihat **Tugas Saya** dan **Notifikasi**. Akses untuk ganti peran tetap mudah ditemukan. Pada layar lebar, pakai navigasi samping atau kepala halaman yang konsisten.
- **Copy.** Pakai Bahasa Indonesia langsung. Contoh: **Mulai Rekam**, **Hentikan Rekaman**, **Buat Draf To-do**, **Bagikan Tugas**, dan **Minta Update**. Simpan teks penjelas untuk izin, kegagalan, dan hasil aksi yang perlu diketahui pengguna.

### Interaksi yang harus terasa hidup

| Aksi | Umpan balik |
| --- | --- |
| Tekan **Mulai Rekam** | Tombol menunjukkan bahwa aplikasi menunggu izin. Saat audio mulai masuk, timer bergerak dan lingkaran mikrofon menampilkan aktivitas. |
| Tekan **Hentikan Rekaman** | Timer berhenti dan layar transkrip membuka hasil sesi, termasuk pemutar bila audio tersedia. |
| Buat atau edit draf | Daftar dan jumlah tugas berubah sesuai data. Pesan validasi muncul di tempat yang relevan dan draf bisa dibuka lagi. |
| Bagikan tugas atau minta update | Tampilkan konfirmasi singkat berdasarkan aksi yang berhasil. Status dan notifikasi mengikuti tugas yang sama saat berpindah peran. |
| Ganti peran | Perbarui navigasi, judul, akses, dan tindakan yang tersedia. Tunjukkan nama peran aktif dengan jelas. |

Gunakan transisi singkat sekitar 140–220 milidetik untuk respon tombol, panel, dan perpindahan fokus. Utamakan respons yang langsung terlihat. Hormati `prefers-reduced-motion` dan jangan mengandalkan animasi untuk menyampaikan status.

### Pemeriksaan anti-slop dari repo pilihan pengguna

Gunakan [repo anti-slop](https://github.com/miqdadbadjuber/anti-slop) sebagai acuan **During** selama implementasi. Terapkan [aturan inti](https://github.com/miqdadbadjuber/anti-slop/blob/main/antislop.md), [UI](https://github.com/miqdadbadjuber/anti-slop/blob/main/skills/antislop-ui/SKILL.md), dan [tata letak ponsel](https://github.com/miqdadbadjuber/anti-slop/blob/main/skills/antislop-layoutmobile/SKILL.md) bila sudah tersedia di Codex lokal. Gunakan arah visual bagian ini sebagai brief desain sesi dan jalankan pemeriksaan di bawah pada setiap kondisi. Proyek bisa langsung dikerjakan dengan brief ini.

1. **Hierarki.** Setiap layar punya satu aksi utama. Warna ungu punya fungsi yang terlihat. Hindari gradien besar, efek kaca, glow menyeluruh, dan pola dekoratif yang bersaing dengan tugas.
2. **Isi.** Hapus slogan, lencana hias, statistik palsu, foto profil yang memberi kesan pengguna nyata, dan kartu yang mengulang judul. Semua data contoh berlabel sesuai asalnya.
3. **Kontrol dan keadaan.** Semua tombol dan tautan menjalankan aksi yang terlihat. Verifikasi layar kosong, izin ditolak, rekaman berhasil, transkrip kosong, kesalahan proses, dan hasil tersimpan. Status loading harus terkait pekerjaan yang benar-benar berjalan.
4. **Akses dan ukuran.** Uji di 375, 768, dan 1440 piksel serta di antara ukuran tersebut. Pastikan tidak ada luapan teks atau gulir horizontal. Tombol utama mudah disentuh, label memiliki kontras yang cukup, fokus terlihat, dan aksi penting dapat dijalankan dengan papan ketik.
5. **Bukti.** Di serah terima, tulis ringkasan PASS/FAIL untuk hierarki visual, kontrol, mobile, aksesibilitas, dan alur rekam sampai tugas selesai. Sertakan apa yang benar-benar diuji di tiap poin. Perbaiki temuan dan uji ulang jika memungkinkan. Sebut uji mikrofon fisik atau transkripsi jaringan yang belum bisa dilakukan di mesin pengujian.

## 7. Implementasi lokal dan verifikasi

Struktur yang disarankan.

```text
index.html
assets/styles.css
js/app.js
js/demo-data.js
js/recording.js
js/extract-todos.js
js/state.js
README.md
```

Pisahkan fungsi pengelolaan mikrofon dari konversi transkrip dan aturan penugasan. Simpan satu sumber data untuk tiap rapat dan tugas. Pertahankan konsistensi saat tombol ditekan dua kali, layar ditutup, atau halaman dimuat ulang. Render masukan pengguna dengan `textContent` atau API DOM yang aman. Simpan log lokal untuk tujuh aktivitas PRD: tugas dibagikan, tugas diterima, progres diperbarui, daftar Perlu Perhatian dibuka, permintaan pembaruan dikirim, permintaan ditanggapi, dan tugas selesai. Catat kode terkait dan waktu. Saat tugas dibagikan atau selesai, sertakan tenggat awal. Saat progres berubah, catat status sebelum dan sesudah. Saat membuka Perlu Perhatian, catat rapat dan jumlah tugas yang tampil. Simpan teks alasan di detail tugas. Log lokal cukup untuk memeriksa skenario.

Untuk mulai di Mac atau Linux, jalankan dari folder proyek.

```bash
python3 -m http.server 8000
```

Buka [http://localhost:8000](http://localhost:8000). Uji di browser sebelum serah terima. Gunakan tabel ini sebagai pemeriksaan.

| Uji | Hasil yang diharapkan |
| --- | --- |
| Perekaman nyata | Pada browser dengan mikrofon, Mulai Rekam meminta izin. Timer berjalan dan Hentikan Rekaman menghasilkan audio yang bisa diputar. Mikrofon dilepas setelah sesi. |
| Transkripsi dan cadangan | Uji dukungan aktual jika tersedia. Simulasikan izin ditolak, API tidak ada, dan hasil kosong. Transkrip bisa ditempel atau memakai contoh berlabel. Audio yang berhasil tetap tersedia selama sesi. |
| Ekstraksi dan tinjau | Contoh menghasilkan dua draf dan satu keputusan dari teks. Kalimat biasa tidak jadi tugas. Tenggat ambigu kosong. Edit, hapus, tambah, dan konversi ulang dapat diuji. Ubah kalimat tugas untuk membuktikan baris yang dihasilkan mengikuti teks masukan. Tugas draf tidak memicu notifikasi. |
| Rapat baru dari awal | Rapat tersimpan di riwayat. Refresh mempertahankan transkrip, keputusan, dan draf. Pembagian dari rapat baru muncul di Eka dan pembaruan terlihat kembali oleh Ayu. |
| Draf dan validasi | Draf bisa dibuka setelah refresh. Penugasan tanpa satu penanggung jawab, judul, atau tenggat valid ditolak dengan pesan yang jelas. |
| Saling terhubung | Ayu membagikan tugas, Eka melihat notifikasi dan tugasnya, lalu pembaruan Eka terlihat saat kembali sebagai Ayu. Status juga tetap ada setelah refresh. |
| Status dan hak peran | Konfirmasi dan progres berbeda. Hambatan memerlukan alasan. Permintaan penyesuaian mencatat alasan dan menjaga tenggat. Eka tidak bisa membuka tugas milik Rani dengan memasukkan URL. |
| Prioritas | Semua tingkat benar, tenggat yang sama diurutkan dengan waktu pembagian, tugas selesai hilang dari Perlu Perhatian, dan Lewat tenggat muncul bersama status. |
| Permintaan kabar | Satu notifikasi per permintaan yang terbuka. Klik ganda tidak menduplikasi. Memuat ulang tidak mengirim ulang. Pembaruan pertama mencatat tanggapan dan membuka opsi kirim lagi. |
| Tenggat dan pengingat | Uji batas tepat 24 jam, tugas diterima kurang dari 24 jam, pengingat setelah refresh, serta tugas selesai tepat pada tenggat dan satu menit sesudahnya. |
| Navigasi dan tampilan | Tautan dari notifikasi menuju tugas yang benar. Tombol kembali, peralihan peran, reset demo, dan tata letak ponsel, tablet, serta desktop bekerja. Periksa juga fokus dan pesan kesalahan. |

Hasil yang diberikan Codex lokal: situs yang berjalan, README dengan cara menjalankan serta data demo, serta ringkasan pengujian dan pemeriksaan anti-slop yang benar-benar dilakukan. Isi PRD bagian metrik tetap menjadi konteks evaluasi. Angka **59,46%** berasal dari data awal kasus dan tidak perlu dijadikan angka dashboard demo.

## 8. Siapkan untuk Vercel

1. Pastikan folder yang dipilih berisi `index.html` di tingkat teratas dan semua aset memakai jalur relatif.
2. Untuk unggah langsung, buka [Vercel Drop](https://vercel.com/drop), pilih folder situs atau ZIP yang berisi `index.html` di tingkat teratas, pilih proyek, lalu deploy. Situs statis ini dapat disajikan langsung. [Panduan Vercel Drop](https://vercel.com/changelog/vercel-drop)
3. Jika memakai GitHub, impor repositori dari Vercel. Pilih folder berisi `index.html` sebagai **Root Directory**. Pilih **Other** untuk **Framework Preset**, aktifkan **Override** pada **Build Command** dan kosongkan kolomnya. Bila proyek punya folder `public` yang tidak memuat situs, atur **Output Directory** ke `.`. [Panduan build Vercel](https://vercel.com/docs/builds/configure-a-build)
4. Setelah deploy, buka URL publik dan ulangi alur Rekam Rapat → Draf To-do → Ayu → Eka → Ayu. Uji izin mikrofon dengan HTTPS, coba refresh pada halaman detail, dan cek layar ponsel. Browser yang pertama kali membuka URL publik mendapat data awal demo sendiri.
