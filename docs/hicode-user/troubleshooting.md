---
id: troubleshooting
title: Troubleshooting (Masalah Umum)
sidebar_label: 6. Troubleshooting
---

# 🧯 Troubleshooting (Masalah Umum)

### ❌ Masalah 1: Saya sudah *scroll* ke bawah di *chapter* "Pendahuluan", tapi tombol "Selesai" tidak aktif.

* [cite_start]**Penyebab:** RPC `get_hicode_chapter_content` (No. 49) [cite: 383] [cite_start]gagal mengembalikan `is_quiz_unlocked = true`[cite: 389].
* **Solusi:**
    1.  [cite_start]Cek *log* panggilan RPC `update_scroll_position` (No. 50)[cite: 390]. Pastikan *event* `p_has_reached_bottom = true` terkirim.
    2.  Cek *database*. [cite_start]Apakah *chapter* tersebut memiliki `is_quizless = true`? [cite: 370]
    3.  Cek *database*. [cite_start]Apakah `hicode_user_progress` untuk *user* dan *chapter* tersebut sudah memiliki `has_reached_bottom = true`? [cite: 376]
    4.  Jika semua benar, *refresh* halaman (mungkin *state* BLoC belum diperbarui).

### ❌ Masalah 2: Saya lulus kuis *chapter* 1 (skor 100%), tapi *chapter* 2 masih terkunci.

* [cite_start]**Penyebab:** RPC `submit_hicode_answers` (No. 42) [cite: 317] gagal memperbarui status.
* **Solusi:**
    1.  [cite_start]Periksa *log* RPC `submit_hicode_answers`[cite: 317].
    2.  [cite_start]Pastikan `question_count_submitted` SAMA DENGAN `total_questions_in_quiz`[cite: 335].
    3.  [cite_start]Pastikan `correct_count` SAMA DENGAN `total_questions_in_quiz` (harus 100% untuk 'QUIZ')[cite: 335].
    4.  [cite_start]Jika syarat terpenuhi, pastikan `INSERT`/`UPDATE` ke `hicode_user_progress` SET `is_completed = true` [cite: 336] berhasil dieksekusi.

### ❌ Masalah 3: Saya sudah menyelesaikan semua materi, tapi "Ujian Akhir" masih terkunci.

* [cite_start]**Penyebab:** RPC `get_hicode_main_screen` (No. 47) [cite: 358] [cite_start]masih mengembalikan `all_materials_complete = false`[cite: 371].
* **Solusi:**
    1.  [cite_start]Cek tabel `hicode_material_progress`[cite: 372].
    2.  [cite_start]Pastikan **semua** materi (yang memiliki *chapter*) memiliki baris data `is_completed = true` untuk `user_id` Anda[cite: 365].
    3.  Ingat: Lulus *chapter* tidak sama dengan lulus *materi*. [cite_start]Anda harus lulus "Latihan Final" ('FINAL_PRACTICE') untuk setiap materi agar `hicode_material_progress.is_completed` menjadi `true` [cite: 337-338].

### ❌ Masalah 4: Saya tidak bisa mengambil Ujian Akhir, katanya harus menunggu.

* [cite_start]**Penyebab:** *Cooldown* mingguan aktif[cite: 470].
* **Solusi:** Ini adalah **fitur**. [cite_start]Cek RPC `check_overall_exam_availability` (No. 60)[cite: 428]. [cite_start]Fungsi ini hanya mengizinkan ujian jika `last_exam_timestamp` [cite: 431] [cite_start]Anda lebih lama (lebih tua) dari hari Senin jam 00:00 minggu ini[cite: 430, 434].