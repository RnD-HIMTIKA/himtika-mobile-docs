---
id: native-fixes
title: Troubleshooting (Android)
sidebar_label: 6. Troubleshooting (Android)
---

# 📱 Troubleshooting (Android Native)

Berikut adalah perbaikan *bug* yang spesifik untuk *platform* Android yang telah diselesaikan.

### [cite_start]❌ Masalah 1: Ikon aplikasi di Android masih ikon default Flutter[cite: 183].

* **Penyebab:** Path di `pubspec.yaml` untuk *package* `flutter_launcher_icons` salah[cite: 183].
* **Solusi:** Path di `pubspec.yaml` (di bawah `flutter_icons:`) dikoreksi dari `src/icons/` menjadi `icons/`. Setelah itu, jalankan ulang *package*-nya untuk membuat ikon baru:
    ```bash
    flutter pub get
    flutter pub run flutter_launcher_icons
    ```
    [cite_start][cite: 183]

### ❌ Masalah 2: Aplikasi gagal *compile* karena Sentry / Kotlin.

* [cite_start]**Penyebab:** Terjadi konflik kompilasi antara Sentry dan versi Kotlin[cite: 182].
* **Solusi:** Versi Kotlin di `android/build.gradle.kts` diatur (di-*hardcode*) ke `1.9.22`[cite: 182].

### ❌ Masalah 3: Aplikasi tidak bisa terhubung ke Supabase (tidak ada internet).

* **Penyebab:** Lupa menambahkan izin internet di level OS.
* **Solusi:** Pastikan *file* `android/app/src/main/AndroidManifest.xml` memiliki baris berikut di dalam `<manifest ...>`:
    ```xml
    <uses-permission android:name="android.permission.INTERNET" />
    ```
    [cite_start][cite: 183]

### ❌ Masalah 4: Masalah `core.longpaths true` di Windows.

* **Penyebab:** Path *file* proyek Flutter terlalu panjang untuk Windows.
* **Solusi:** (Perbaikan ini ada di `Overview.txt` [cite: 184]) Jalankan perintah *git* ini satu kali di komputer Windows Anda untuk mengizinkan path yang panjang:
    ```bash
    git config --global core.longpaths true
    ```