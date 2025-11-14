---
title: Menjalankan Proyek
sidebar_label: 2. Menjalankan Proyek
---

# 2. Menjalankan Proyek Pertama Kali

Setelah semua *software* di-instal, berikut cara menjalankan proyek aplikasi dan dokumentasi.

## 📲 Menjalankan Aplikasi Flutter (HIMFO)

Ini adalah panduan untuk menjalankan aplikasi *mobile* utama.

### Langkah 1: Download Proyek (Clone)

Buka terminal Anda, masuk ke *folder* kerja Anda (misal: `Documents/Project`), dan jalankan perintah `git clone` untuk mengunduh kode dari repositori.

```bash
# Ganti URL ini dengan URL repositori Flutter Anda yang sebenarnya
git clone https://github.com/HIMTIKA-UNSIKA/himfo-flutter-app.git

# Masuk ke dalam folder proyek yang baru saja di-download
cd himfo-flutter-app

 Langkah 2: Dapatkan Kredensial (Secrets)

Aplikasi ini butuh "kunci rahasia" (Secrets) untuk terhubung ke Supabase dan layanan lainnya. Kunci ini SANGAT RAHASIA dan tidak boleh disimpan di GitHub.

Hubungi Ketua Himpunan atau Project Manager sebelumnya untuk mendapatkan 3 nilai ini:

1. SUPABASE_URL (Alamat backend Supabase kita)

2. SUPABASE_ANON_KEY (Kunci publik untuk mengakses Supabase)

3. SENTRY_DSN (Kunci untuk layanan pelaporan error Sentry)

Tanpa 3 kunci ini, aplikasi tidak akan bisa berjalan atau terhubung ke database.

Langkah 3: Jalankan Aplikasi (PENTING!)

Kita tidak bisa hanya menjalankan flutter run. Kita HARUS menyertakan secrets tadi saat menjalankan aplikasi. Ini disebut Dart Defines.

Buka terminal di dalam folder proyek Flutter (himfo-flutter-app), dan jalankan perintah lengkap ini:

# Ganti "...ISI_DISINI..." dengan kunci yang Anda dapatkan

flutter run \
--dart-define=SUPABASE_URL="...ISI_SUPABASE_URL_DISINI..." \
--dart-define=SUPABASE_ANON_KEY="...ISI_SUPABASE_ANON_KEY_DISINI..." \
--dart-define=SENTRY_DSN="...ISI_SENTRY_DSN_DISINI..."


Perintah di atas akan:

Membangun aplikasi (build).

Meng-injeksi 3 secrets tadi ke dalam aplikasi dengan aman saat proses build.

Menjalankan aplikasi di HP atau Emulator Anda.

Tips Profesional: Perintah ini sangat panjang. Simpan di file .txt atau buat script agar Anda tidak perlu mengetiknya berulang kali.

🌐 Menjalankan Website Dokumentasi (Docusaurus)

Ini adalah panduan untuk menjalankan website yang sedang Anda baca ini, jika Anda ingin menambah atau mengedit dokumentasi.

# Asumsi Anda berada di folder utama, masuk ke folder dokumentasi
# (Sesuaikan namanya jika berbeda)
cd himfo-docusaurus

# Instal semua paket yang dibutuhkan (hanya perlu dilakukan sekali)
npm install

# Jalankan server pengembangan lokal
npm start


Setelah itu, buka http://localhost:3000 di browser Anda untuk melihat website dokumentasi secara live. Setiap perubahan yang Anda simpan di folder docs/ akan otomatis terlihat di browser.