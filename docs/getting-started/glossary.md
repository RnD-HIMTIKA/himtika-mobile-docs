---
title: Glosarium (Kamus Istilah)
sidebar_label: 3. Glosarium (Kamus Istilah)
---

# 3. Glosarium (Kamus Istilah)

Ini adalah kamus untuk istilah-istilah teknis yang akan Anda temui di seluruh dokumentasi ini.

### Aplikasi (Flutter)

* **BLoC (Business Logic Component):**
    Manajer *state* (data) di aplikasi kita[cite: 287]. BLoC bertugas menangani logika, seperti "saat tombol Login diklik, panggil Supabase, lalu tampilkan *loading*, lalu tampilkan data".

* **Clean Architecture:**
    Cara kita menata folder di Flutter[cite: 287]. Tujuannya memisahkan kode menjadi 3 lapis: `Presentation` (UI), `Domain` (Logika Murni), dan `Data` (Koneksi ke Supabase).

* **Shorebird:**
    Layanan yang kita pakai untuk merilis aplikasi[cite: 288, 338]. Keajaibannya: kita bisa *update* aplikasi (memperbaiki *bug*) tanpa pengguna harus *download* ulang dari Play Store (disebut *Over-the-Air*/OTA update).

### Backend (Supabase)

* **RPC (Remote Procedure Call):**
    Ini adalah inti dari *backend* kita[cite: 286]. RPC adalah **fungsi** yang kita tulis pakai bahasa **SQL** dan disimpan di Supabase.
    * **Contoh:** Daripada aplikasi Flutter mengambil data A, B, dan C satu per satu, kita buat 1 RPC `get_data_gabungan` di Supabase. Aplikasi Flutter tinggal memanggil 1 fungsi itu[cite: 341]. Ini lebih cepat dan aman.

* **RLS (Row Level Security):**
    Ini adalah "Satpam" database kita[cite: 286, 343]. RLS adalah **aturan** yang kita tulis di Supabase untuk menentukan siapa boleh melihat atau mengubah data apa.
    * **Contoh:** Aturan RLS "User hanya boleh melihat data profilnya sendiri" [cite: 383] atau "Hanya admin HiCode yang boleh membuat soal baru"[cite: 368].

* **Edge Functions:**
    Ini adalah kode *serverless* (JavaScript/TypeScript) yang berjalan di Supabase untuk tugas-tugas otomatis[cite: 286].
    * **Contoh:** Kita pakai ini untuk mengirim notifikasi "Event akan dimulai" [cite: 328, 431] atau "Anda diundang ke workspace" [cite: 329, 453] secara otomatis.

* **Triggers / Webhooks:**
    "Pemicu" di database.
    * **Contoh:** Kita punya *trigger* "Saat ada user baru mendaftar (INSERT ke `auth.users`), jalankan RPC `handle_new_user`"[cite: 294].
    * **Contoh:** Kita punya *webhook* "Saat ada undangan baru (INSERT ke `workspace_invitations`), panggil Edge Function `invitation-notifier`"[cite: 329, 505].

* **Storage (Penyimpanan):**
    Tempat kita menyimpan file (gambar, ikon, dll). Kita punya beberapa "ember" (bucket). Contohnya, semua aset HiCode disimpan di *bucket* `hicode_assets`.