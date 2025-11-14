---
id: troubleshooting
title: Troubleshooting (Masalah Umum)
sidebar_label: 6. Troubleshooting
---

# 🧯 Troubleshooting (Masalah Umum)

Berikut adalah masalah yang mungkin terjadi terkait fitur Auth dan cara memperbaikinya.

### ❌ Masalah 1: User baru mendaftar (email Unsika) tapi *role*-nya 'Pengunjung'.

* **Penyebab:** RPC `handle_new_user` gagal menemukan padanan *role* untuk NPM tersebut.
* **Solusi:**
    1.  Cek NPM user di emailnya (misal: `2310631170XXX`).
    2.  Ambil `kode_prodi` (misal: `1170`).
    3.  Buka tabel `public.program_studi` di Supabase. Apakah `kode_prodi` '1170' ada?
    4.  Jika ada, lihat kolom `nama_prodi` (misal: "Teknik Informatika") dan `nama_fakultas` (misal: "FASILKOM").
    5.  Buka tabel `public.roles`. Apakah ada *role* dengan `name` "Teknik Informatika" **DAN** "FASILKOM"? (Nama harus sama persis, termasuk huruf besar/kecil dan spasi).
    6.  Jika tidak ada, **buat *role*** tersebut di `public.roles`.

### ❌ Masalah 2: User baru mendaftar tapi tidak dapat akses ke 'Agenda Himtika'.

* **Penyebab:** RPC `handle_new_user` tidak menemukan *workspace* "Agenda Himtika".
* **Solusi:**
    1.  Buka tabel `public.user_workspace` di Supabase.
    2.  Cari baris data `Agenda Himtika`.
    3.  Pastikan nama di kolom `title` adalah "Agenda Himtika" (sama persis seperti yang tertulis di kode RPC).

### ❌ Masalah 3: Tidak bisa reset password untuk akun yang login via Google.

* **Penyebab:** Ini adalah **fitur**, bukan *bug*.
* **Penjelasan:** Pengguna Google OAuth tidak memiliki *password* di sistem kita; mereka login via Google. RPC `check_user_for_reset` sengaja memblokir ini untuk mencegah kebingungan.

### ❌ Masalah 4: Login Google (OAuth) sangat lambat atau *timeout*.

* **Penyebab:** Ini adalah *bug* lama terkait Sentry yang mencoba melacak *redirect callback* dari Supabase.
* **Solusi:** Buka `lib/main.dart`. Pastikan di dalam `SentryFlutter.init`, Anda memiliki konfigurasi `tracesSampler` yang mengabaikan URL *callback* Supabase.