---
id: overview
title: Gambaran Umum (Role Management)
sidebar_label: 1. Overview
---

# 👑 Gambaran Umum (Manajemen Role)

Fitur ini adalah **Admin Panel** khusus untuk mengelola **Role Pengurus**.

Fitur ini berbeda dari `docs/auth/`.
* Fitur **Auth** (`handle_new_user`): Meng-assign *role* (Prodi, Angkatan) secara **otomatis** saat user mendaftar.
* Fitur **Roles** (Admin Panel): Meng-assign *role* (Pengurus) secara **manual** oleh Admin.

## 🚀 Fungsionalitas Utama

Admin yang memiliki hak akses (misalnya "Ketua Himpunan" atau "RnD") dapat:
1.  **Melihat Daftar User:** Menampilkan seluruh *user* yang terdaftar di aplikasi.
2.  **Mencari User:** Melakukan pencarian *user* berdasarkan Nama, Username, Email, atau NPM.
3.  **Mengelola Role Pengurus:** Menambahkan atau menghapus *role* yang ada di grup "Pengurus" (Contoh: "Ketua Pelaksana", "Anggota Divisi Edukasi", "Anggota Divisi RnD") ke seorang *user*.

## 💡 Konsep Inti

* Admin **tidak bisa** mengubah *role* "Angkatan" atau "Prodi" milik *user*. *Role* tersebut dikelola otomatis oleh sistem [cite: RPC.txt (141)].
* Admin Panel ini hanya mengelola *role* yang ada di dalam grup `group_name = 'Pengurus'` di tabel `public.roles`.
* Beberapa *role* bersifat **Eksklusif** (seperti "Ketua Himpunan"), yang berarti hanya bisa dipegang oleh satu orang dalam satu waktu.