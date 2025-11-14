---
id: backend-logic-rpc
title: Logika Backend (RPC)
sidebar_label: 3. Logika Backend (RPC)
---

# 🧠 Logika Backend (RPC)

Setiap aksi CRUD di Admin Panel memanggil fungsi (RPC) `SECURITY DEFINER` di Supabase. Ini adalah satu-satunya cara untuk melewati RLS Admin-Only.

## A. RPC Tampilan (Membaca Data)

* **`get_admin_hicode_materials` (No. 35):**
    * Mengambil daftar materi untuk ditampilkan di halaman manajemen materi.
* **`get_admin_hicode_chapters` (No. 34):**
    * Mengambil daftar *chapter* untuk *satu* materi (dipakai di layar *drag-and-drop*).
* **`get_hicode_questions_admin` (No. 52):**
    * Mengambil daftar soal untuk Bank Soal. Mendukung *filtering* berdasarkan `p_question_type` dan `p_related_id`.
* **`get_all_materials_for_admin` (No. 54):**
    * Mengambil `id` dan `title` semua materi. Digunakan untuk mengisi *dropdown* filter di Bank Soal.
* **`get_all_chapters_for_admin` (No. 53):**
    * Mengambil `id` dan `title` (plus nama materi) semua *chapter*. Digunakan untuk mengisi *dropdown* filter di Bank Soal.
* **`get_material_details` (No. 59):**
    * Mengambil detail *satu* materi. Digunakan untuk mengisi form "Edit Materi".
* **`get_question_details` (No. 58):**
    * Mengambil detail *satu* soal (termasuk opsinya). Digunakan untuk mengisi form "Edit Soal".

## B. RPC Aksi (Menulis Data)

### CRUD Kategori
* `create_hicode_category` (No. 27)
* `update_hicode_category` (No. 43)
* `delete_hicode_category` (No. 30)

### CRUD Materi
* `create_hicode_material` (No. 29)
* `update_hicode_material` (No. 45)
* `delete_hicode_material` (No. 32)

### CRUD Chapter
* **`create_hicode_chapter` (No. 28):**
    * Logika Kunci: RPC ini **otomatis menentukan `order`** berdasarkan `MAX("order") + 1` untuk `material_id` tersebut. Admin tidak perlu mengisi urutan.
* **`update_hicode_chapter` (No. 44):**
    * Logika Kunci: Menggunakan `COALESCE(p_title, title)`. Artinya, ia hanya akan memperbarui *field* yang dikirim (tidak *null*). Ini sangat penting untuk *drag-and-drop*, di mana kita hanya mengirim `p_order` baru tanpa mengubah `p_title` atau `p_content`.
* **`delete_hicode_chapter` (No. 31)**

### CRUD Bank Soal (Paling Kompleks)

* **`create_hicode_question_with_options` (No. 51):**
    * Menerima `p_options` sebagai **JSONB Array**.
    * **Logika:**
        1.  `INSERT` ke `hicode_questions` (soal).
        2.  `LOOP` melalui JSON `p_options`.
        3.  `INSERT` ke `hicode_options` (jawaban) satu per satu.
* **`update_hicode_question_with_options` (No. 56):**
    * Menggunakan logika "Wipe and Replace".
    * **Logika:**
        1.  `UPDATE` data di `hicode_questions` (soal).
        2.  `DELETE FROM hicode_options WHERE question_id = p_question_id` (Hapus semua opsi lama).
        3.  `LOOP` melalui JSON `p_options` (opsi baru).
        4.  `INSERT` opsi baru ke `hicode_options`.
* **`delete_hicode_question` (No. 57):**
    * Hanya `DELETE FROM hicode_questions`.
    * Tabel `hicode_options` akan otomatis terhapus karena *foreign key* di *database* diatur ke `ON DELETE CASCADE`.