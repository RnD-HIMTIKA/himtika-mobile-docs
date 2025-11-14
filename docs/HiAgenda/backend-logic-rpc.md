---
id: backend-logic-rpc
title: Logika Backend (RPC)
sidebar_label: 3. Logika Backend (RPC)
---

# 🧠 Logika Backend (RPC)

Logika HiAgenda sangat kompleks dan hampir seluruhnya dijalankan di *backend* Supabase melalui RPC (Fungsi).

## 1. RPC: `get_my_workspaces_with_members` (No. 16)

Ini adalah RPC **paling penting** di HiAgenda. RPC ini mengambil semua data yang dibutuhkan *dashboard* kalender dalam satu panggilan.

**CITE:** `RPC.txt (286-296)`

### 🚀 PERBAIKAN KRITIS (Avatar Bug)

* **Masalah:** Avatar *user* Google (OAuth) tidak tampil.
* **Penyebab:** Avatar Google disimpan di `auth.users` (Tabel privat), sedangkan avatar *upload* disimpan di `public.users` (Tabel publik). RLS standar mencegah `public.users` "mengintip" ke `auth.users`.
* **Solusi:** RPC ini diubah menjadi `SECURITY DEFINER` (Mode Admin). Ini mengizinkan RPC untuk `JOIN` kedua tabel (`public.users` dan `auth.users`) dan menggabungkan data avatar.

### Bedah Kode SQL

