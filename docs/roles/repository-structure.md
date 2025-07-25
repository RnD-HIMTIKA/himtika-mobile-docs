## 🗂️ Repository Structure - Role & Permission System

Dokumen ini menjelaskan arsitektur dan struktur kode dari layer repository, termasuk implementasi dan dependensi terkait sistem role & permission.

---

### 📁 Struktur File Terkait Repository

```
features/
└── roles/
    ├── domain/
    │   └── repositories/
    │       └── roles_repository.dart
    └── data/
        ├── datasources/
        │   └── roles_remote_datasource.dart
        ├── mappers/
        │   ├── permission_mapper.dart
        │   ├── role_mapper.dart
        │   ├── role_permission_mapper.dart
        │   └── user_role_mapper.dart
        └── repositories/
            └── roles_repository_impl.dart
```

---

### 📑 Interface: `RolesRepository`

File: `domain/repositories/roles_repository.dart`

Deklarasi abstrak dari semua fungsi utama sistem role.

```dart
abstract class RolesRepository {
  Future<List<Role>> getAllRoles(String userId);
  Future<void> assignRole(String userId, String roleId);
  Future<void> revokeRole(String userId, String roleId);

  Future<List<Permission>> getUserPermissions(String userId);
  Future<List<Permission>> getPermissionsByRole(String roleId);
  Future<List<RolePermission>> getPermissionsByRoleId(String roleId);

  Future<List<UserRole>> getUserRoles(String userId);
  Future<void> assignPermissionToRole(String roleId, String permissionId);
  Future<void> revokePermissionFromRole(String roleId, String permissionId);
}
```

---

### 🧩 Implementasi: `RolesRepositoryImpl`

File: `data/repositories/roles_repository_impl.dart`

Bertugas menghubungkan usecase ↔ remoteDatasource, dan mengelola konversi model ke entity dengan `Mapper`.

Contoh:

```dart
@override
Future<List<Permission>> getPermissionsByRole(String roleId) async {
  final models = await remoteDatasource.getPermissionsByRole(roleId);
  return models.map(PermissionMapper.toEntity).toList();
}
```

Semua dependensi eksternal (Supabase) hanya diakses dari `remoteDatasource`.

---

### 🌐 Remote DataSource: `RolesRemoteDatasource`

File: `data/datasources/roles_remote_datasource.dart`

Tugas:

* Berkomunikasi dengan Supabase
* Menjalankan RPC `get_user_permissions`, `get_permissions_by_role`
* Query table langsung (`roles`, `permissions`, `user_roles`, `role_permissions`)

Contoh:

```dart
Future<List<PermissionModel>> getPermissionsByRole(String roleId) async {
  final data = await _client.rpc(
    'get_permissions_by_role',
    params: {'role_id': roleId},
  );
  return List<Map<String, dynamic>>.from(data)
      .map(PermissionModel.fromJson)
      .toList();
}
```

---

### 🛠️ RPC: `get_permissions_by_role`

Disimpan di Supabase → digunakan oleh RemoteDatasource

```sql
-- get_permissions_by_role(role_id UUID)
SELECT p.*
FROM role_permissions rp
JOIN permissions p ON rp.permission_id = p.id
WHERE rp.role_id = role_id;
```

**Kelebihan:**

* Efisien
* Tidak perlu join manual dari aplikasi
* Bisa dipakai juga oleh layanan lain (misalnya: dashboard admin)

---

### 🧼 Best Practice & Catatan

* Semua model menggunakan `.fromJson()` dan `.toJson()` agar konsisten
* Konversi model → entity hanya boleh lewat Mapper, bukan `.toEntity()` langsung di model
* RemoteDatasource adalah satu-satunya titik akses Supabase
* Semua akses permission berbasis `role_id` menggunakan RPC agar efisien

---

✅ Selanjutnya akan dilanjut ke `usecases.md` jika kamu setuju.