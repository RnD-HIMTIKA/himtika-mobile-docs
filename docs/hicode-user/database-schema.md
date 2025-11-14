---
id: database-schema
title: Skema Database (HiCode)
sidebar_label: 2. Skema Database
---

# 🗃️ Skema Database (HiCode)

Fitur HiCode memiliki *database* sendiri yang terdiri dari 8 tabel utama.

### A. Tabel Konten (Dibuat oleh Admin)

1.  [cite_start]**`hicode_categories`[cite: 369]:**
    * Menyimpan Kategori (misal: "Web", "Mobile", "UI/UX").

2.  [cite_start]**`hicode_materials`[cite: 373]:**
    * Menyimpan Materi (misal: "Dasar Flutter"). Dihubungkan ke `category_id`.

3.  [cite_start]**`hicode_chapters`[cite: 370]:**
    * Menyimpan Chapter/Bab (misal: "Pengenalan Widget"). Dihubungkan ke `material_id`.
    * [cite_start]**Kolom Kunci (Baru):** `is_quizless` (boolean)[cite: 370, 464]. Jika `true`, *chapter* ini tidak punya kuis.

4.  [cite_start]**`hicode_questions`[cite: 375]:**
    * Menyimpan Bank Soal.
    * **Kolom Kunci:**
        * `related_id`: ID dari `hicode_chapters` (jika 'QUIZ') atau `hicode_materials` (jika 'FINAL_PRACTICE') atau ID unik (jika 'OVERALL_EXAM').
        * `question_type`: `'QUIZ'`, `'FINAL_PRACTICE'`, atau `'OVERALL_EXAM'`.
        * [cite_start]`difficulty`: `'Mudah'`, `'Menengah'`, `'Sulit'` (mempengaruhi skor) [cite: 328-330].

5.  [cite_start]**`hicode_options`[cite: 374]:**
    * Menyimpan Opsi Jawaban (Pilihan Ganda). Dihubungkan ke `question_id`.
    * **Kolom Kunci:** `is_correct` (boolean).

### B. Tabel Progres (Milik Pengguna)

6.  [cite_start]**`hicode_user_progress`[cite: 376]:**
    * **Tabel Penting.** Mencatat progres pengguna per *chapter*.
    * **Kolom Kunci:**
        * `user_id` dan `chapter_id` (Composite Key).
        * `is_completed`: (boolean) Apakah *chapter* ini sudah selesai (lulus kuis atau menekan "Selesai").
        * [cite_start]`last_scroll_position`: (double) Posisi *scroll* terakhir pengguna (0.0 - 1.0)[cite: 376].
        * [cite_start]`has_reached_bottom`: (boolean) Apakah pengguna sudah pernah *scroll* ke paling bawah[cite: 376].

7.  [cite_start]**`hicode_material_progress`[cite: 372]:**
    * Mencatat progres pengguna per *materi* (lulus Latihan Final).
    * **Kolom Kunci:** `user_id` dan `material_id`.
    * `is_completed`: (boolean) Apakah materi ini sudah selesai.

8.  [cite_start]**`hicode_leaderboard`[cite: 371]:**
    * **Tabel Penting.** Menyimpan skor tertinggi pengguna untuk "Ujian Akhir".
    * **Kolom Kunci:**
        * `user_id`: (Unique) Setiap *user* hanya punya 1 baris.
        * `highest_score`: Skor tertinggi yang pernah didapat.
        * `fastest_time_seconds`: Waktu pengerjaan tercepat (untuk *tie-breaker*).
        * [cite_start]`last_exam_timestamp`: Kapan terakhir kali mengambil ujian (untuk *cooldown* mingguan)[cite: 371].