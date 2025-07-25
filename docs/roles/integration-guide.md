## 🔌 Integration Guide - Menggunakan Sistem Roles & Permission

Dokumentasi ini menjelaskan **cara menggunakan sistem Role & Permission** pada fitur-fitur lain di dalam aplikasi, tanpa perlu memahami detail teknis di baliknya.

---

### 🚀 Tujuan Integrasi

Agar setiap fitur dapat:

* Menentukan siapa saja yang **boleh mengakses**.
* Menyembunyikan tombol, halaman, atau menu berdasarkan **hak akses**.
* Menghindari if-else hardcoded role di seluruh kode.

---

### 🧠 Yang Perlu Diketahui Developer Fitur

1. Tidak perlu akses database langsung
2. Tidak perlu memanggil Supabase langsung
3. Cukup gunakan **`RolesController`** yang sudah disiapkan

---

### 🔑 Fungsi yang Bisa Digunakan

#### ✅ Cek Akses User

```dart
final canEdit = await rolesController.can(userId, 'news', 'edit');
if (canEdit) {
  showEditButton();
}
```

#### ✅ Cek Akses Role

```dart
final canAdminAdd = await rolesController.canRole(roleId, 'user', 'create');
```

#### ✅ Ambil Semua Fitur yang Bisa Diakses

```dart
final features = await rolesController.getFeatures(userId);
```

#### ✅ Ambil Semua Aksi pada Fitur Tertentu

```dart
final actions = await rolesController.getActions(userId, 'news');
```

---

### 🎯 Kapan Perlu Digunakan?

| Situasi                                        | Gunakan                    |
| ---------------------------------------------- | -------------------------- |
| Menyembunyikan tombol berdasarkan hak akses    | `rolesController.can(...)` |
| Menyembunyikan menu jika tidak punya akses     | `rolesController.can(...)` |
| Memvalidasi submit hanya jika user punya akses | `rolesController.can(...)` |
| Mengecek fitur apa saja yg bisa diakses        | `getFeatures()`            |

---

### 🛠️ Contoh Implementasi

#### 🔘 Menyembunyikan Tombol "Edit Berita"

```dart
Widget build(BuildContext context) {
  return FutureBuilder<bool>(
    future: rolesController.can(userId, 'news', 'edit'),
    builder: (context, snapshot) {
      if (snapshot.connectionState != ConnectionState.done) {
        return SizedBox.shrink();
      }
      if (!snapshot.data!) return SizedBox.shrink();
      return ElevatedButton(
        onPressed: () => openEditPage(),
        child: Text('Edit'),
      );
    },
  );
}
```

#### 📃 Menampilkan Halaman Hanya untuk Role Tertentu

```dart
@override
void initState() {
  super.initState();
  rolesController.canRole(roleId, 'adminpanel', 'access').then((canAccess) {
    if (!canAccess) Navigator.of(context).pop();
  });
}
```

---

### 🗂️ Catatan Implementasi

* `feature` dan `action` berasal dari tabel `permissions` di Supabase.
* Format pemisahan adalah `feature:action`, contoh: `dashboard:view`, `user:create`
* Penamaan ini penting untuk **konsistensi di seluruh fitur**.

---

### ➕ Menambahkan Role / Permission Baru

1. Masuk ke Supabase UI → Table `permissions`
2. Tambah fitur baru:

```json
{
  "feature_name": "event",
  "action_name": "delete"
}
```

3. Tambahkan ke role via `role_permissions`

**Maka kode ini bisa langsung digunakan:**

```dart
await rolesController.can(userId, 'event', 'delete');
```

---

### 🧪 Testing Hak Akses

Gunakan halaman internal (sementara) atau debug console untuk:

```dart
final roles = await rolesController.getFeatures(userId);
print(roles);
```

---

### ✅ Kesimpulan

Dengan sistem ini, kamu cukup fokus pada fitur.
Hak akses ditentukan secara terpusat dan reusable.

---

### 📚 Lanjutkan ke:

* [`troubleshooting.md`](./troubleshooting.md) jika kamu mengalami kendala implementasi