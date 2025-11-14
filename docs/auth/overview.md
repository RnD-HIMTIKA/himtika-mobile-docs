---
id: overview
title: Gambaran Umum (Overview)
sidebar_label: 1. Overview
---

# 🔐 Gambaran Umum Fitur Autentikasi (Auth)

Fitur Autentikasi (Auth) adalah fondasi dari seluruh aplikasi. Fitur ini bertanggung jawab untuk menjawab pertanyaan: **"Siapa Anda?"** dan **"Apa yang boleh Anda lakukan?"**

Di proyek HIMFO, fitur "Auth" JAUH LEBIH PINTAR daripada sekadar Login dan Registrasi.

## 🚀 Fungsionalitas Utama

1.  **Registrasi & Login:**
    * Registrasi Email (dengan verifikasi OTP).
    * Login via Email & Password.
    * Login via **Google OAuth** (Tombol "Masuk dengan Google").
    * Alur Lupa Password (dengan validasi sisi server).

2.  **Otomatisasi Onboarding (Saat Registrasi):**
    Ini adalah "keajaiban" dari sistem kita. Saat seorang pengguna baru mendaftar:
    * Sistem **mendeteksi** apakah email tersebut adalah email mahasiswa Unsika (`@student.unsika.ac.id`).
    * Jika Ya, sistem **mem-parsing NPM** dari email tersebut untuk menemukan:
        * Fakultas (Misal: 'FASILKOM')
        * Prodi (Misal: 'Teknik Informatika')
        * Angkatan (Misal: 'Angkatan_23')
    * Sistem kemudian **otomatis memberikan *role*** tersebut kepada pengguna.
    * Jika Bukan email Unsika, sistem otomatis memberikan *role* 'Pengunjung'.

3.  **Pemberian Akses Otomatis:**
    * Setiap pengguna baru (baik Unsika maupun non-Unsika) **otomatis mendapatkan akses 'viewer'** ke *workspace* global "Agenda Himtika".

4.  **Manajemen Profil:**
    * Pengguna dapat melengkapi profil mereka (Nama Lengkap, NPM, dll) setelah registrasi.