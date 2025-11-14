---
id: security-rls
title: Keamanan (RLS & RPC)
sidebar_label: 4. Keamanan (RLS & RPC)
---

# 🔒 Keamanan (RLS & RPC)

Keamanan Admin Panel ini **lebih canggih** daripada RLS biasa. Kita menggunakan 2 lapisan keamanan:

### Lapisan 1: RLS (Satpam Database)

RLS di tabel `public.user_roles` diatur sangat ketat:

1.  **BACA (SELECT):** Pengguna HANYA boleh melihat *role* miliknya sendiri (`Allow user to read own roles` [cite: RLS.txt (43)]).
2.  **TULIS (INSERT, UPDATE, DELETE):** **DITOLAK UNTUK SEMUA ORANG**.
    * Karena RLS diaktifkan dan kita **tidak** memberikan kebijakan (policy) `INSERT`, `UPDATE`, atau `DELETE` untuk *user* biasa, maka secara *default* tidak ada yang bisa mengubah tabel `user_roles` secara langsung.

**Lalu, bagaimana Admin bisa mengubah *role*?** Jawabannya ada di Lapisan 2.

### Lapisan 2: RPC `SECURITY DEFINER` (Pintu Super Admin)

RPC (fungsi) yang kita bedah di halaman sebelumnya (`update_user_pengurus_roles` [cite: RPC.txt (348)]) memiliki *setting* ajaib: `SECURITY DEFINER`.

* `SECURITY INVOKER` (Default): Fungsi berjalan dengan hak akses *user* yang memanggilnya (Kena RLS).
* `SECURITY DEFINER` (Mode Admin): Fungsi berjalan dengan hak akses **pemilik fungsi** (yaitu *service_role* / Admin), **melewati semua RLS** [cite: RPC.txt (348)].

Ini menciptakan satu-satunya "Pintu Aman" ke tabel `user_roles`. *User* tidak bisa `INSERT` manual, tapi mereka bisa *meminta* RPC ini untuk melakukannya.

### Lapisan 3: Keamanan di Flutter (Satpam Pintu)

Sekarang kita punya "Pintu Super Admin" (`update_user_pengurus_roles`). Kita harus pastikan hanya Admin yang bisa mengetuk pintu itu.

Keamanan ini ada di **aplikasi Flutter**:
1.  Saat *startup*, aplikasi mengecek *role* *user* yang login.
2.  Jika *user* memiliki *role* seperti "Ketua Himpunan" atau "RnD" (didefinisikan di dalam kode Flutter), aplikasi akan **menampilkan** tombol "Admin Panel".
3.  Jika *user* adalah "Pengunjung", aplikasi **menyembunyikan** tombol "Admin Panel".

**Kesimpulan:**
* **Satpam 1 (Flutter):** Menyembunyikan Pintu Admin dari *user* biasa.
* **Satpam 2 (RLS):** Memblokir semua Pintu Samping (akses `INSERT` langsung).
* **Pintu Resmi (RPC):** Satu-satunya jalan masuk, yang memiliki logika keamanan internal (pengecekan *role* eksklusif).