---
id: security-secrets
title: Keamanan (Kunci Rahasia)
sidebar_label: 2. Keamanan (Kunci Rahasia)
---

# 🔒 Keamanan (Kunci Rahasia / Secrets)

**Masalah:** Aplikasi kita butuh "kunci rahasia" (API Keys) untuk terhubung ke Supabase dan Sentry. Menyimpan kunci ini di dalam *file* `.env` atau `pubspec.yaml` sangat **BERBAHAYA**[cite: 144]. Kunci tersebut akan ikut ter-*compile* ke dalam *file* `.apk` dan bisa dicuri oleh siapa saja yang membongkar `.apk` kita[cite: 144].

**Solusi:** Kita menggunakan **Build-Time Variables** (`--dart-define`).

## Apa itu `--dart-define`?

`--dart-define` adalah cara kita "meng-injeksi" kunci rahasia ke dalam aplikasi **HANYA PADA SAAT PROSES COMPILE**[cite: 145]. Kunci ini tidak pernah disimpan di *file* kode mana pun.

## Kunci Rahasia yang Dibutuhkan

Anda harus mendapatkan 3 kunci rahasia ini dari admin sebelumnya:
1.  `SUPABASE_URL`
2.  `SUPABASE_ANON_KEY`
3.  `SENTRY_DSN`

## Cara Menggunakannya

Setiap kali Anda ingin **menjalankan** atau **merilis** aplikasi, Anda **WAJIB** menyertakan 3 kunci ini.

### 1. Menjalankan di Lokal (Debug)

Gunakan `flutter run` dengan `--dart-define`:
```bash
flutter run \
--dart-define=SUPABASE_URL="...URL_PROD_ANDA..." \
--dart-define=SUPABASE_ANON_KEY="...ANON_KEY_PROD_ANDA..." \
--dart-define=SENTRY_DSN="...DSN_ANDA..."

2. Merilis ke Produksi (Shorebird)
Gunakan shorebird release atau shorebird patch dengan --dart-define (Perhatikan ada -- tambahan di tengah):

shorebird patch android \
-- --dart-define=SUPABASE_URL="...URL_PROD_ANDA..." \
--dart-define=SUPABASE_ANON_KEY="...ANON_KEY_PROD_ANDA..." \
--dart-define=SENTRY_DSN="...DSN_ANDA..."