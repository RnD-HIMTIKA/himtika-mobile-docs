---
id: backend-logic-rpc
title: Logika Backend (RPC & Trigger)
sidebar_label: 3. Logika Backend (RPC)
---

# 🧠 Logika Backend (RPC & Trigger)

Ini adalah bagian paling ajaib dari sistem Auth. Logika ini berjalan **sepenuhnya di dalam database (Supabase)**, bukan di aplikasi Flutter.

## 1. Trigger: `on_user_created`

Di Supabase, kita telah memasang "Pemicu" (Database Trigger) pada tabel `auth.users`.

* **Event:** `AFTER INSERT`
* **Fungsi yang Dipanggil:** `public.handle_new_user()` (RPC No. 20)
* **Artinya:** "Setiap kali ada baris data baru dimasukkan ke `auth.users` (setelah user berhasil mendaftar), segera jalankan fungsi `handle_new_user`."

## 2. RPC: `handle_new_user` (Bedah Kode)

Fungsi ini adalah otak dari *onboarding* otomatis. Mari kita bedah alur logikanya langkah demi langkah:

```sql
-- Ini adalah deklarasi fungsi, ia menerima data user baru
-- dari trigger sebagai variabel 'NEW'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER -- PENTING! Ini membuat fungsi berjalan sebagai 'admin'
AS $function$
DECLARE
  -- (Deklarasi variabel-variabel)
  npm_text TEXT;
  angkatan_digits TEXT;
  kode_prodi_text TEXT;
  prodi_record RECORD;
  role_id_fakultas UUID;
  role_id_prodi UUID;
  angkatan_role_id UUID;
  role_id_pengunjung UUID;
  local_user_id UUID;
  agenda_himtika_workspace_id UUID;
BEGIN

  -- 1. Ambil ID role "Pengunjung" untuk jaga-jaga
  SELECT id INTO role_id_pengunjung FROM public.roles 
  WHERE LOWER(name) = 'pengunjung' LIMIT 1;

  -- 2. Cek apakah email adalah email mahasiswa Unsika
  IF NEW.email ILIKE '%@student.unsika.ac.id' THEN
    
    -- 3. Jika Ya, ambil NPM dari email (misal: 231063...)
    npm_text := split_part(NEW.email, '@', 1);
    
    -- 4. Pastikan NPM valid (13 karakter)
    IF char_length(npm_text) = 13 THEN
      -- 5. Parsing NPM
      angkatan_digits := SUBSTRING(npm_text, 1, 2);   -- '23'
      kode_prodi_text := SUBSTRING(npm_text, 7, 4); -- 'Kode Prodi'
      -- (dan parsing lainnya)
    END IF;
  END IF;

  -- 6. Masukkan data user baru dari (auth.users) ke (public.users)
  -- Ini adalah pembuatan profil publik
  INSERT INTO public.users (auth_id, username, full_name, email, npm, ...)
  VALUES (NEW.id, ..., NEW.email, npm_text, ...)
  RETURNING id INTO local_user_id;

  -- 7. Jika user adalah mahasiswa (NPM ditemukan)
  IF npm_text IS NOT NULL THEN
    
    -- 8. Cari nama prodi & fakultas di tabel 'kamus'
    SELECT nama_prodi, nama_fakultas INTO prodi_record 
    FROM public.program_studi 
    WHERE kode_prodi = kode_prodi_text LIMIT 1;

    IF FOUND THEN
      -- 9. Cari ID Role Prodi (misal: 'Teknik Informatika')
      SELECT id INTO role_id_prodi FROM public.roles 
      WHERE name = prodi_record.nama_prodi;
      
      -- 10. Assign role prodi ke user
      INSERT INTO public.user_roles(user_id, role_id) 
      VALUES (local_user_id, role_id_prodi);

      -- 11. Cari & Assign Role Fakultas
      SELECT id INTO role_id_fakultas FROM public.roles 
      WHERE name = prodi_record.nama_fakultas;
      INSERT INTO public.user_roles(user_id, role_id) 
      VALUES (local_user_id, role_id_fakultas);

      -- 12. Cari & Assign Role Angkatan
      angkatan_role_name := 'Angkatan_' || angkatan_digits; -- 'Angkatan_23'
      SELECT id INTO angkatan_role_id FROM public.roles 
      WHERE name = angkatan_role_name;
      INSERT INTO public.user_roles(user_id, role_id) 
      VALUES (local_user_id, angkatan_role_id);
    END IF;
  END IF;

  -- 13. Jika tidak ada role yang di-assign (termasuk user non-Unsika)
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = local_user_id) THEN
     -- 14. Berikan role "Pengunjung"
     INSERT INTO public.user_roles(user_id, role_id) 
     VALUES (local_user_id, role_id_pengunjung);
  END IF;

  -- 15. BAGIAN KEDUA: Beri akses ke Agenda Himtika
  SELECT id INTO agenda_himtika_workspace_id 
  FROM public.user_workspace 
  WHERE title = 'Agenda Himtika' LIMIT 1;

  -- 16. Jika workspace-nya ada, daftarkan user sebagai 'viewer'
  IF agenda_himtika_workspace_id IS NOT NULL THEN
    INSERT INTO public.workspace_access (workspace_id, user_id, role)
    VALUES (agenda_himtika_workspace_id, local_user_id, 'viewer');
  END IF;

  RETURN NEW;
END;
$function$;

## RPC: check_user_for_reset (No. 4)

Fungsi ini dipanggil oleh aplikasi sebelum mengizinkan reset password. Tujuannya adalah mencegah pengguna Google OAuth me-reset password mereka (karena mereka tidak punya password).

CREATE OR REPLACE FUNCTION public.check_user_for_reset(p_email text)
RETURNS text -- Mengembalikan 'not_found', 'is_oauth', 'can_reset'
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  user_record RECORD;
BEGIN
  -- 1. Cari user di tabel auth internal
  SELECT * INTO user_record
  FROM auth.users
  WHERE email = p_email
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN 'not_found';
  END IF;

  -- 2. Cek di tabel 'identities', apakah provider-nya 'email'?
  IF EXISTS (
    SELECT 1 FROM auth.identities
    WHERE user_id = user_record.id AND provider = 'email'
  ) THEN
    -- 3. Jika Ya, dia daftar pakai email & boleh reset
    RETURN 'can_reset';
  ELSE
    -- 4. Jika Tidak (provider-nya 'google'), dia tidak boleh reset
    RETURN 'is_oauth';
  END IF;
END;
$function$;