```sql
-- Dideklarasikan sebagai SECURITY DEFINER agar bisa bypass RLS
CREATE OR REPLACE FUNCTION get_my_workspaces_with_members()
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER -- <--- INI ADALAH PERBAIKAN KRITIS [cite: 96]
AS $$
DECLARE
  current_user_auth_id UUID := auth.uid();
  current_user_internal_id UUID;
BEGIN
  -- 1. Dapatkan ID internal (public.users) dari user yg sedang login
  SELECT id INTO current_user_internal_id FROM public.users 
  WHERE auth_id = current_user_auth_id;

  RETURN (
    SELECT json_agg( -- 2. Gabungkan semua workspace jadi satu JSON
      json_build_object(
        'workspace', ws, -- Data workspace (nama, dll)
        'members', ( -- 3. Subquery: Ambil semua member workspace ini
          SELECT json_agg(
            json_build_object(
              'user_data', user_with_avatar, -- Data member
              'role', wa_inner.role -- Role member
            )
          )
          FROM public.workspace_access wa_inner
          
          -- 4. LOGIKA AVATAR: JOIN dengan tabel virtual
          JOIN (
              SELECT
                u.id, u.username, u.full_name, u.email,
                
                -- 5. Ambil profile_url, JIKA NULL, ambil avatar_url dari auth
                COALESCE(u.profile_url, au.raw_user_meta_data->>'avatar_url') 
                  as profile_url, [cite: 96]
                
                u.npm, u.fcm_token
              FROM public.users u
              LEFT JOIN auth.users au ON u.auth_id = au.id -- JOIN ke auth.users!
          ) 
          AS user_with_avatar ON wa_inner.user_id = user_with_avatar.id
          WHERE wa_inner.workspace_id = ws.id
        ),
        'currentUserRole', ( -- 6. Ambil role user saat ini di workspace ini
          SELECT role FROM public.workspace_access
          WHERE workspace_id = ws.id 
            AND user_id = current_user_internal_id
          LIMIT 1
        )
      )
    )
    FROM public.user_workspace ws
    -- 7. Filter: Hanya ambil workspace dimana user adalah anggota
    WHERE ws.id IN (SELECT workspace_id FROM public.workspace_access 
                    WHERE user_id = current_user_internal_id)
  );
END;
$$;

2. RPC: invite_users_by_roles (No. 22)
Tujuan: Mengundang massal berdasarkan Kriteria Role (Logika "DAN").

CREATE OR REPLACE FUNCTION invite_users_by_roles(
    p_workspace_id uuid,
    p_target_role_ids uuid[], -- Daftar Role (misal: [FASILKOM_ID, ANGKATAN_23_ID])
    p_role_to_grant text     -- Role yg akan diberikan (misal: 'viewer')
) ...
DECLARE
  role_count INT := array_length(p_target_role_ids, 1); -- misal: 2
BEGIN
  -- 1. Loop untuk SETIAP user yang cocok
  FOR target_user_id IN
    SELECT ur.user_id
    FROM public.user_roles ur
    WHERE ur.role_id = ANY(p_target_role_ids) -- Filter awal (Logika "ATAU")
    GROUP BY ur.user_id
    -- 2. LOGIKA "DAN" [cite: 101]
    -- Hanya ambil user yg jumlah role-nya SAMA DENGAN jumlah role yg dicari
    HAVING COUNT(DISTINCT ur.role_id) = role_count
  LOOP
    -- 3. Buat undangan 'personal' untuk user yg lolos
    INSERT INTO public.workspace_invitations (...)
    VALUES (p_workspace_id, ..., target_user_id, ...)
    ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$;

3. RPC: update_workspace_member_role (No. 61)

Tujuan: Fitur baru  untuk 'Owner' mengubah role 'Editor'/'Viewer'.

CREATE OR REPLACE FUNCTION update_workspace_member_role(
    p_workspace_id uuid,
    p_user_id_to_update uuid, -- Member yg akan diubah
    p_new_role text          -- Role baru ('editor' or 'viewer')
) ...
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID := (SELECT id FROM public.users WHERE auth_id = auth.uid());
  workspace_owner_id UUID;
BEGIN
  -- 1. Ambil ID Owner
  SELECT owner_id INTO workspace_owner_id FROM public.user_workspace
  WHERE id = p_workspace_id;

  -- 2. Keamanan: Pastikan yang memanggil adalah OWNER [cite: 509]
  IF current_user_id <> workspace_owner_id THEN
    RAISE EXCEPTION 'Hanya owner yang dapat mengubah role anggota.';
  END IF;

  -- 3. Keamanan: Owner tidak bisa mengubah role-nya sendiri [cite: 510]
  IF current_user_id = p_user_id_to_update THEN
    RAISE EXCEPTION 'Owner tidak dapat mengubah role diri sendiri.';
  END IF;

  -- 4. Validasi Role
  IF p_new_role <> 'editor' AND p_new_role <> 'viewer' THEN
    RAISE EXCEPTION 'Role tidak valid. Gunakan "editor" atau "viewer".'; [cite: 511]
  END IF;

  -- 5. Lakukan UPDATE
  UPDATE public.workspace_access
  SET role = p_new_role
  WHERE workspace_id = p_workspace_id AND user_id = p_user_id_to_update;
END;
$$;

4. RPC: get_events_in_range (No. 14)
Tujuan: Mengambil semua event (termasuk yang berulang) dalam rentang tanggal.

CREATE OR REPLACE FUNCTION get_events_in_range(
    p_workspace_id uuid, 
    p_start_date timestamptz, 
    p_end_date timestamptz
)
RETURNS SETOF events ...
BEGIN
  -- 1. Query Pertama: Ambil semua event BIASA (non-berulang)
  RETURN QUERY
  SELECT * FROM public.events e
  WHERE
    e.workspace_id = p_workspace_id AND
    e.recurrence_id IS NULL AND
    e.start_time <= p_end_date AND
    e.end_time >= p_start_date;

  -- 2. Query Kedua: "Hitung" event BERULANG
  RETURN QUERY
  SELECT
    e.id, ...,
    -- Hitung start_time & end_time baru untuk setiap perulangan
    (d.day::date + e.start_time::time)::timestamptz as start_time,
    (d.day::date + e.end_time::time)::timestamptz as end_time,
    ...
  FROM
    public.events e
  JOIN
    public.event_recurrence r ON e.recurrence_id = r.id
  -- 3. Buat seri tanggal virtual (misal: 1 Nov - 30 Nov)
  JOIN
    generate_series(p_start_date, p_end_date, '1 day'::interval) AS d(day) ON true
  WHERE
    e.workspace_id = p_workspace_id AND
    e.recurrence_id IS NOT NULL AND
    -- 4. Cek apakah hari (misal: 'MO') ada di aturan 'by_day'
    to_char(d.day, 'DY') = ANY(r.by_day);
END;
$$;