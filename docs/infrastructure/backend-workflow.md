---
id: backend-workflow
title: Alur Kerja Backend (WAJIB BACA)
sidebar_label: 5. Alur Kerja Backend (WAJIB!)
---

# ⚠️ Alur Kerja Backend (WAJIB BACA)

Dokumen ini berisi rekomendasi profesional **paling penting** untuk menjaga aplikasi tetap stabil.

## Poin Kuat & Risiko

* [cite_start]**Poin Kuat:** Aplikasi ini memusatkan logika bisnis yang kompleks di *backend* Supabase menggunakan **RPC (Fungsi SQL)** [cite: 194] [cite_start]dan **RLS (Keamanan)**[cite: 195]. Ini adalah *best practice* yang sangat baik dan membuat aplikasi Flutter tetap ringan.
* [cite_start]**RISIKO BESAR:** Mengubah RPC atau RLS di *dashboard* Supabase adalah **operasi *live***[cite: 196].

**Contoh Skenario Bencana:**
Anda ingin "memperbaiki" RPC `get_my_workspaces_with_members`[cite: 197]. Anda salah mengetik `JOIN` dan menyimpannya. **SAAT ITU JUGA**, aplikasi **semua pengguna** akan *crash* saat membuka kalender[cite: 197]. Tidak ada *"undo"*.

## Rekomendasi Alur Kerja (Sangat Disarankan)

**JANGAN PERNAH MENGUJI RPC/RLS LANGSUNG DI PROYEK PRODUKSI!**

Ikuti alur kerja aman ini:

1.  **Buat Proyek "Tempat Latihan":**
    * Buka Supabase. [cite_start]Buat proyek **Gratis** baru bernama `himfo-dev`[cite: 198].
2.  **Uji Coba di `himfo-dev`:**
    * [cite_start]Gunakan proyek `himfo-dev` ini sebagai "tempat latihan" Anda[cite: 199].
    * Salin skema *database* dari produksi ke `himfo-dev`.
    * [cite_start]Tulis atau ubah SQL untuk RPC atau RLS baru Anda di sini[cite: 199].
    * Uji fungsi tersebut di "SQL Editor" Supabase berkali-kali sampai Anda 100% yakin aman dan berfungsi.
3.  **Salin ke Produksi:**
    * [cite_start]**Setelah** terbukti aman di `himfo-dev`, barulah Anda **salin-tempel** SQL final tersebut ke SQL Editor proyek "Produksi" (kezvxliamqwfvlpuckvm)[cite: 200].

Alur kerja ini memisahkan lingkungan "Development" (`himfo-dev`) dan "Production" (`kezvxliamqwfvlpuckvm`), yang merupakan standar industri dan mencegah kerusakan fatal.