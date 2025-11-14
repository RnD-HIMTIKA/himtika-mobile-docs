---
id: troubleshooting
title: Troubleshooting (Masalah Umum)
sidebar_label: 7. Troubleshooting
---

# 🧯 Troubleshooting (Masalah Umum)

### ❌ Masalah 1: Bug "Drag-and-drop chapter terbalik-balik".

* **Penyebab:** Ini adalah *bug* lama. Menggunakan `ListView.builder` standar atau logika BLoC yang salah (menunggu *network* dulu) menyebabkan *state* UI tidak sinkron.
* **Solusi:**
    1.  Pastikan UI menggunakan `ReorderableListView.builder`.
    2.  Pastikan `ChapterManagementBloc` menggunakan **Optimistic Update**: UI di-update *dulu*, baru RPC dipanggil di latar belakang.

### ❌ Masalah 2: Gambar gagal di-upload di text editor. Muncul *error* "Permission Denied" atau "RLS Error".

* **Penyebab:** RLS Storage memblokir *upload* Anda.
* **Solusi:**
    1.  Buka Supabase -> Storage -> Policies.
    2.  Cari *policy* `Allow HiCode Admins to Upload` (No. 40) pada tabel `storage.objects`.
    3.  Periksa *array* `r.name = ANY (ARRAY[...])`.
    4.  Pastikan *role* Anda (misal: "Edukasi") tertulis **sama persis** di dalam *array* tersebut.
    5.  Pastikan kode Flutter meng-upload ke *bucket* `hicode_assets`.

### ❌ Masalah 3: Saya yakin *role* saya "Edukasi", tapi Admin Panel tidak muncul / saya tidak bisa melihat materi.

* **Penyebab:** RLS Database memblokir Anda.
* **Solusi:**
    1.  Buka Supabase -> Auth -> Policies.
    2.  Cari *policy* `Allow full access for HiCode Admins` (misal: No. 7) pada tabel `hicode_materials`.
    3.  Periksa *array* `r.name = ANY (ARRAY[...])`.
    4.  Pastikan *role* "Edukasi" tertulis **sama persis** di sana. (Satu *error* RLS di *storage*, satu lagi di *database*).

### ❌ Masalah 4: Saya menghapus banyak *chapter* dan *storage* saya cepat penuh.

* **Penyebab:** *File* yatim (*orphaned files*) tidak terhapus. Fitur *cleanup* otomatis belum diaktifkan.
* **Solusi (Manual):** Cari *file* di *storage bucket* secara manual dan hapus.
* **Solusi (Otomatis):** Implementasikan fitur yang ditunda.
    1.  Buat Edge Function `cleanup-storage`.
    2.  Buat Database Webhook untuk event `DELETE` dan `UPDATE` pada semua tabel `hicode_` (`questions`, `chapters`, `materials`, `options`, `categories`).
    3.  Pastikan Webhook tersebut memanggil URL Edge Function `cleanup-storage`.