## 🧠 Roles Controller

Controller adalah bagian dari **application layer** yang bertugas menjembatani UI dan domain/usecase.
Controller tidak tahu detail implementasi Supabase, hanya tahu cara memanggil usecase dan memberikan data ke UI.

---

### 📁 File: `roles_controller.dart`

```dart
abstract class IRolesController {
  Future<bool> can(String userId, String feature, String action);
  Future<bool> canRole(String roleId, String feature, String action);
  Future<List<String>> getFeatures(String userId);
  Future<List<String>> getActions(String userId, String feature);
  Future<List<Permission>> getPermissionsByRole(String roleId);
}

class RolesController implements IRolesController {
  final GetUserPermissions getUserPermissions;
  final GetPermissionsByRole getPermissionsByRoleUsecase;

  RolesController({
    required this.getUserPermissions,
    required this.getPermissionsByRoleUsecase,
  });

  @override
  Future<bool> can(String userId, String feature, String action) async {
    final permissions = await getUserPermissions(userId);
    return permissions.any((p) => p.key == '$feature:$action');
  }

  @override
  Future<bool> canRole(String roleId, String feature, String action) async {
    final permissions = await getPermissionsByRoleUsecase(roleId);
    return permissions.any((p) => p.key == '$feature:$action');
  }

  @override
  Future<List<String>> getFeatures(String userId) async {
    final permissions = await getUserPermissions(userId);
    return permissions.map((p) => p.featureName).toSet().toList();
  }

  @override
  Future<List<String>> getActions(String userId, String feature) async {
    final permissions = await getUserPermissions(userId);
    return permissions
        .where((p) => p.featureName == feature)
        .map((p) => p.actionName)
        .toList();
  }

  @override
  Future<List<Permission>> getPermissionsByRole(String roleId) async {
    return await getPermissionsByRoleUsecase(roleId);
  }
}
```

---

### 🔍 Penjelasan Method

| Method                             | Tujuan                                              |
| ---------------------------------- | --------------------------------------------------- |
| `can(userId, feature, action)`     | Apakah user memiliki permission tertentu?           |
| `canRole(roleId, feature, action)` | Apakah role memiliki permission tertentu?           |
| `getFeatures(userId)`              | Ambil semua fitur yg bisa diakses user              |
| `getActions(userId, feature)`      | Ambil daftar aksi untuk fitur tertentu              |
| `getPermissionsByRole(roleId)`     | Ambil seluruh permission milik role (dari Supabase) |

---

### 📦 Contoh Pemakaian

```dart
final canAccess = await rolesController.can(user.id, 'dashboard', 'view');
if (canAccess) {
  Navigator.push(...);
}

final isAdmin = await rolesController.canRole('ADMIN', 'user', 'create');
```

---

### 🔗 Lanjutkan ke:

* [`integration-guide.md`](./integration-guide.md) untuk melihat cara pakai controller di UI
* [`troubleshooting.md`](./troubleshooting.md) jika terjadi masalah implementasi