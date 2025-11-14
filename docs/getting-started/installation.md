---
title: Persiapan Instalasi
sidebar_label: 1. Persiapan Instalasi
---

# 1. Persiapan Instalasi (Menyiapkan Komputer)

Sebelum Anda bisa menjalankan proyek aplikasi (Flutter) atau *website* dokumentasi (Docusaurus), Anda harus menginstal beberapa *software* wajib di komputer Anda.

### 1. Git

* **Apa itu?** Sistem untuk melacak perubahan kode.
* **Cara Instal:** Kunjungi [https://git-scm.com/downloads](https://git-scm.com/downloads) dan *download* versi untuk OS Anda.

### 2. Flutter SDK

* **Apa itu?** Ini adalah "mesin" untuk membangun aplikasi Flutter.
* **Cara Instal:** Ikuti panduan **resmi** di [https://flutter.dev/get-started](https://flutter.dev/get-started).
* **PENTING:** Setelah instalasi, jalankan perintah ini di terminal Anda untuk mengecek apakah semuanya beres:

    ```bash
    flutter doctor
    ```

    Pastikan tidak ada *error* (tanda `[X]`) pada bagian `Flutter`, `Android toolchain`, dan `Chrome`.

### 3. Visual Studio Code (VS Code)

* **Apa itu?** *Code editor* tempat kita menulis kode.
* **Cara Instal:** Kunjungi [https://code.visualstudio.com/](https://code.visualstudio.com/).
* **Ekstensi Wajib:** Setelah VS Code terinstal, buka *tab* "Extensions" (logo kotak) dan instal:
    * `Flutter` (dari Dart Code)
    * `Dart` (dari Dart Code)

### 4. Node.js (Untuk Docusaurus)

* **Apa itu?** Dibutuhkan untuk menjalankan *website* dokumentasi ini.
* **Cara Instal:** Kunjungi [https://nodejs.org/](https://nodejs.org/) (Download versi LTS).