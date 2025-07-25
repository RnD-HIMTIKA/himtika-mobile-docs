## 🧯 Troubleshooting Umum - Role & Permission

Dokumen ini membantu developer dalam mengatasi masalah umum yang sering muncul saat menggunakan sistem Role & Permission.

---

### ❌ 1. `The getter 'key' isn't defined for type RolePermission`

**Penyebab:**

* Kamu mungkin salah pakai `RolePermission`, padahal `key` hanya ada di `Permission`

**Solusi:**

* Pastikan `getPermissionsByRole()` me-return List<Permission>, bukan List<RolePermission>

```dart
// ❌ SALAH:
Future<List<RolePermission>> getPermissionsByRole(...) // ini tidak punya key

// ✅ BENAR:
Future<List<Permission>> getPermissionsByRole(...) // key tersedia
```

---

### ❌ 2. `toEntity()` tidak tersedia di model tertentu

**Penyebab:**

* Langsung memanggil `.toEntity()` pada model seperti `PermissionModel`, padahal seharusnya lewat `Mapper`

**Solusi:**

* Gunakan `PermissionMapper.toEntity(model)` atau `RolePermissionMapper.toEntity(model)`

```dart
// ❌ SALAH:
final entity = model.toEntity();

// ✅ BENAR:
final entity = PermissionMapper.toEntity(model);
```

---

### ❌ 3. `fromMap()` tidak dikenali

**Penyebab:**

* Method `fromMap` tidak tersedia di model, tapi digunakan di `RemoteDatasource`

**Solusi:**

* Gunakan `fromJson` jika semua model kamu sudah pakai nama itu
* Atau pastikan kamu memang punya method `fromMap()`

---

### ❌ 4. `A value of type List<Permission> can't be returned...`

**Penyebab:**

* Return type di interface atau controller tidak cocok dengan isi fungsi (mismatch)

**Solusi:**

* Sinkronkan tipe data antara controller, usecase, dan repository.

```dart
// ✅ Pastikan ini cocok semua:
Future<List<Permission>> getPermissionsByRole(String roleId)
```

---

### ⚠️ 5. Tidak bisa toggle UI berdasarkan role

**Penyebab:**

* Kamu belum pakai controller atau belum mengecek permission sebelum render UI

**Solusi:**

* Gunakan:

```dart
final canEdit = await rolesController.can(userId, 'news', 'edit');
if (canEdit) showEditButton();
```

---

### ❓ 6. Tidak yakin permission-nya kepakai atau belum

**Solusi:**

* Di Supabase, cek isi tabel `permissions`, lalu cek `role_permissions` untuk tahu apakah sudah di-assign ke role
* Gunakan method `getPermissionsByRole(roleId)` lalu print hasilnya

```dart
final permissions = await rolesController.getPermissionsByRole(roleId);
print(permissions.map((e) => e.key).toList());
```

---