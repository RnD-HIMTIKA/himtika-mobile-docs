---
id: troubleshooting
title: Troubleshooting (Masalah Umum)
sidebar_label: 7. Troubleshooting
---

# 🧯 Troubleshooting (Masalah Umum)

### ❌ Masalah 1: Avatar pengguna Google (OAuth) tidak muncul / kotak abu-abu.

* **Penyebab:** Ini adalah *bug* lama. Data avatar Google ada di `auth.users`, tapi RLS memblokir `public.users` untuk mengaksesnya.
* **Solusi:** Pastikan RPC `get_my_workspaces_with_members` (No. 16) disetel ke `SECURITY DEFINER` di Supabase dan menggunakan logika SQL `COALESCE(u.profile_url, au.raw_user_meta_data->>'avatar_url')` untuk menggabungkan dua sumber avatar.

### ❌ Masalah 2: Crash `Bad state: Cannot add new events after calling close` saat membuka dialog "Share".

* **Penyebab:** Ini adalah *bug* manajemen *state* BLoC. `ShareWorkspaceBloc` dibuat saat dialog dibuka, dan langsung `close()` saat dialog ditutup, namun ada proses yang masih berjalan.
* **Solusi:** Jangan buat BLoC baru di dalam dialog. Gunakan `BlocProvider.value` untuk "melewatkan" BLoC yang sudah ada ke dalam dialog.

### ❌ Masalah 3: Undang berdasarkan *role* "FASILKOM" dan "Angkatan_23" malah mengundang semua "FASILKOM" ATAU "Angkatan_23".

* **Penyebab:** Logika RPC salah (menggunakan `WHERE ... = ANY` saja).
* **Solusi:** Cek kode RPC `invite_users_by_roles` (No. 22). Pastikan *query* SQL menggunakan `GROUP BY ur.user_id` yang diikuti dengan `HAVING COUNT(DISTINCT ur.role_id) = role_count` (di mana `role_count` adalah jumlah *role* yang dicari). Ini akan menerapkan logika "DAN" (AND).

### ❌ Masalah 4: Deep Link `.../join-workspace` tidak membuka aplikasi.

* **Penyebab:** Konfigurasi *Intent Filter* di Android salah.
* **Solusi:** Buka `android/app/src/main/AndroidManifest.xml`. Pastikan di dalam `<activity>` utama (yang memiliki `android.intent.action.MAIN`), terdapat `<intent-filter>` kedua untuk menangani *link* HTTPS. Filter ini harus berisi `<data android:scheme="https" android:host="himtika.cs.unsika.ac.id" android:pathPrefix="/join-workspace" />`.

### ❌ Masalah 5: Notifikasi pengingat *event* tidak terkirim atau terkirim berkali-kali.

* **Penyebab 1 (Tidak Terkirim):** Cron Job `check-event-reminders` gagal, atau *Secret* `FIREBASE_SERVICE_ACCOUNT` di Edge Function `event-reminder` salah.
* **Penyebab 2 (Terkirim Berkali-kali):** Logika di Edge Function `event-reminder` gagal melakukan `INSERT` ke tabel `public.sent_notifications` setelah berhasil mengirim.
* **Solusi:** Periksa *log* Cron Job dan *log* Edge Function di Supabase. Pastikan RPC `get_pending_notifications` berjalan normal dan tabel `sent_notifications` terisi setelah notifikasi terkirim.

### ❌ Masalah 6: Saya (Owner) tidak bisa mengubah *role* anggota.

* **Penyebab:** Anda mungkin mencoba mengubah *role* Anda sendiri, atau *role* yang Anda masukkan tidak valid.
* **Solusi:** Cek RPC `update_workspace_member_role` (No. 61). Pastikan Anda tidak mengubah *role* Anda sendiri (`current_user_id = p_user_id_to_update`) dan *role* baru yang Anda kirim adalah `'editor'` atau `'viewer'`.