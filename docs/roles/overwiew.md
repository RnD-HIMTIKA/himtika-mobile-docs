## 🔐 Overview - Sistem Role & Permission

Sistem **Role & Permission** adalah pondasi penting dalam aplikasi untuk mengatur siapa yang boleh mengakses fitur apa. Dengan sistem ini, aplikasi menjadi:

* ✅ Lebih aman (hanya role tertentu bisa akses fitur tertentu)
* ✅ Lebih fleksibel (fitur baru tinggal ditambahkan permission-nya)
* ✅ Lebih scalable (tidak perlu if-else panjang untuk pengecekan role)

---

### 🎯 Tujuan Dokumentasi Ini

Dokumentasi ini disusun untuk membantu developer memahami dan menggunakan sistem Role & Permission dengan:

* Penjelasan struktur database
* Penjabaran entity, model, usecase, repository, controller
* Contoh integrasi ke fitur lain
* Troubleshooting masalah umum

---

### 🏗️ Arsitektur yang Digunakan

Kami menerapkan **Clean Architecture** yang memisahkan domain, data, dan presentation layer. Fokus utama sistem Role & Permission ada pada:

* `domain/` : Entity dan Usecase
* `data/` : Model, Mapper, Repository Implementation, RemoteDatasource
* `application/` : Controller

---

### 🛢️ Mengapa Supabase?

Supabase digunakan sebagai penyedia backend karena:

* 🔌 Mendukung RPC (Remote Procedure Call)
* 🔐 Mendukung autentikasi & otorisasi native
* 💡 Sangat cocok untuk sistem dengan relasi antar tabel seperti role-permission

---

### ⚖️ Perbandingan: Tanpa vs Dengan Sistem Role

| Aspek                 | Tanpa Role-Permission                    | Dengan Role-Permission           |
| --------------------- | ---------------------------------------- | -------------------------------- |
| Hak akses             | Dihardcode di UI / backend               | Dikonfigurasi via tabel Supabase |
| Penambahan fitur baru | Perlu update manual pengecekan role      | Cukup tambah permission baru     |
| UI Dinamis            | Sulit toggle fitur berdasarkan hak akses | Bisa validasi button, menu, dll  |

---

### 🔄 Skema Akses

```
user_id -> user_roles -> roles -> role_permissions -> permissions
```

Setiap fitur seperti:

* `'news.edit'`
* `'dashboard.view'`

...akan didaftarkan sebagai permission di Supabase, lalu diberikan ke role tertentu.

---

### 📦 Contoh Kode Penggunaan

```dart
final canEdit = await rolesController.can(userId, 'news', 'edit');
if (canEdit) {
  showEditButton();
}
```

Fitur lain pun cukup memakai controller ini tanpa tahu bagaimana database atau repository bekerja.

---

### 📚 Lanjutkan ke:

* [`database-schema.md`](./database-schema.md) untuk melihat struktur tabel
* [`entity-and-models.md`](./entity-and-models.md) untuk tahu perbedaan Permission & RolePermission
* [`integration-guide.md`](./integration-guide.md) jika ingin langsung coba di UI