🧱 Struktur Dokumentasi Sistem Role & Permission (Docusaurus)

📂 Struktur Folder Dokumentasi

docs/
└── roles/
    ├── overview.md
    ├── database-schema.md
    ├── entity-and-models.md
    ├── repository-structure.md
    ├── usecases.md
    ├── controller.md
    ├── integration-guide.md
    └── troubleshooting.md

📘 Penjelasan Konten Masing-Masing File

1. overview.md

Deskripsi umum tentang fitur Role & Permission

Tujuan dibuat: untuk mengontrol hak akses user secara terstruktur

Perbandingan dengan sistem hardcoded

Alasan memakai Supabase sebagai backend penyimpanan

2. database-schema.md

Visualisasi ERD (berdasarkan Supabase)

Penjelasan masing-masing tabel:

roles

permissions

user_roles

role_permissions

Contoh isi data awal untuk pengujian

3. entity-and-models.md

Penjelasan konsep Entity (domain) dan Model (data layer)

Perbedaan Permission vs RolePermission

Daftar:

Entity: Permission, RolePermission, Role, UserRole

Model: PermissionModel, RolePermissionModel, ...

Mapper: PermissionMapper, dst.

4. repository-structure.md

Interface: RolesRepository

Implementasi: RolesRepositoryImpl

DataSource: RolesRemoteDatasource

Pemanggilan RPC: get_permissions_by_role(role_id)

5. usecases.md

Usecase pattern

Daftar:

GetUserPermissions

GetPermissionsByRole

(nanti bisa ditambah: AssignPermissionToRole, RevokePermissionFromRole)

6. controller.md

Deskripsi RolesController

Fungsi:

can(userId, feature, action)

canRole(roleId, feature, action)

getFeatures(userId)

getActions(userId, feature)

Alur interaksi antara controller ↔ usecase ↔ repo ↔ Supabase

7. integration-guide.md

Untuk tim frontend atau fitur lain

Cara memakai:

RolesController.can() untuk validasi button

RolesController.getFeatures() untuk toggle menu

Contoh kode (pada UI atau service layer)

8. troubleshooting.md

Masalah umum:

Salah tipe return (misal List vs List)

Permission kosong

Salah struktur Supabase

Solusi cepat / pengecekan yang perlu dilakukan