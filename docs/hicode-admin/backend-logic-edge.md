---
id: backend-logic-edge
title: Logika Storage (Edge Function)
sidebar_label: 4. Logika Storage (Edge)
---

# 🗑️ Logika Storage (Edge Function Cleanup)

Setiap kali Admin meng-upload gambar, file itu disimpan di *bucket* `hicode_assets`.

**Masalah:** Jika Admin menghapus *chapter* atau mengubah gambar soal, file gambar yang lama **tetap ada** di *storage* (disebut *Orphaned File* / File Yatim). Ini membuang-buang ruang penyimpanan.

**Solusi (Fitur Ditunda):** Otomatisasi pembersihan menggunakan Webhook dan Edge Function.

### 1. Pemicu: Database Webhooks

Kita harus menyiapkan Webhook di Supabase yang memanggil Edge Function `cleanup-storage` setiap kali Admin melakukan 2 aksi ini:

1.  **Aksi `DELETE`:**
    * Pada tabel: `hicode_questions`, `hicode_options`, `hicode_chapters`, `hicode_materials`.
    * Contoh: `on_question_delete_cleanup`.
2.  **Aksi `UPDATE`:**
    * Pada tabel: `hicode_questions`, `hicode_options`, `hicode_chapters`, `hicode_materials`.
    * Contoh: `on_question_update_cleanup`.

### 2. Fungsi: `cleanup-storage` (Edge Function)

Edge Function ini sangat cerdas. Ia menerima `payload` dari Webhook dan memutuskan file apa yang harus dihapus.

* **`getPathFromUrl(url)`:**
    * Helper untuk mengubah URL lengkap (misal: `.../storage/v1/object/public/hicode_assets/soal/img.png`) menjadi *file path* (`soal/img.png`).
* **`extractUrlsFromJson(content)`:**
    * Helper paling canggih. Ini membaca data `content` (JSONB Quill) untuk mencari semua URL `image` dan `video` yang tersembunyi di dalamnya.

### Bedah Logika Edge Function

```typescript
// Deno (TypeScript)

serve(async (req) => {
  const payload = await req.json();

  // 1. Jika event-nya INSERT, tidak ada yang perlu dihapus.
  if (payload.type === 'INSERT') {
    return new Response('Event INSERT, tidak ada file yang dihapus.');
  }

  // 2. Dapatkan SEMUA URL dari data LAMA (old_record)
  // Ini menggunakan getAllUrls() yg memanggil extractUrlsFromJson()
  const oldUrls = getAllUrls(payload.old_record);
  let newUrls = new Set<string>();

  // 3. Jika event-nya UPDATE, dapatkan SEMUA URL dari data BARU
  if (payload.type === 'UPDATE' && payload.record) {
    newUrls = getAllUrls(payload.record);
  }
  
  // 4. LOGIKA INTI: Tentukan file yang akan dihapus
  // (File yang ada di OLD) DIKURANGI (File yang ada di NEW)
  const urlsToDelete = new Set<string>();
  for (const url of oldUrls) {
    if (!newUrls.has(url)) {
      // URL ini ada di data lama, tapi TIDAK ADA di data baru. HAPUS!
      urlsToDelete.add(url);
    }
  }

  // 5. Ubah URL (https://...) menjadi File Path (soal/img.png)
  const filePaths = Array.from(urlsToDelete)
    .map(getPathFromUrl)
    .filter((path) => path !== null);

  // 6. Hapus file dari Storage menggunakan Kunci Admin
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME) // BUCKET_NAME = 'hicode_assets'
    .remove(filePaths); // Hapus semua file yatim
});