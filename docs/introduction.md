---
id: introduction
title: Pengenalan
sidebar_label: Pengenalan
---

# Pengenalan HIMTIKA Mobile

Dokumentasi ini menyajikan arsitektur, penjelasan fitur, dan panduan integrasi berbagai komponen aplikasi mobile HIMTIKA.

Dokumentasi ini akan berkembang seiring fitur-fitur aplikasi dikembangkan, dimulai dari fondasi utama: **User Roles System**.

---

## Bahasa

- **Penjelasan dokumentasi:** Bahasa Indonesia
- **Penamaan kode, database, dan file:** Bahasa Inggris (sesuai standar industri)

---

## Arsitektur Umum Aplikasi

Aplikasi ini dikembangkan menggunakan **Flutter** dengan pendekatan **Clean Architecture** serta implementasi state management menggunakan **BLoC / Riverpod** (tergantung kebutuhan modul).

Sistem autentikasi dan database utama berbasis **Supabase**, yang menyediakan fitur:

- Auth (login/register dengan email kampus)
- PostgreSQL database (untuk user, roles, permission, dll)
- Row Level Security (RLS) dan access control

---

## Modul Fitur

Setiap fitur besar (misal: user roles, admin panel, forum, dll) memiliki struktur folder sendiri di bawah `lib/features/<fitur>` dan didokumentasikan secara modular di Docusaurus.

Contoh dokumentasi ini dimulai dengan:

- [`features/roles`](./roles/overview.md) → Dokumentasi lengkap sistem User Roles

---

## Struktur Dokumentasi

Setiap fitur didokumentasikan dengan format berikut:

1. Overview (gambaran umum fitur)
2. Clean Architecture & Alur Logic
3. Struktur SQL Supabase
4. Contoh kode implementasi
5. FAQ dan panduan pengembangan

---

## Tujuan Dokumentasi

📌 Tujuan utama dokumentasi ini:

- Mempermudah tim baru memahami fitur
- Memberi panduan teknis untuk developer internal
- Menjadi referensi utama jika terjadi regenerasi tim HIMTIKA

---

## Kontribusi

Jika kamu adalah developer baru atau tim yang mewarisi proyek ini:

1. Baca dokumentasi per fitur terlebih dahulu.
2. Gunakan `search` untuk temukan file yang relevan.
3. Ikuti struktur yang sudah ada agar proyek tetap terorganisir.

---

📌 Selanjutnya, pelajari [Overview Fitur Roles](./roles/overview.md) sebagai dasar akses dan permission aplikasi.