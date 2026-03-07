# Sistem Absensi GPS — Backend API (Core Server)

Mesin penggerak utama (*Core Engine*) yang memfasilitasi komunikasi data dua arah antara **Admin Web Dashboard (Next.js)** dan **Mobile Apps (React Native)** untuk absensi guru dan karyawan SD Islam Terpadu Iqra 2 Kota Bengkulu. 

Backend ini didesain menggunakan arsitektur RESTful API yang tangguh (`Express.js`), ORM modern (`Prisma`), dan pengelolaan relasi data berskala perusahaan lintas PostgreSQL untuk verifikasi GPS canggih, alur kerja perizinan, pengelolaan hari libur, serta rekam absen langsung.

## Fitur Super API

- **Mesin Geolocation Jarak Tepat:** Sistem Kalkulator Jarak Bumi Menggunakan *Haversine Formula Algorithm* bawaan secara *on-the-fly* di-sisi API untuk membuktikan seberapa dekat ponsel pengguna (Mobile) terhadap pagar maya konfigurasi titik SMP IT Iqra 2 Bengkulu.
- **Workflow Persetujuan Terintegrasi:** Menampung foto-foto izin dan mendistribusikan sinkronisasi status ke Mobile secara aktual saat persetujuan diajukan, dikabulkan, atau ditolak oleh Administrator. Termasuk injeksi otomatis log cuti/izin/sakit menembus rekaman histori kehadiran guru.
- **Detektif Fake GPS (Anomali):** Rekam jejak status peringatan manipulasi perangkat lokal oleh karyawan yang tertangkap oleh aplikasi seluler dipetakan permanen dan ditautkan ke profil khusus sang anomali di database PostgreSQL. 
- **Kalender Cerdas Nasional:** Penebaran rekaman hari-hari penting kalender tahunan nasional dan acara spesifik lokal Sekolah IT Iqra dengan satu klik unggah manual maupun automasi. Sistem tidak akan mendata satupun pegawai absen di hari libur.
- **Pembentuk Laporan Excel Multipengguna (`exceljs`):** API mengonsumsi satu instruksi parameter bulan dan tahun, mengubah relasi kompleks tabel SQL, dan memuntahkan Dokumen Spreadsheet siap guna berformat `.xlsx`. Dokumen ini diformat rapi mencakup *Summary* akumulasi kinerja presensi individu per bulan, hingga detik-detik spesifik rekam pendaftaran absen harian. 

## Struktur Sistem dan Database

Kami memigrasi dan mengekstensi skema `schema.prisma` orisinal dengan relasi *enhancement* canggih ini:

- **M\_AttendanceConfig:** Tabel rahasia koordinat spesifikasi sekolah beserta batas radius, toleransi keterlambatan (`LateThreshold`), serta jam aktif gerbang (*ClockIn/Out*).
- **M\_Holiday:** Model untuk mendaftar kalender libur.
- **T\_LeaveRequest:** Model logikal baru dengan riwayat keputusan persetujuan/penolakan oleh operator Admin.
- **T\_AttendanceLog:** Penambahan entri khusus pemantauan Anomali Kordinat (*Lat/Lng*), jarak sesungguhnya pelapor dengan batas maksimal meter pagar sekolah, riwayat indikator Mock GPS, dan parameter kemanan deteksi wajah mandiri.

## Instalasi Developer & *Deployment*

1. Pastikan Anda memiliki *engine* node.js, npm, serta mesin `PostgreSQL` (atau servis Supabase URL string) aktif.
2. Tempatkan diri Anda pada direktori backend ini `cd apps/backend`.
3. Pasang paket ketergantungan API *Server*: `npm install`
4. Deklarasikan string akses ke relasi tabel database PostgreSQL Anda secara unik pada parameter file maya: `.env` → `DATABASE_URL=...` 
5. Lakukan migrasi inisialisasi awal ke Tabel Kosong Anda: `npx prisma migrate dev`
6. Putar pembuahan perakitan tabel awal bila dibutuhkan (opsional): `node prisma/seed.js`
7. Mulai menyalakan server komunikasi hulu: `npm run dev` atau di *production* memakai perintah murni `node index.js`. Server bersiap siaga di Port 4000.  
