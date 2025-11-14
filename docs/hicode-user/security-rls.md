---
id: security-rls
title: Keamanan (RLS)
sidebar_label: 4. Keamanan (RLS)
---

# 🔒 Keamanan (Row Level Security)

Model keamanan HiCode sangat penting. Tujuannya adalah:
1.  **Melindungi Konten:** Mencegah *user* mengunduh semua soal dan jawaban.
2.  **Melindungi Progres:** Memastikan *user* hanya bisa mengubah progres miliknya sendiri.

Ini dicapai dengan dua pola RLS yang berbeda:

## Pola 1: RLS Progres (Milik Pengguna)

RLS ini diterapkan pada tabel progres milik *user* (`hicode_user_progress`, `hicode_material_progress`).

* [cite_start]**Aturan:** `Allow user to manage their own progress` [cite: 406, 435]
* **Perintah:** `ALL` (SELECT, INSERT, UPDATE, DELETE)
* **Target:** `authenticated`
* **Logika (`USING` dan `WITH CHECK`):**
    ```sql
    (user_id = ( SELECT id FROM public.users WHERE auth_id = auth.uid() ))
    ```
* **Artinya:** Anda bisa melakukan **apa saja** (termasuk `UPDATE` `is_completed = true`) ke baris data di tabel `hicode_user_progress` **asalkan** `user_id` di baris itu adalah milik Anda. Anda tidak bisa menyentuh progres *user* lain.

## Pola 2: RLS Konten (Milik Admin)

RLS ini diterapkan pada tabel konten (`hicode_categories`, `hicode_materials`, `hicode_chapters`, `hicode_questions`).

* [cite_start]**Aturan:** `Allow full access for HiCode Admins` [cite: 396, 398, 400, 404]
* **Perintah:** `ALL`
* **Target:** `authenticated`
* **Logika (`USING` dan `WITH CHECK`):**
    ```sql
    -- (Mengecek apakah user_id ada di daftar Admin HiCode [RnD, Edukasi, dll])
    (( SELECT users.id FROM users WHERE auth_id = auth.uid()) IN (
        SELECT ur.user_id FROM user_roles ur JOIN roles r ...
        WHERE r.name = ANY (ARRAY['...','Edukasi','RnD'])
    ))
    ```
* **Artinya:** Hanya Admin HiCode yang boleh membaca atau menulis di tabel-tabel ini.

### ❓ "Lalu bagaimana User biasa bisa membaca materi?"

Inilah kuncinya. *User* biasa **tidak** membaca tabel `hicode_chapters` secara langsung. [cite_start]Mereka memanggil **RPC `get_hicode_chapter_content` (No. 49)**[cite: 383].

[cite_start]RPC tersebut diatur sebagai `SECURITY DEFINER` (Mode Admin)[cite: 384]. Ini berarti RPC itu berjalan dengan hak akses Admin, **melewati RLS Admin**, mengambil data *chapter*, lalu memberikannya kepada *user* yang memanggil.

Ini adalah arsitektur yang sangat aman:
* Akses tulis progres diamankan RLS per-user.
* [cite_start]Akses baca konten diamankan RLS Admin-Only dan hanya "dibocorkan" melalui fungsi RPC yang aman (yang juga mengacak soal [cite: 300-301]).

## Pengecualian: `hicode_options` & `hicode_leaderboard`

* [cite_start]`hicode_leaderboard`: Boleh dibaca oleh semua *user* yang login (`Allow authenticated read access`)[cite: 399].
* [cite_start]`hicode_options`: Boleh dibaca oleh semua *user* yang login (`Allow authenticated users to read options`)[cite: 437].