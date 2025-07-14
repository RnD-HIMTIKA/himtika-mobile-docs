---
id: roles-overview
title: Overview Roles
sidebar_label: Overview Roles
---

# Overview: Fitur User Roles & Permissions

Sistem **User Roles & Permissions** adalah pondasi utama dalam kontrol akses (access control) aplikasi HIMTIKA.

Setiap pengguna bisa memiliki satu atau lebih **Role**, dan setiap Role berisi kumpulan **Permission**.  
Dengan sistem ini, kita bisa mengatur:

- **Siapa** saja yang dapat mengakses fitur tertentu.
- **Level aksi** yang diizinkan (lihat, tambah, ubah, hapus).


---

## 🎯 Tujuan Sistem Roles

| Tujuan | Penjelasan |
|---------|------------|
| **Otorisasi Terpusat** | Semua kontrol hak akses disimpan dalam satu sistem terpusat (bukan di masing-masing fitur). |
| **Pengelolaan Hak Akses Dinamis** | Admin bisa menambah/cabut role dan permission tanpa perlu ubah kode fitur lain. |
| **Scalable** | Fitur baru cukup mendaftarkan permission baru dan assign ke role yang sesuai. |
| **Modular & Reusable** | Fitur lain tinggal panggil service roles, tidak perlu tahu detail implementasi. |

---

## 🗄️ Struktur Tabel di Supabase

| Tabel              | Deskripsi                                                                 |
| ----------------- | --------------------------------------------------------------------------|
| `roles`            | Daftar role seperti Kahim, RnD, Edukasi, Mahasiswa                        |
| `permissions`      | Hak akses granular: fitur + aksi (misal: `hicode:add`)                    |
| `role_permissions` | Relasi **banyak-ke-banyak** antara role dan permission                     |
| `user_roles`       | Relasi **banyak-ke-banyak** antara user dan role                           |

---

## ⚙️ Struktur Folder Kode

Struktur kode mengikuti **Clean Architecture dengan penyesuaian pragmatis**:

```plaintext
features/roles/
├── data/
│   ├── datasources/          <-- koneksi ke Supabase (CRUD, RPC)
│   ├── models/               <-- representasi data Supabase (DTO)
│   ├── repositories/         <-- implementasi RolesRepository (pakai mapper)
│   └── mappers/              <-- konversi Model <-> Entity
├── domain/
│   ├── entities/             <-- definisi Role, Permission, UserRole (Entity)
│   ├── repositories/         <-- abstract RolesRepository (interface)
│   └── usecases/             <-- business logic: assign, revoke, get permission
├── presentation/
│   └── bloc/                 <-- state management (Bloc untuk Admin Panel)
├── application/
│   └── roles_controller.dart <-- helper untuk fitur lain agar cek hak akses mudah

---

## 🧠 Konsep Penting

### Multi-Role Support
- 1 user bisa punya **lebih dari 1 role**.  
- Semua permission role tersebut akan **digabungkan** menjadi hak akses user.

---

### Mapper: Model ↔️ Entity
Agar data tetap bersih dan mengikuti Domain-Driven Design (DDD):

|            |                                                                        |
| ---------- | ---------------------------------------------------------------------- |
| **Model**  | Representasi langsung dari data Supabase (DTO / data transfer object). |
| **Entity** | Struktur murni untuk logika aplikasi (tanpa tergantung database).      |
| **Mapper** | Jembatan yang mengubah Model ↔️ Entity. (Tersimpan di `data/mappers/`) |

---

### RolesController (Helper untuk Fitur Lain)
Fitur lain (Forum, Kalender, dsb) tidak perlu tahu detail roles.
Cukup pakai RolesController untuk cek hak akses:

```dart
final rolesController = RolesController(getUserPermissions);

if (await rolesController.can(userId, 'forum', 'edit')) {
   // izinkan edit post
}

---

## 🔑 Contoh Kasus Akses

| Role      | Fitur        | Aksi yang Diizinkan           |
| --------- | ------------ | ----------------------------- |
| Mahasiswa | Hicode       | Lihat                         |
| Edukasi   | Hicode       | Lihat, Tambah, Ubah, Hapus    |
| Kahim     | Kelola Roles | Tambah, Cabut Role            |
| RnD       | Semua Fitur  | Akses Developer (Full Access) |

---

## 🔄 Flow Hak Akses (Diagram)

```mermaid
flowchart TD
    User -- punya --> Role
    Role -- punya --> Permission
    Fitur -- cek --> RolesController
    RolesController --> GetUserPermissionsUseCase
    GetUserPermissionsUseCase --> RolesRepository
    RolesRepository --> Supabase (via datasource)

---
## 🚀 Penggunaan di Fitur Lain
Fitur lain cukup panggil RolesController:

```dart
final canDelete = await rolesController.can(
  userId,
  'forum', 
  'delete',
);

if (canDelete) {
   // tampilkan tombol hapus post
}

---

## ❓ FAQ (Pertanyaan yang Sering Ditanyakan)

| Pertanyaan                                            | Jawaban                                                                    |
| ----------------------------------------------------- | -------------------------------------------------------------------------- |
| **Apakah bisa assign banyak role ke 1 user?**         | Bisa. Sistem mendukung multi-role.                                         |
| **Apakah fitur lain harus implementasi roles ulang?** | Tidak perlu. Cukup pakai `RolesController`.                                |
| **Kenapa pakai mapper?**                              | Agar memisahkan antara data Supabase (Model) dan logika aplikasi (Entity). |

---

## 📝 Catatan untuk Developer HIMTIKA Berikutnya
- Semua fitur baru yang butuh hak akses, wajib mendaftarkan permission baru di Supabase.
- Jangan langsung pakai query select role/permission di fitur lain. Selalu lewat RolesController.
- Dokumentasi ini akan terus berkembang seiring bertambahnya fitur.