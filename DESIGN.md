# Arahan tampilan MoM Creator

Sumber: bagian 6 `BRIEF_CODEX_MOM_CREATOR.md` revisi dari pengguna, dengan gambar Lingua dan aplikasi timeline di percakapan sebagai referensi. Arahan ungu dan aturan brief menjadi acuan utama.

- Alat kerja tim kampus: rapat, transkrip, keputusan, penugasan, dan hambatan.
- Latar `#F8F7FC`; panel `#FFFFFF`; teks `#201A31`; teks sekunder `#625A73`; garis `#E8E3F2`; aksi utama `#6241C8`; pilihan aktif `#F0EAFE`.
- DM Sans untuk judul dan isi; font sistem sebagai cadangan. Ukuran dasar 16 px, metadata lebih kecil. Timer memakai angka tabular.
- Input 10 px, tombol 12 px, panel 16–18 px. Bayangan untuk dialog dan toast; panel memakai batas tipis.
- Halaman Rapat menonjolkan satu aksi Rekam Rapat di bidang ungu muda. Riwayat berupa baris yang menampilkan jumlah tugas aktual.
- Perekam memusatkan status, timer, indikator mikrofon, serta tombol berhenti. Level suara berasal dari Web Audio API.
- Desktop memakai navbar atas dan tinjau transkrip/draf berdampingan jika ruang cukup. Ukuran menengah menumpuk panel tinjauan. Ponsel memakai navigasi bawah dan formulir satu kolom.
- Satu aksi utama setiap layar; status pekerjaan memakai teks dan warna. Tidak ada statistik rekaan, hero pemasaran, efek kaca, gradien besar, atau avatar foto.
- Transisi 160 ms dan penghormatan pada `prefers-reduced-motion`. Fokus terlihat dan kontrol utama berukuran minimal 44 px.

Pemeriksaan selama pengerjaan mengikuti daftar anti-slop pada brief, dengan [aturan inti](https://github.com/miqdadbadjuber/anti-slop/blob/main/antislop.md), [UI](https://github.com/miqdadbadjuber/anti-slop/blob/main/skills/antislop-ui/SKILL.md), dan [layout mobile](https://github.com/miqdadbadjuber/anti-slop/blob/main/skills/antislop-layoutmobile/SKILL.md) sebagai referensi. Tidak ada pemasangan skill global atau perubahan konfigurasi Codex.

## Arahan lanjutan dari video pengguna

Pengguna meminta komposisi dari video diterapkan ke produk yang sudah dirancang. Halaman Rapat kini memakai mikrofon 3D transparan, tipografi latar besar, pasangan judul sans-serif/serif pada panel pembuka, serta kartu kecil yang terangkat. Tipografi serif hanya menjadi aksen judul panel ini. Struktur kerja, palet ungu, alur kedua peran, dan navigasi tetap mengikuti MoM Creator.

Mikrofon mengambang perlahan dan merespons pointer. Efek ini dinonaktifkan saat reduced motion aktif. Kartu mengarah ke notula dan tugas nyata demo. Ringkasan status, kalender tujuh hari, cuplikan keputusan, prioritas, serta pembagian tugas dihitung dari sumber data yang sama. Tidak ada angka rekaan.

## Layar masuk dan identitas

Permintaan lanjutan pengguna memindahkan pemilihan identitas ke alur login. Pengunjung baru membuka halaman masuk penuh. Desktop memakai dua bidang; ponsel memakai satu kolom dengan aset mikrofon kecil, judul yang ringkas, form, dan dua akun contoh. Pengalih peran di navbar dihapus. Avatar membuka menu profil dengan identitas dan Keluar akun. Tidak menampilkan tombol login sosial atau pendaftaran yang belum tersedia. Label Prototipe dan penjelasan akun contoh menjaga konteks demo tetap jelas.

## Navbar dan beranda per peran

Pengguna mengonfirmasi bahwa login tetap dipakai, kemudian langsung membuka beranda. Sidebar desktop diganti navbar atas, sehingga area konten memakai lebar halaman. Ayu memiliki lima menu dengan arsip Notula tersendiri; Eka memiliki dua menu yang berfokus pada penugasan dan notifikasi. Navigasi bawah tetap dipakai di HP. Identitas akun tampil dekat nama produk. Halaman Tugas Saya mempunyai fokus tugas, ringkasan dari data nyata, dan tiga langkah kerja PIC yang terlihat.

## Revisi keterbacaan

Pengguna meminta tulisan lebih besar dan mudah dipahami. Skala terbaru berada di `assets/readability.css`: isi 16 px, pendukung 14 px, metadata 12 px, judul halaman 32–36 px, menu desktop 15–16 px. Menu bawah HP 11 px pada lima tab dan 13 px pada dua tab. Tidak mengecilkan isi utama di HP.

Teks pembuka memakai instruksi langsung. Kartu melayang tetap menjadi komposisi visual, tetapi tidak lagi memiringkan teks; di HP kartu menjadi satu kolom. Penjelasan yang berulang di bawah mikrofon dihapus. Jarak baris, padding kontrol, dan warna teks sekunder disesuaikan untuk membaca lebih nyaman.
