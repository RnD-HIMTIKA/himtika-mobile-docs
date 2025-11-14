---
id: introduction
title: Selamat Datang di HIMFO
sidebar_label: 🚀 Pengenalan
---

# Selamat Datang di Dokumentasi HIMFO

HIMFO adalah aplikasi *mobile* resmi Himpunan Mahasiswa Teknik Informatika (HIMTIKA) Unsika.

## 🎯 Tujuan Dokumentasi

Dokumentasi ini adalah **buku panduan lengkap** untuk serah terima proyek HIMFO ke generasi pengurus berikutnya.

Dokumentasi ini sengaja dibuat sangat rinci dan ditujukan untuk **developer pemula**. Kami akan menjelaskan semua konsep dari nol, seakan-akan Anda belum pernah menggunakan teknologi yang kami pakai.

## STACK (Tumpukan Teknologi)

Aplikasi ini dibangun menggunakan 3 teknologi utama:

1.  **Flutter (Frontend):**
    * **Apa itu?** *Toolkit* dari Google untuk membuat tampilan aplikasi (UI) Android dan iOS dari satu basis kode.
    * [cite_start]**Pola Arsitektur:** Kita menggunakan **Clean Architecture** dan **BLoC** untuk manajemen *state* (data)[cite: 285, 287]. Ini adalah standar industri yang membuat kode rapi dan mudah diurus.

2.  **Supabase (Backend):**
    * **Apa itu?** Ini adalah "Backend" kita[cite: 285]. Supabase menyediakan database (PostgreSQL), sistem Login (Auth), penyimpanan file (Storage), dan logika sisi server (Functions)[cite: 286].
    * **Kenapa Keren?** Kita tidak perlu membuat *server* dari nol. [cite_start]Kita menulis logika bisnis langsung di dalam Supabase menggunakan **RPC (Fungsi Database)**[cite: 286].

3.  **Docusaurus (Website Ini):**
    * **Apa itu?** *Tools* untuk membuat *website* dokumentasi ini dengan cepat.

## 📖 Cara Membaca Dokumentasi

Jika ini pertama kalinya Anda, silakan baca panduan di bagian **"Panduan Memulai"** secara berurutan. Mulailah dari `Persiapan Instalasi`.