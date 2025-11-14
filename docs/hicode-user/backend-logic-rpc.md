---
id: backend-logic-rpc
title: Logika Backend (RPC)
sidebar_label: 3. Logika Backend (RPC)
---

# 🧠 Logika Backend (RPC)

Logika HiCode 99% ada di *backend* (RPC). Aplikasi Flutter hanya bertugas memanggil fungsi dan menampilkan hasilnya. Semua RPC ini berjalan sebagai `SECURITY DEFINER` (Mode Admin) untuk membaca data materi/soal yang diamankan RLS.

## 1. RPC: `get_hicode_main_screen` (No. 47)

* **Tujuan:** Mengambil semua data untuk layar utama HiCode dalam satu panggilan.
* **CITE:** `RPC.txt (358-372)`
* **Logika:**
    1.  [cite_start]Mengambil daftar `hicode_categories`[cite: 361].
    2.  [cite_start]Mengambil daftar `hicode_materials`[cite: 362].
    3.  [cite_start]Untuk setiap materi, menghitung `total_chapters` dan `completed_chapters` (dengan *subquery* ke `hicode_user_progress`)[cite: 362].
    4.  [cite_start]Mengecek kelengkapan **semua** materi (untuk membuka Ujian Akhir) [cite: 363-367].
    5.  [cite_start]Memanggil RPC `check_overall_exam_availability` (No. 60) untuk mengecek *cooldown* mingguan[cite: 368].
    6.  [cite_start]Mengembalikan JSON berisi: `categories`, `materials`, `all_materials_complete`, `can_take_exam_today`, dan `next_exam_available_at` [cite: 370-372].

## 2. RPC: `get_chapter_list` (No. 48)

* **Tujuan:** Mengambil daftar isi (bab) dari satu materi yang dipilih.
* **CITE:** `RPC.txt (372-383)`
* **Logika:**
    1.  [cite_start]Mengambil info dasar materi (judul, deskripsi)[cite: 373].
    2.  [cite_start]Mengambil jumlah soal Latihan Final (`FINAL_PRACTICE`) untuk materi ini[cite: 376].
    3.  [cite_start]Mengambil daftar `hicode_chapters`[cite: 377].
    4.  [cite_start]Untuk setiap *chapter*, RPC ini mengecek `is_completed` dan `is_locked`[cite: 379].
    5.  [cite_start]Logika `is_locked`: *Chapter* dianggap terkunci jika `order > 1` DAN *chapter* sebelumnya (`order - 1`) belum `is_completed = true`[cite: 380].
    6.  [cite_start]Mengecek status Latihan Final (`final_practice_status`): 'unlocked' jika semua *chapter* selesai, jika tidak 'locked'[cite: 381].

## 3. RPC (Ganda): Membaca Chapter

Ada dua RPC yang bekerja sama saat pengguna membaca materi:

### [cite_start]A. `get_hicode_chapter_content` (No. 49) [cite: 383-390]
* **Tujuan:** Mengambil isi konten (blok Quill JS) dari satu *chapter*.
* **Logika (BARU):**
    1.  [cite_start]Mengambil data *chapter* (termasuk kolom `is_quizless`)[cite: 385].
    2.  [cite_start]Mengambil data progres *user* (termasuk `has_reached_bottom` dan `is_completed`)[cite: 387].
    3.  [cite_start]Mengembalikan status `is_quiz_unlocked`: Status ini `true` jika `has_reached_bottom = true` ATAU `is_completed = true`[cite: 389].
    * **Artinya:** Tombol "Kerjakan Kuis" / "Selesai" hanya aktif jika *user* sudah *scroll* ke bawah, atau jika *chapter*-nya memang sudah selesai.

### [cite_start]B. `update_scroll_position` (No. 50) [cite: 390-396]
* [cite_start]**Tujuan:** Dipanggil oleh Flutter (dengan *debounce* [cite: 468]) setiap kali *user* *scroll*.
* **Logika (BARU):**
    1.  Menerima `p_user_id`, `p_chapter_id`, `p_position`, `p_has_reached_bottom`.
    2.  [cite_start]Mengecek apakah *chapter* ini `is_quizless`[cite: 392].
    3.  [cite_start]Menentukan `v_should_be_completed`: Status ini akan `true` HANYA JIKA `p_has_reached_bottom = true` DAN `v_is_quizless = true`[cite: 393].
    4.  `INSERT` atau `UPDATE` tabel `hicode_user_progress`.
    5.  [cite_start]Jika `v_should_be_completed = true`, RPC ini **otomatis mengatur `is_completed = true`**[cite: 394].
    * [cite_start]**Artinya:** Untuk *chapter* "Hanya Baca", *chapter* dianggap selesai begitu *user* *scroll* ke bawah[cite: 465].

## 4. RPC: `get_hicode_questions` (No. 40)

