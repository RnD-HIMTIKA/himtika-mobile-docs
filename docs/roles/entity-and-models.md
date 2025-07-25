## 🧱 Entity & Model

### 📌 Pengantar

Dalam arsitektur clean architecture, perbedaan antara **Entity** dan **Model** sangat penting:

* **Entity**: merepresentasikan objek domain murni (tidak bergantung pada framework/DB/API).
* **Model**: digunakan untuk transformasi data dari/ke Supabase (data layer).

Kita juga menggunakan **Mapper** untuk mengubah `Model <=> Entity`.

---

### 📦 Entity List

Berikut adalah entity yang digunakan dalam sistem Role & Permission:

#### 1. `Permission`

```dart
class Permission {
  final String featureName;
  final String actionName;

  Permission({
    required this.featureName,
    required this.actionName,
  });

  String get key => '$featureName:$actionName';
}
```

#### 2. `RolePermission`

```dart
class RolePermission {
  final String roleId;
  final String permissionId;

  RolePermission({
    required this.roleId,
    required this.permissionId,
  });
```

#### 3. `Role`

```dart
class Role {
  final String id;
  final String name;
  final String groupName;

  Role({
    required this.id,
    required this.name,
    required this.groupName,
  });
```

#### 4. `UserRole`

```dart
class UserRole {
  final String userId;
  final String roleId;

  UserRole({
    required this.userId,
    required this.roleId,
  });
```

---

### 📦 Model List

Model disimpan di data layer dan digunakan untuk parsing JSON dari Supabase.

#### 1. `PermissionModel`

```dart
class PermissionModel {
  final String featureName;
  final String actionName;

  PermissionModel({
    required this.featureName,
    required this.actionName,
  });

  factory PermissionModel.fromJson(Map<String, dynamic> json) {
    return PermissionModel(
      featureName: json['feature_name'],
      actionName: json['action_name'],
    );
  }

  Map<String, dynamic> toJson() => {
    'feature_name': featureName,
    'action_name': actionName,
  };
}
```

#### 2. `RolePermissionModel`

```dart
class RolePermissionModel {
  final String roleId;
  final String permissionId;

  RolePermissionModel({
    required this.roleId,
    required this.permissionId,
  });

  factory RolePermissionModel.fromJson(Map<String, dynamic> json) {
    return RolePermissionModel(
      roleId: json['role_id'],
      permissionId: json['permission_id'],
    );
  }

  Map<String, dynamic> toJson() => {
    'role_id': roleId,
    'permission_id': permissionId,
  };
}
```

#### 3. `RoleModel`

```dart
class RoleModel {
  final String id;
  final String name;
  final String groupName;

  RoleModel({
    required this.id,
    required this.name,
    required this.groupName,
  });

  factory RoleModel.fromJson(Map<String, dynamic> json) {
    return RoleModel(
      id: json['id'],
      name: json['name'],
      groupName: json['group_name'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'group_name': groupName,
  };
```

#### 4. `UserRoleModel`

```dart
class UserRoleModel {
  final String userId;
  final String roleId;

  UserRoleModel({
    required this.userId,
    required this.roleId,
  });

  factory UserRoleModel.fromJson(Map<String, dynamic> json) {
    return UserRoleModel(
      userId: json['user_id'],
      roleId: json['role_id'],
    );
  }

  Map<String, dynamic> toJson() => {
    'user_id': userId,
    'role_id': roleId,
  };
```

---

### 🔁 Mapper

Mapper digunakan untuk mengkonversi Model ke Entity dan sebaliknya.

#### Contoh: `PermissionMapper`

```dart
class PermissionMapper {
  static Permission toEntity(PermissionModel model) => Permission(
    featureName: model.featureName,
    actionName: model.actionName,
  );

  static PermissionModel toModel(Permission entity) => PermissionModel(
    featureName: entity.featureName,
    actionName: entity.actionName,
  );
}
```

---

✅ Jika sudah, lanjut ke `repository-structure.md`.