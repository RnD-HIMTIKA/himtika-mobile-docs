---
id: architecture-flow
title: Alur Arsitektur (Flutter)
sidebar_label: 5. Alur Arsitektur (Flutter)
---

# 🏗️ Alur Arsitektur (Flutter BLoC)

Di sisi Flutter, HiCode dikelola oleh beberapa BLoC yang spesifik untuk setiap layar.

## Alur 1: Membaca Chapter (`sub_chapter_detail.dart`)

[cite_start]Layar ini [cite: 467] adalah inti dari pengalaman belajar.

1.  **State:** Layar ini melacak `scroll_position` dan `has_reached_bottom`.
2.  [cite_start]**Debouncer:** Untuk mencegah "banjir" panggilan ke *database* saat *scroll*, kita menggunakan `_debounceTimer` (misal: 2 detik)[cite: 468].
3.  **Logika:**
    * Pengguna *scroll*.
    * `_scrollListener` aktif.
    * `_debounceTimer.cancel()` (batalkan timer lama).
    * `_debounceTimer = Timer(Duration(seconds: 2), ...)` (set timer baru).
    * **Setelah 2 detik tanpa *scroll***:
        * [cite_start]BLoC memanggil *Use Case* `UpdateScrollPosition`[cite: 468].
        * *Use Case* memanggil *Repository*, yang memanggil *Datasource*.
        * [cite_start]*Datasource* memanggil RPC `update_scroll_position` (No. 50) [cite: 390] dengan posisi *scroll* terakhir dan status `has_reached_bottom`.

4.  [cite_start]**Logika Tombol (UI Dinamis)[cite: 467]:**
    * [cite_start]Saat data dimuat dari RPC `get_hicode_chapter_content` (No. 49)[cite: 383]:
    * `IF (state.isQuizless == true)`:
        * Tampilkan Tombol "Selesai & Lanjutkan".
        * Tombol ini `disabled` sampai `state.isQuizUnlocked == true` (yang diatur RPC setelah *user* *scroll* ke bawah).
    * `ELSE`:
        * Tampilkan Tombol "Kerjakan Kuis".
        * Tombol ini `disabled` sampai `state.isQuizUnlocked == true`.

## Alur 2: Mengerjakan Ujian (`quiz_screen.dart`)

[cite_start]Layar ini [cite: 469] memiliki fitur keamanan (anti-curang).

1.  **`initState()`:**
    * [cite_start]`WakelockPlus.enable()`: Mencegah layar mati[cite: 469].
    * [cite_start]`NoScreenshot.instance.preventScreenshot()`: Memblokir *screenshot*[cite: 469].
    * Mendaftarkan *listener* `AppLifecycleState`.

2.  **`AppLifecycleState Listener` (Anti-Curang):**
    * Jika `state == AppLifecycleState.inactive` (misal: *user* menekan tombol *home* atau membuka *notification tray*):
    * [cite_start]Panggil fungsi `_autoSubmitQuiz()`[cite: 469].
    * BLoC memanggil *Use Case* `SubmitAnswers` dengan jawaban yang ada.
    * `Navigator.pop()` (Paksa *user* keluar dari kuis).

3.  **`PopScope` (Anti-Curang):**
    * Membungkus `Scaffold` dengan `PopScope`.
    * `onPopInvoked`: Jika *user* menekan tombol "Back" fisik/gestur.
    * Tampilkan dialog "Apakah Anda yakin ingin keluar? Progres akan otomatis disubmit."
    * Jika "Ya", panggil `_autoSubmitQuiz()`.

4.  `dispose()`:
    * `WakelockPlus.disable()`.
    * `NoScreenshot.instance.allowScreenshot()`.
    * Batalkan *listener* `AppLifecycleState`.

## Alur 3: Berbagi Skor (`score_screen.dart`)

1.  [cite_start]**UI:** Layar ini [cite: 471] dibungkus dengan `RepaintBoundary` dan `Screenshot` *controller*.
2.  [cite_start]**State:** Menampilkan skor, jumlah benar, dll, yang diterima dari RPC `submit_hicode_answers` (No. 42)[cite: 317].
3.  **Logika Tombol "Share":**
    * [cite_start]Memanggil `screenshotController.capture()`[cite: 471].
    * Mendapatkan `Uint8List` (data gambar) dari *widget* kartu skor.
    * Menyimpan gambar ke direktori temporer.
    * [cite_start]Memanggil `Share.shareXFiles([XFile(path)])` (dari `share_plus`) [cite: 471] untuk membuka dialog *share* bawaan OS.