---
id: backend-logic-rpc
title: Logika Backend (RPC)
sidebar_label: 3. Logika Backend (RPC)
---

# 🧠 Logika Backend (RPC)

Admin Panel **tidak** mengubah *database* secara langsung. Semua aksi (Cari, Ambil List, Simpan) dilakukan dengan memanggil fungsi (RPC) di Supabase.

## 1. RPC: `search_admin_users` (No. 41)

* **Tujuan:** Mencari dan menampilkan daftar *user* untuk Admin.
* **Kenapa Dibutuhkan:** Kita butuh fungsi `SECURITY DEFINER` (mode admin) untuk mencari *semua* *user* dan *role* mereka, melewati batasan RLS "hanya lihat *role* sendiri" [cite: RLS.txt (43)].
* **CITE:** `RPC.txt (309-317)`

### Bedah Kode SQL

```sql
CREATE OR REPLACE FUNCTION public.search_admin_users(
    p_query text, -- Teks pencarian (nama, username, email, npm)
    p_scope text  -- Filter tambahan (misal: 'GENERAL')
)
RETURNS TABLE(...) -- Mengembalikan tabel user + roles
LANGUAGE sql
STABLE
SECURITY DEFINER -- Berjalan sebagai admin
AS $function$
    SELECT
        u.id as user_id,
        u.username,
        u.full_name,
        (
            -- 1. Menggabungkan semua role user menjadi satu JSON Array
            SELECT jsonb_agg(
                jsonb_build_object('id', r.id, 'name', r.name, 'group_name', r.group_name)
            )
            FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE
                ur.user_id = u.id
                -- 2. Filter: Hanya tampilkan role 'Pengurus' atau 'Angkatan'
                AND (p_scope = 'GENERAL' OR r.group_name IN ('Pengurus', 'Angkatan'))
        ) as roles
    FROM public.users u
    WHERE
        -- 3. Logika Pencarian: 'p_query' ada di mana saja
        p_query IS NULL OR p_query = '' OR
        u.full_name ILIKE '%' || p_query || '%' OR
        u.username ILIKE '%' || p_query || '%' OR
        u.email ILIKE '%' || p_query || '%' OR
        u.npm ILIKE '%' || p_query || '%'
    ORDER BY u.created_at DESC -- User terbaru di atas
    LIMIT 20;
$function$;
2. RPC: get_assignable_roles (No. 37)
Tujuan: Mengisi dropdown/checkbox di Admin Panel.

Kenapa Dibutuhkan: Admin tidak boleh memberi role "Angkatan_23" atau "Pengunjung". Fungsi ini memfilter agar Admin hanya bisa memberi role "Pengurus".

CREATE OR REPLACE FUNCTION public.get_assignable_roles()
RETURNS TABLE(id uuid, name text, group_name text) 
LANGUAGE sql
STABLE
AS $function$
    SELECT r.id, r.name, r.group_name
    FROM public.roles r
    -- INI ADALAH LOGIKA BISNIS UTAMA:
    WHERE r.group_name = 'Pengurus'
    ORDER BY r.name;
$function$;

3. RPC: update_user_pengurus_roles (No. 46)
Tujuan: Fungsi INTI untuk menyimpan perubahan role dari Admin Panel.

Kenapa Dibutuhkan: Ini adalah satu-satunya "pintu" aman untuk mengubah user_roles.

CREATE OR REPLACE FUNCTION public.update_user_pengurus_roles(
    p_user_id uuid,          -- User yang akan di-update
    p_role_ids_to_assign uuid[] -- Array/Daftar ID role BARU
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Berjalan sebagai admin
AS $function$
DECLARE
    exclusive_role_name TEXT;
    exclusive_role_id UUID;
    existing_user_id UUID;
BEGIN
    -- 1. LOGIKA KEAMANAN (ROLE EKSKLUSIF)
    -- Loop untuk setiap role yang dianggap "eksklusif"
    FOREACH exclusive_role_name IN ARRAY ARRAY[
        'Ketua Himpunan', 'Wakil Ketua Himpunan', 
        'Sekretaris Umum', 'Wakil Sekretaris Umum', 
        'Bendahara Umum', 'Wakil Bendahara Umum'
    ]
    LOOP
        SELECT id INTO exclusive_role_id FROM public.roles 
        WHERE name = exclusive_role_name;
        
        -- Cek: Apakah role eksklusif ini ada di daftar role BARU?
        IF exclusive_role_id = ANY(p_role_ids_to_assign) THEN
            -- Cek: Apakah role ini sudah dipegang user LAIN?
            SELECT ur.user_id INTO existing_user_id
            FROM public.user_roles ur
            WHERE ur.role_id = exclusive_role_id 
              AND ur.user_id <> p_user_id -- (Bukan user saat ini)
            LIMIT 1;
            
            -- Jika sudah ada, GAGALKAN operasi!
            IF FOUND THEN
                RAISE EXCEPTION 'Role "%" sudah dipegang oleh pengguna lain.', 
                exclusive_role_name; [cite: RPC.txt (349)]
            END IF;
        END IF;
    END LOOP;

    -- 2. LOGIKA UTAMA (WIPE AND REPLACE)
    -- Hapus SEMUA role 'Pengurus' LAMA milik user ini
    DELETE FROM public.user_roles
    WHERE user_id = p_user_id
      AND role_id IN (SELECT id FROM public.roles WHERE group_name = 'Pengurus'); [cite: RPC.txt (352-353)]

    -- 3. Masukkan SEMUA role BARU dari daftar
    IF array_length(p_role_ids_to_assign, 1) > 0 THEN
        INSERT INTO public.user_roles(user_id, role_id)
        SELECT p_user_id, unnest(p_role_ids_to_assign)
        ON CONFLICT (user_id, role_id) DO NOTHING; [cite: RPC.txt (355-357)]
    END IF;

END;
$function$;