---
id: database-schema
title: Skema Database
sidebar_label: 2. Skema Database
---

# 🗃️ Skema Database (Auth & Roles)

Untuk memahami alur Auth, Anda harus paham 5 tabel utama yang saling berhubungan.

### 1. `auth.users` (Tabel Internal Supabase)

* **Pemilik:** Supabase Auth.
* **Kapan Terisi?** Setiap kali ada pengguna baru mendaftar (baik via Email maupun Google).
* **Poin Kritis:** Kita **TIDAK BISA** mengedit tabel ini secara langsung. Tabel ini menyimpan data login sensitif. Kita hanya bisa "membaca" data dari sini.

### 2. `public.users` (Tabel Profil Publik)

* **Pemilik:** Aplikasi KITA.
* **Kapan Terisi?** Otomatis terisi oleh **Trigger** `handle_new_user` sesaat setelah `auth.users` terisi.
* **Tujuan:** Menyimpan data profil publik pengguna, seperti `username`, `full_name`, `npm`, `profile_url`, dan yang terpenting, `auth_id` (sebagai *foreign key* ke `auth.users`).

### 3. `public.roles` (Daftar Role)

* **Pemilik:** Admin (kita).
* **Tujuan:** Ini adalah "kamus" semua *role* yang ada di aplikasi.
* **Contoh Data:**
    * `{ id: 'uuid-1', name: 'Teknik Informatika', group_name: 'Prodi' }`
    * `{ id: 'uuid-2', name: 'FASILKOM', group_name: 'Fakultas' }`
    * `{ id: 'uuid-3', name: 'Angkatan_23', group_name: 'Angkatan' }`
    * `{ id: 'uuid-4', name: 'Pengunjung', group_name: 'Publik' }`

### 4. `public.user_roles` (Tabel Penghubung)

* **Pemilik:** Aplikasi (diisi oleh RPC).
* **Tujuan:** Tabel "pivot" yang menghubungkan `public.users` dan `public.roles`. Ini menjawab pertanyaan, "User A punya *role* apa saja?"
* **Contoh Data:**
    * `{ user_id: 'user-A', role_id: 'uuid-1' }` (User A adalah TI)
    * `{ user_id: 'user-A', role_id: 'uuid-2' }` (User A adalah FASILKOM)

### 5. `public.program_studi` (Tabel Kamus NPM)

* **Pemilik:** Admin (kita).
* **Tujuan:** Tabel "contekan" yang digunakan oleh RPC `handle_new_user` untuk menerjemahkan `kode_prodi` (dari NPM) menjadi `nama_prodi` dan `nama_fakultas`.
* **Contoh Data:**
    * `{ kode_prodi: '1063XXXX', nama_prodi: 'Teknik Informatika', nama_fakultas: 'FASILKOM' }`

### Diagram Alur Data Saat Registrasi

```mermaid
flowchart TD
    A[User Mendaftar] --> B(Supabase Auth);
    B --> C{INSERT ke 1. auth.users};
    C --> D[DB Trigger: 'on_user_created'];
    D --> E(Jalankan RPC: 2. handle_new_user);
    E --> F{INSERT ke 2. public.users};
    E --> G[Baca 5. program_studi];
    G --> H[Baca 3. public.roles];
    H --> I{INSERT ke 4. public.user_roles};
    E --> J[Cari ID 'Agenda Himtika'];
    J --> K{INSERT ke public.workspace_access};