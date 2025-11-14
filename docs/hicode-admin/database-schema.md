---
id: database-schema
title: Skema Database & Storage
sidebar_label: 2. Skema Database
---

# 🗃️ Skema Database & Storage

Admin Panel berinteraksi langsung dengan 5 tabel konten dan 1 *bucket* penyimpanan.

### A. Tabel Konten (CRUD Penuh oleh Admin)

1.  **`hicode_categories`:**
    * Menyimpan Kategori. Admin mengisi `name` dan `icon_url`.
2.  **`hicode_materials`:**
    * Menyimpan Materi. Admin mengisi `title`, `description`, `image_url`, `border_color`, dan `category_id`.
3.  **`hicode_chapters`:**
    * Menyimpan Bab. Admin mengisi `title`, `content` (JSONB dari Quill editor), `estimated_read_time`, `is_quizless`, dan `material_id`.
4.  **`hicode_questions`:**
    * Menyimpan Soal. Admin mengisi `question_text`, `image_url`, `question_type`, `difficulty`, dan `related_id` (ID Chapter/Materi).
5.  **`hicode_options`:**
    * Menyimpan Opsi Jawaban. Admin mengisi `option_text`, `image_url`, dan `is_correct`.

### B. Penyimpanan File (Storage Bucket)

Semua aset visual (ikon kategori, gambar materi, gambar di dalam *chapter*, gambar soal, gambar opsi) di-upload ke satu *bucket* khusus.

* **Nama Bucket:** `hicode_assets`
* **Keamanan:** *Bucket* ini diproteksi oleh RLS Storage yang sangat ketat.

### Diagram Alur Konten

```mermaid
erDiagram
    hicode_categories ||--|{ hicode_materials : "memiliki"
    hicode_materials ||--|{ hicode_chapters : "memiliki"
    
    hicode_chapters ||--|{ hicode_questions : "memiliki (QUIZ)"
    hicode_materials ||--|{ hicode_questions : "memiliki (FINAL_PRACTICE)"
    
    hicode_questions ||--|{ hicode_options : "memiliki"

    "hicode_assets (Storage)" }|..|{ hicode_categories : "menyimpan icon_url"
    "hicode_assets (Storage)" }|..|{ hicode_materials : "menyimpan image_url"
    "hicode_assets (Storage)" }|..|{ hicode_chapters : "menyimpan image_url (di JSON)"
    "hicode_assets (Storage)" }|..|{ hicode_questions : "menyimpan image_url"
    "hicode_assets (Storage)" }|..|{ hicode_options : "menyimpan image_url"
---