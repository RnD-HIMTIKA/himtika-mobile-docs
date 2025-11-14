---
id: overview
title: Gambaran Umum (User HiCode)
sidebar_label: 1. Overview
---

# 📚 Gambaran Umum (User HiCode)

HiCode adalah *platform e-learning* internal HIMFO. Dari sisi pengguna, fitur ini adalah alur belajar yang terstruktur dan kompetitif.

## 🚀 Alur Pengguna (User Flow)

Alur belajar pengguna dirancang secara linear dan berjenjang:

1.  **Memilih Materi:** Pengguna melihat daftar materi (misal: "Dasar Flutter") di layar utama.
2.  **Membaca Chapter:** Pengguna membuka materi dan harus membaca *chapter* (bab) secara berurutan.
3.  **Menyimpan Progres:** Aplikasi **otomatis menyimpan posisi *scroll*** pengguna saat membaca.
4.  **Mengerjakan Kuis Chapter:** Di akhir *chapter* (jika bukan *chapter* "Hanya Baca"), pengguna harus mengerjakan kuis. Kuis ini **wajib lulus 100%** untuk membuka *chapter* berikutnya.
5.  **Mengerjakan Latihan Final:** Setelah semua *chapter* dalam satu materi selesai, pengguna harus lulus "Latihan Final" materi tersebut (misal: lulus 60%) untuk menyelesaikan materi.
6.  **Membuka Ujian Akhir:** Setelah **semua materi** selesai, "Ujian Akhir (Overall Exam)" terbuka.
7.  **Masuk Leaderboard:** Skor dari Ujian Akhir akan dicatat di *leaderboard*.
8.  **Berbagi Skor:** Setelah ujian, pengguna bisa membagikan kartu skor mereka ke media sosial.

## ✨ Fitur Kunci & Perbaikan Rilis

* **Chapter "Hanya Baca" (Baru):**
    Beberapa *chapter* (seperti "Pendahuluan") tidak memiliki kuis. Fitur ini memungkinkan pengguna menyelesaikan *chapter* hanya dengan menekan tombol "Selesai" setelah *scroll* ke paling bawah.

* **Fitur Anti-Curang:**
    Saat ujian/kuis, aplikasi:
    1.  Menjaga layar tetap menyala (`wakelock_plus`).
    2.  Memblokir *screenshot* dan *screen recording* (`no_screenshot`).
    3.  Jika pengguna keluar dari aplikasi (misal: menekan tombol *home*), aplikasi akan **otomatis mengirimkan jawaban** (Auto-Submit) dan menutup layar kuis (`PopScope` & `AppLifecycleState.inactive`).

* **Cooldown Ujian Akhir:**
    Pengguna hanya bisa mengambil "Ujian Akhir" **satu kali per minggu** (di-*reset* setiap Senin). Ini untuk menjaga *leaderboard* tetap kompetitif.

* **Fitur Kompetitif (Baru):**
    * *Leaderboard* dan Kartu Skor kini menampilkan **`@username`** (lebih kompetitif) alih-alih `full_name`.
    * Tombol "Share Score" fungsional menggunakan *package* `screenshot` dan `share_plus`.