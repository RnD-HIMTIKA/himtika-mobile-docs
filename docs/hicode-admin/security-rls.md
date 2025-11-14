---
id: security-rls
title: Keamanan (RLS)
sidebar_label: 5. Keamanan (RLS)
---

# 🔒 Keamanan (Row Level Security)

Keamanan Admin Panel HiCode adalah yang paling ketat di aplikasi ini. Modelnya adalah **"Kunci Total, Kecuali Admin"**.

Ada 2 lapisan keamanan yang bekerja bersamaan.

### Lapisan 1: RLS Database (Mengunci Tabel Konten)

Semua 5 tabel konten (`hicode_categories`, `hicode_materials`, `hicode_chapters`, `hicode_questions`, `hicode_options`) dilindungi oleh kebijakan RLS yang SAMA.

* **Nama Policy:** `Allow full access for HiCode Admins`
* **Perintah:** `ALL` (SELECT, INSERT, UPDATE, DELETE)
* **Target:** `authenticated`
* **Logika (`USING` dan `WITH CHECK`):**
    ```sql
    -- Cek apakah ID user yang sedang login...
    ( SELECT users.id FROM public.users WHERE users.auth_id = auth.uid() ) 
    
    -- ...ada di dalam daftar user yang memiliki role Admin HiCode
    IN (
        SELECT ur.user_id
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        -- Ini adalah daftar role admin yang di-hardcode
        WHERE r.name = ANY (ARRAY[
            'Ketua Himpunan', 
            'Wakil Ketua Himpunan', 
            'Edukasi', 
            'RnD'
        ])
    )
    ```
* **Artinya:**
    1.  Jika Anda *user* biasa, Anda **tidak bisa** `SELECT * FROM hicode_questions`. Perintah itu akan diblokir RLS dan mengembalikan 0 baris data.
    2.  Jika Anda *user* biasa, Anda **tidak bisa** `INSERT`, `UPDATE`, atau `DELETE` data apa pun.
    3.  Hanya *user* dengan *role* "Edukasi", "RnD" (dll) yang bisa mengakses tabel-tabel ini.

### Lapisan 2: RLS Storage (Mengunci Bucket File)

Meng-upload file juga dikunci.

* **Nama Policy:** `Allow HiCode Admins to Upload`
* **Target:** Tabel `storage.objects` (tabel internal Supabase)
* **Perintah:** `INSERT` (Upload)
* **Logika (`WITH CHECK`):**
    ```sql
    (
        -- 1. Pastikan target bucket adalah 'hicode_assets'
        (bucket_id = 'hicode_assets') 
        AND
        -- 2. Pastikan user memiliki role Admin HiCode
        (
          ( SELECT users.id FROM public.users WHERE ... ) 
          IN ( SELECT ur.user_id FROM public.user_roles ... )
        )
    )
    ```
* **Artinya:**
    1.  *User* biasa **tidak bisa** meng-upload file apa pun ke *bucket* `hicode_assets`.
    2.  Admin HiCode **tidak bisa** meng-upload file ke *bucket* lain (misal: `profile-picture`). Keamanan dua arah.