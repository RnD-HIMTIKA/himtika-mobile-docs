---
id: database-schema
title: Skema Database (Role Management)
sidebar_label: 2. Skema Database
---

# 🗃️ Skema Database (Role Management)

Admin Panel ini berinteraksi dengan 3 tabel utama untuk mengelola *role* pengguna.

### 1. `public.users` [cite: database.txt (440)]

* **Tujuan Admin:** Untuk **Membaca (Read)**.
* Admin perlu melihat daftar `full_name`, `username`, dan `npm` dari tabel ini untuk menemukan *user* yang ingin dikelola.

### 2. `public.roles` [cite: database.txt (436)]

* **Tujuan Admin:** Untuk **Membaca (Read)**.
* Tabel ini digunakan untuk mengisi *dropdown* atau *checkbox* di Admin Panel.
* Admin Panel secara spesifik hanya akan mengambil *role* di mana `group_name = 'Pengurus'` (Lihat RPC `get_assignable_roles` [cite: RPC.txt (290)]).

### 3. `public.user_roles` [cite: database.txt (438)]

* **Tujuan Admin:** Untuk **Menulis (Write)**.
* Ini adalah tabel "hasil". Saat Admin menekan "Simpan", logika *backend* (RPC `update_user_pengurus_roles`) akan **Menghapus (Delete)** *role* pengurus lama milik *user* dan **Menambahkan (Insert)** *role* pengurus yang baru ke tabel ini.

### Diagram Alur Interaksi Admin

```mermaid
flowchart TD
    Admin[👤 Admin]

    subgraph "Aplikasi Flutter (Admin Panel)"
        UI[📱 Halaman Admin]
        BLoC[AdminPanelBloc]
    end

    subgraph "Supabase (Backend)"
        RPC_Search[RPC: search_admin_users]
        RPC_GetRoles[RPC: get_assignable_roles]
        RPC_Update[RPC: update_user_pengurus_roles]

        T_Users(DB: public.users)
        T_Roles(DB: public.roles)
        T_UserRoles(DB: public.user_roles)
    end

    Admin -- Menggunakan --> UI
    UI -- Memuat Data --> BLoC
    UI -- Menyimpan Data --> BLoC

    BLoC -- Panggil --> RPC_Search
    BLoC -- Panggil --> RPC_GetRoles
    BLoC -- Panggil --> RPC_Update

    RPC_Search -- Baca --> T_Users
    RPC_Search -- Baca --> T_UserRoles
    RPC_GetRoles -- Baca --> T_Roles
    RPC_Update -- Hapus & Tulis --> T_UserRoles

---