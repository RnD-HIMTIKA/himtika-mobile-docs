---
id: architecture-flow
title: Alur Arsitektur (Flutter)
sidebar_label: 6. Alur Arsitektur (Flutter)
---

# 🏗️ Alur Arsitektur (Flutter Admin)

Di sisi Flutter, Admin Panel HiCode memiliki BLoC dan UI yang spesifik untuk mengelola konten.

## Alur 1: Mengurutkan Chapter (Drag-and-Drop)

* **UI:** `chapter_management_screen.dart`.
* **Widget:** Menggunakan `ReorderableListView.builder`.
* **BLoC:** `ChapterManagementBloc`.
* **Logika:**
    1.  Saat *user* selesai menarik (*drag*) dan melepas (*drop*) *widget* *chapter*:
    2.  `ReorderableListView` memanggil `onReorder` dengan `oldIndex` dan `newIndex`.
    3.  UI memanggil `context.read<ChapterManagementBloc>().add(UpdateChapterOrderEvent(chapters, oldIndex, newIndex))`.
    4.  **Optimistic Update:** BLoC langsung menghitung ulang urutan di sisi *client* (Flutter) dan `emit(ChapterOrderUpdated(newChapterList))` agar UI langsung berubah tanpa menunggu *database*.
    5.  **Background Process:** BLoC kemudian memanggil *repository* (`updateChapterOrder(newChapterList)`).
    6.  *Repository* melakukan *looping* pada `newChapterList` dan memanggil RPC `update_hicode_chapter` (No. 44) untuk setiap *chapter* yang urutannya (`order`) berubah, hanya mengirimkan `p_id` dan `p_order` baru.

## Alur 2: Menggunakan Text Editor (Quill)

* **UI:** `modify_chapter_dialog.dart`.
* **Konfigurasi:** `QuillEditorController` dikonfigurasi dengan `FlutterQuillEmbeds.editorBuilders()`.
* **Logika Upload Gambar:**
    1.  Konfigurasi *editor* memiliki *handler* `onImageUpload`.
    2.  *Handler* ini membuka galeri gambar (*user* memilih gambar).
    3.  Flutter memanggil *repository* `uploadHicodeAsset(file)`.
    4.  *Repository* memanggil *datasource*.
    5.  *Datasource* memanggil `supabaseClient.storage.from('hicode_assets').upload(...)`.
    6.  (RLS Storage memvalidasi apakah *user* ini Admin).
    7.  Jika berhasil, Supabase mengembalikan URL publik.
    8.  *Handler* `onImageUpload` mengembalikan URL tersebut ke *editor* Quill.
    9.  Quill memasukkan URL gambar ke dalam JSONB `content`.

## Alur 3: Filter Bank Soal

* **UI:** `question_bank_screen.dart`.
* **BLoC:** `QuestionBankBloc`.
* **Logika:**
    1.  UI memiliki 3 `DropdownButton` (Tipe, Materi, Chapter), masing-masing dengan `value` dari `state.selectedType`, `state.selectedMaterial`, `state.selectedChapter`.
    2.  Saat *user* mengubah *dropdown* "Materi":
    3.  UI memanggil `context.read<QuestionBankBloc>().add(FilterChangedEvent(newMaterial: ...))`.
    4.  BLoC menerima *event*, memperbarui *state*-nya, dan memanggil *repository* `getFilteredQuestions(type: state.selectedType, relatedId: state.selectedMaterial.id)`.
    5.  *Repository* memanggil *datasource*.
    6.  *Datasource* memanggil RPC `get_hicode_questions_admin` (No. 52) dengan parameter filter yang baru.
    7.  BLoC `emit(QuestionsLoaded(filteredQuestions))` dan UI di-render ulang.