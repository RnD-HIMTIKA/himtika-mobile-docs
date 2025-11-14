---
id: troubleshooting
title: Troubleshooting (Masalah Umum)
sidebar_label: 6. Troubleshooting
---

# 🧯 Troubleshooting (Masalah Umum)

### ❌ Masalah 1: Saya mencoba menyimpan *role* "Ketua Himpunan" untuk User B, tapi gagal dengan *error* "Role sudah dipegang oleh pengguna lain."

* **Penyebab:** RPC `update_user_pengurus_roles` sengaja dirancang untuk mencegah duplikasi *role* eksklusif.
* **Solusi:**
    1.  Cari siapa *user* (User A) yang saat ini memegang *role* "Ketua Himpunan".
    2.  Masuk ke Admin Panel untuk User A.
    3.  Hapus *role* "Ketua Himpunan" dari User A dan Simpan.
    4.  Kembali ke Admin Panel untuk User B dan tambahkan *role* "Ketua Himpunan".

### ❌ Masalah 2: Saya tidak bisa menemukan *role* "Angkatan_23" atau "Teknik Informatika" di daftar *checkbox* Admin Panel.

* **Penyebab:** Ini disengaja. Admin Panel *hanya* menampilkan *role* yang bisa di-assign.
* **Solusi:**
    1.  Cek kode RPC `get_assignable_roles` [cite: RPC.txt (290)].
    2.  Fungsi itu hanya mengambil *role* dengan `group_name = 'Pengurus'`.
    3.  *Role* "Angkatan" dan "Prodi" di-assign **otomatis** oleh RPC `handle_new_user` [cite: RPC.txt (141)] saat registrasi dan tidak boleh diubah manual.

### ❌ Masalah 3: User B sudah saya set sebagai "RnD", tapi dia tidak bisa mengakses Admin Panel HiCode.

* **Penyebab:** Nama *role* tidak sinkron.
* **Solusi:**
    1.  Buka tabel `public.roles`. Pastikan nama *role* tertulis "RnD".
    2.  Buka dokumentasi HiCode Admin (`docs/hicode-admin/security-rls.md`).
    3.  Lihat kebijakan RLS Admin HiCode [cite: RLS.txt (No. 7, 8, 10, dsb.)].
    4.  Cek daftar *array* di RLS tersebut: `r.name = ANY (ARRAY['Ketua Himpunan', '...', 'Edukasi', 'RnD'])`.
    5.  Pastikan ejaan "RnD" di tabel `roles` **sama persis** dengan ejaan di dalam `ARRAY` RLS tersebut. Jika berbeda (misal: "Rnd"), maka RLS akan gagal.