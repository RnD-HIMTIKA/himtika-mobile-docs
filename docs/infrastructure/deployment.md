---
id: deployment
title: Deployment (Cara Rilis Aplikasi)
sidebar_label: 1. Deployment (Shorebird)
---

# 🚀 Deployment (Cara Rilis Aplikasi)

Proyek ini **tidak** dirilis secara manual. Kita menggunakan layanan bernama **Shorebird** untuk merilis dan, yang lebih penting, untuk mengirim *update* (patch) ke aplikasi tanpa pengguna harus mengunduh ulang dari Play Store.

Ini disebut **OTA (Over-the-Air) Update**.

## ‼️ PERINGATAN KUNCI: `release` vs `patch`

Anda **HARUS** mengerti perbedaan antara dua perintah ini. Salah menggunakan perintah bisa memaksa semua pengguna mengunduh ulang aplikasi.

### 1. Kapan menggunakan `shorebird release` (Rilis BARU)

Gunakan perintah ini **HANYA JIKA** Anda mengubah file-file di luar folder `lib/`.

Gunakan `release` jika Anda:
* Mengubah `pubspec.yaml` (menambah/menghapus/meng-update *package*)
* Mengubah file di dalam folder `android/` (misal: `build.gradle`, `AndroidManifest.xml`)
* Mengubah file di dalam folder `ios/`
* Mengubah *assets* (misal: menambah gambar di `assets/images/`, mengubah ikon)

#### Perintah Rilis (Release) V1 (Membuat .apk Dasar BARU):
```bash
# Ganti ... dengan Kunci Rahasia Anda (Lihat docs/infrastructure/security-secrets.md)
shorebird release android --artifact apk \
-- --dart-define=SENTRY_DSN="...DSN_ANDA..." \
--dart-define=SUPABASE_URL="...URL_PROD_ANDA..." \
--dart-define=SUPABASE_ANON_KEY="...ANON_KEY_PROD_ANDA..."

2. Kapan menggunakan shorebird patch (Update OTA)
Gunakan perintah ini 99% SETIAP SAAT.

Gunakan patch jika Anda HANYA mengubah kode di dalam folder lib/.

Memperbaiki bug di BLoC? -> patch 

Mengubah tampilan UI di screen? -> patch 

Mengubah alur logika di use case? -> patch 

Ini akan mengirimkan update kecil ke aplikasi pengguna secara otomatis saat mereka membuka aplikasi.

Perintah Patch (Update OTA):

# Ganti ... dengan Kunci Rahasia Anda
shorebird patch android \
-- --dart-define=SENTRY_DSN="...DSN_ANDA..." \
--dart-define=SUPABASE_URL="...URL_PROD_ANDA..." \
--dart-define=SUPABASE_ANON_KEY="...ANON_KEY_PROD_ANDA..."