---
id: overview
title: Gambaran Umum (Admin HiCode)
sidebar_label: 1. Overview
---

# 🛠️ Gambaran Umum (Admin HiCode)

Ini adalah **Content Management System (CMS)** untuk fitur HiCode. Hanya *user* dengan *role* admin HiCode (misal: "Edukasi", "RnD") yang bisa mengakses panel ini.

Admin Panel ini memungkinkan Admin untuk melakukan **CRUD (Create, Read, Update, Delete)** penuh pada semua konten e-learning.

## 🚀 Fungsionalitas Utama

1.  **CRUD Kategori:** Membuat, mengedit, dan menghapus kategori (misal: "Web", "Mobile").
2.  **CRUD Materi:** Membuat, mengedit, dan menghapus materi (misal: "Dasar Flutter").
3.  **CRUD Chapter:** Membuat, mengedit, dan menghapus *chapter* (bab) di dalam materi.
4.  **CRUD Bank Soal:** Membuat, mengedit, dan menghapus soal untuk Kuis, Latihan Final, dan Ujian Akhir.
5.  **Manajemen Konten (Quill Editor):** Menggunakan *text editor* (Quill) yang stabil untuk mengisi konten *chapter*, termasuk meng-upload gambar dan video.

## ✨ Fitur Kunci & Perbaikan Rilis

* **Perbaikan Stabilitas Editor (Quill):**
    * Ditemukan bahwa *library* `flutter_quill` stabil jika dikonfigurasi berbeda antara Admin dan User.
    * **Admin (`modify_chapter_dialog.dart`):** Menggunakan `FlutterQuillEmbeds.editorBuilders()` untuk mengaktifkan fitur *upload* gambar.
    * **User (`sub_chapter_detail.dart`):** Menggunakan `FlutterQuillEmbeds.defaultEditorBuilders()` yang diatur ke *read-only*.

* **Perbaikan UX Drag-and-Drop (Bug "Terbalik-balik"):**
    * Sebelumnya, mengurutkan *chapter* dengan *drag-and-drop* menyebabkan urutan menjadi acak.
    * **Solusi:** `ListView.builder` diganti dengan `ReorderableListView.builder`.
    * `ChapterManagementBloc` juga dimodifikasi untuk menggunakan **Optimistic Update**, di mana UI langsung diperbarui tanpa menunggu konfirmasi *database*, memberikan UX yang mulus.

* **Filter Bank Soal:**
    * Halaman "Bank Soal" (`question_bank_screen.dart`) memiliki fungsionalitas filter bertingkat (Tipe Soal -> Materi -> Chapter) yang terhubung ke `QuestionBankBloc`.

* **Konvensi Penamaan:**
    * Diputuskan bahwa Admin akan mengetik judul *chapter* secara manual (misal: "Chapter 1: Pengantar") untuk fleksibilitas, alih-alih di-otomatisasi.