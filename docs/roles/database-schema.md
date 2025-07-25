## 🗃️ Database Schema: Role & Permission (Supabase)

Sistem role dan permission menggunakan 4 tabel utama dalam Supabase:

---

### 📊 ERD (Entity Relationship Diagram)

```
user_roles (user_id, role_id)
    └── 🔗 many-to-one ke users
    └── 🔗 many-to-one ke roles

roles (id, name, group_name)
    └── 🧱 menyimpan daftar peran/role

permissions (id, feature_name, action_name)
    └── 🧱 menyimpan daftar hak akses

role_permissions (role_id, permission_id)
    └── 🔗 many-to-one ke roles
    └── 🔗 many-to-one ke permissions
```

Tabel `users` tidak dijelaskan di sini karena berasal dari auth bawaan Supabase.

---

### 🧾 Penjelasan Tabel

#### 1. `roles`

| Field       | Tipe | Deskripsi                            |
| ----------- | ---- | ------------------------------------ |
| id          | UUID | Primary key                          |
| name        | text | Nama role (misal: Kahim, Sekretaris) |
| group\_name | text | Kelompok (opsional, untuk UI)        |

#### 2. `permissions`

| Field         | Tipe | Deskripsi                           |
| ------------- | ---- | ----------------------------------- |
| id            | UUID | Primary key                         |
| feature\_name | text | Nama fitur (misal: "news", "user")  |
| action\_name  | text | Aksi terhadap fitur (misal: "edit") |

Contoh data:

```
| feature_name | action_name |
|--------------|-------------|
| news         | create      |
| news         | edit        |
| user         | assign_role |
```

#### 3. `user_roles`

| Field    | Tipe | Deskripsi                  |
| -------- | ---- | -------------------------- |
| user\_id | UUID | ID user                    |
| role\_id | UUID | ID role yang dimiliki user |

User dapat memiliki lebih dari satu role (multi-role).

#### 4. `role_permissions`

| Field          | Tipe | Deskripsi                         |
| -------------- | ---- | --------------------------------- |
| role\_id       | UUID | Role pemilik permission           |
| permission\_id | UUID | Permission yang diberikan ke role |

---

### 🧪 Menambahkan data roles dan permission di supabase

Jika ingin menambahkan roles dan juga permission pada supabase bisa menggunakan sql berikut:

```sql
-- Role
INSERT INTO roles (id, name, group_name) VALUES
  (gen_random_uuid(), 'Kahim', 'Himpunan'),
  (gen_random_uuid(), 'Bendahara', 'Himpunan');

-- Permission
INSERT INTO permissions (id, feature_name, action_name) VALUES
  (gen_random_uuid(), 'news', 'create'),
  (gen_random_uuid(), 'news', 'edit'),
  (gen_random_uuid(), 'user', 'assign_role');

-- Role-Permission Mapping
INSERT INTO role_permissions (role_id, permission_id) VALUES
  ('{kahim_id}', '{news_create_id}'),
  ('{kahim_id}', '{user_assign_role_id}'),
  ('{bendahara_id}', '{news_create_id}');
```

---

Selanjutnya akan dijelaskan bagaimana struktur entity & model di Flutter sesuai dengan skema ini di `entity-and-models.md`. * [`entity-and-models.md`](./entity-and-models.md)