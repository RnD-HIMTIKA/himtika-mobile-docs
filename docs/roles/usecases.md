## 🧠 Usecases - Logika Bisnis Role & Permission

Dalam clean architecture, usecase berfungsi sebagai jembatan antara **controller** dan **repository**.
Usecase menangani logika aplikasi dan aturan bisnis.

---

### 📦 Struktur Folder Usecases

```
domain/
└── usecases/
    ├── get_user_permissions.dart
    └── get_permissions_by_role.dart
```

---

### 🔍 Penjelasan Setiap Usecase

#### 1. `GetUserPermissions`

Digunakan untuk mengambil semua permission milik seorang user, berdasarkan semua role yang ia punya.

```dart
class GetUserPermissions {
  final RolesRepository repository;

  GetUserPermissions(this.repository);

  Future<List<Permission>> call(String userId) {
    return repository.getUserPermissions(userId);
  }
}
```

* 🧠 Secara internal akan memanggil RPC `get_user_permissions(user_id)` di Supabase
* Digunakan oleh `RolesController.can()`

#### 2. `GetPermissionsByRole`

Digunakan untuk mengambil semua permission milik satu role tertentu.

```dart
class GetPermissionsByRole {
  final RolesRepository repository;

  GetPermissionsByRole(this.repository);

  Future<List<Permission>> call(String roleId) {
    return repository.getPermissionsByRole(roleId);
  }
}
```

* 🧠 Secara internal akan memanggil RPC `get_permissions_by_role(role_id)`
* Digunakan oleh `RolesController.canRole()` dan fitur admin panel (nantinya)

---

### ✅ Kenapa Perlu Usecase

Tanpa usecase, controller akan langsung memanggil repository dan melanggar prinsip pemisahan tanggung jawab.
Dengan usecase:

* Reusable logic: bisa dipakai controller lain / fitur lain
* Mudah dites
* Terstruktur dan scalable

---

### 📚 Lanjutkan ke:

* [`controller.md`](./controller.md) untuk melihat bagaimana controller memakai usecase
* [`repository-structure.md`](./repository-structure.md) untuk melihat bagaimana usecase memanggil data