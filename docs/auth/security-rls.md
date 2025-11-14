---
id: security-rls
title: Keamanan (RLS)
sidebar_label: 4. Keamanan (RLS)
---

# 🔒 Keamanan (Row Level Security)

RLS (Satpam) sangat penting untuk data pengguna. Aturan utamanya adalah: **"Anda hanya boleh mengurus data Anda sendiri."**

### 1. Tabel `public.users`

Tabel ini menyimpan profil semua pengguna.

* **Aturan BACA (SELECT):**
    * `Allow authenticated users to see other users`: Siapapun yang sudah login (`authenticated`) boleh **melihat** daftar pengguna lain. Ini dibutuhkan agar fitur "Undang Teman ke Workspace" bisa mencari nama pengguna.
* **Aturan UBAH (UPDATE):**
    * `public.users_update_own`: Ini adalah aturan kunci.
    * **Kode:** `(auth.uid() = auth_id)`
    * **Artinya:** Seorang pengguna hanya diizinkan mengubah baris data (`UPDATE`) di mana `auth_id` di baris tersebut SAMA DENGAN `auth.uid()` (ID unik si pengguna yang sedang login).
    * **Contoh:** User A **bisa** mengubah `full_name` miliknya. User A **tidak bisa** mengubah `full_name` milik User B.

### 2. Tabel `public.user_roles`

Tabel ini menyimpan *role* rahasia milik pengguna.

* **Aturan BACA (SELECT):**
    * `Allow user to read own roles`: Sangat penting.
    * **Kode:** `user_id = ( SELECT id FROM public.users WHERE auth_id = auth.uid() )`
    * **Artinya:** Pengguna hanya boleh melihat *role* yang terhubung dengan `user_id` miliknya sendiri.
    * **Contoh:** User A bisa melihat bahwa dia adalah 'Teknik Informatika'. User A **tidak bisa** melihat *role* milik User B.

### 3. Tabel `public.roles`

Tabel ini hanya berisi daftar nama *role* yang tersedia.

* **Aturan BACA (SELECT):**
    * `Allow authenticated users to read roles`: Siapapun yang login boleh melihat daftar *role* yang tersedia.
    * **Artinya:** Ini aman, karena hanya mengembalikan daftar nama seperti "Kahim", "RnD", "FASILKOM", dll. Ini **tidak** memberi tahu siapa yang memiliki *role* tersebut.