* **Tujuan:** Mengambil soal untuk Kuis, Latihan Final, atau Ujian Akhir.
* **CITE:** `RPC.txt (299-301)`
* **Logika:**
    1.  Menerima `p_related_id` (ID Chapter/Materi) dan `p_question_type` ('QUIZ', 'FINAL_PRACTICE', 'OVERALL_EXAM').
    2.  `SECURITY DEFINER` (Mode Admin) untuk membaca tabel `hicode_questions` yang terproteksi RLS.
    3.  Mengambil semua soal yang cocok.
    4.  Mengambil semua opsi jawaban yang cocok.
    5.  [cite_start]**PENTING:** Mengacak urutan soal (`ORDER BY random()`) dan urutan opsi (`ORDER BY random()`)[cite: 300].

## 5. RPC: `submit_hicode_answers` (No. 42)

Ini adalah RPC **paling kompleks** di HiCode. Ini adalah "Mesin Penilai".

* **Tujuan:** Menerima jawaban *user*, menilai, menghitung skor, dan memperbarui progres.
* **CITE:** `RPC.txt (317-345)`
* **Logika:**
    1.  Menerima `p_user_id` dan `p_answers` (sebagai JSON array).
    2.  [cite_start]`question_count_submitted` = jumlah jawaban dari *user*[cite: 322].
    3.  *Looping* setiap jawaban:
        * [cite_start]Mengecek ke tabel `hicode_options` apa jawaban yang benar (`correct_option_id`)[cite: 324].
        * [cite_start]Jika jawaban *user* benar (`option_id_uuid = correct_option_id`) [cite: 327][cite_start], `correct_count` bertambah[cite: 327].
        * [cite_start]Skor ditambahkan berdasarkan `difficulty` (Mudah: +5, Menengah: +10, Sulit: +15) [cite: 328-330].
    4.  [cite_start]Mengambil Tipe Kuis (`first_question_type`) dari soal pertama [cite: 325-326].
    5.  [cite_start]**Anti-Cheat:** Mengambil `total_questions_in_quiz` (jumlah soal *sebenarnya*) dari **Database**, bukan dari *user* [cite: 332-333].
    6.  **Logika Kelulusan (Branching):**
        * [cite_start]**IF `first_question_type` = 'QUIZ'[cite: 335]:**
            * Syarat Lulus: `correct_count` HARUS SAMA DENGAN `total_questions_in_quiz` (Wajib 100%).
            * [cite_start]Jika lulus, `INSERT`/`UPDATE` `hicode_user_progress` SET `is_completed = true`[cite: 336].
        * [cite_start]**ELSE IF `first_question_type` = 'FINAL_PRACTICE'[cite: 337]:**
            * Syarat Lulus: `(correct_count / total_questions_in_quiz) >= 0.6` (Lulus 60%).
            * [cite_start]Jika lulus, `INSERT`/`UPDATE` `hicode_material_progress` SET `is_completed = true`[cite: 338].
        * [cite_start]**ELSE IF `first_question_type` = 'OVERALL_EXAM'[cite: 339]:**
            * [cite_start]Cek `p_time_taken_seconds`[cite: 340].
            * [cite_start]Ambil data `existing_leaderboard` *user*[cite: 341].
            * [cite_start]Jika skor baru > skor lama (ATAU skor sama TAPI waktu lebih cepat), `UPDATE` `hicode_leaderboard` [cite: 342-343].
            * [cite_start]Selalu `UPDATE` `last_exam_timestamp = now()`[cite: 343].
    7.  [cite_start]**Mengembalikan Hasil:** Mengembalikan JSON `{ 'score', 'correct_count', 'total_questions' }`[cite: 345].

## 6. RPC: `get_leaderboard` (No. 55) & `check_overall_exam_availability` (No. 60)

* **Tujuan:** Mengelola sisi kompetitif dan *cooldown* ujian.
* **CITE:** `RPC.txt (407-410)` dan `RPC.txt (428-434)`
* **Logika `get_leaderboard`:**
    1.  [cite_start]Menggabungkan (`JOIN`) `hicode_leaderboard` dengan `public.users` dan `auth.users` (untuk `username` dan *avatar*)[cite: 408].
    2.  [cite_start]Menggunakan `RANK()` *window function* untuk membuat peringkat[cite: 408].
    3.  [cite_start]Bisa memfilter "mingguan" (`weekly`) atau "semua" (`all`)[cite: 409].
* [cite_start]**Logika `check_overall_exam_availability` [cite: 428-434]:**
    1.  [cite_start]`start_of_current_week` = Senin jam 00:00 minggu ini[cite: 430].
    2.  [cite_start]`last_exam_time` = Ambil dari `hicode_leaderboard`[cite: 431].
    3.  [cite_start]Jika belum pernah ujian (`NOT FOUND`), `RETURN TRUE`[cite: 432].
    4.  [cite_start]**Kondisi Kunci:** `RETURN last_exam_time < start_of_current_week`[cite: 434].
    * **Artinya:** Jika ujian terakhirmu (Selasa) LEBIH BARU dari Senin, *return* `FALSE` (belum boleh). Jika ujian terakhirmu (Minggu lalu) LEBIH LAMA dari Senin, *return* `TRUE` (boleh).