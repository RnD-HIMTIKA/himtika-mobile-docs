---
id: error-logging
title: Pelaporan Error (Sentry)
sidebar_label: 3. Pelaporan Error (Sentry)
---

# 🐞 Pelaporan Error (Sentry)

Di aplikasi rilis, kita tidak bisa melihat *error* di konsol. Jika aplikasi *crash* di HP pengguna, kita tidak akan pernah tahu.

**Solusi:** Kita menggunakan **Sentry**, sebuah layanan pelaporan *error* "licik tapi profesional"[cite: 175].

## Cara Kerja

1.  **Integrasi:** Kita menggunakan *package* `sentry_flutter` [cite: 175] yang diinisialisasi di `lib/main.dart` menggunakan `SENTRY_DSN` (Kunci Rahasia) kita.
2.  **Menangkap Error:**
    * **Masalah:** Menampilkan `e.toString()` (pesan error teknis) dari Supabase atau Flutter ke pengguna sangat tidak ramah (misal: "PostgrestException code 404")[cite: 174].
    * **Solusi:** Di **setiap** `catch` *block* di dalam BLoC kita (misal: `AuthBloc`, `HicodeBloc`), kita melakukan DUA hal[cite: 173]:
        1.  **`emit(SomeFailure("Koneksi gagal" atau "Terjadi kesalahan"))`:** Menampilkan pesan yang ramah ke pengguna[cite: 174].
        2.  **`Sentry.captureException(e, stackTrace)`:** Mengirim pesan teknis (`e.toString()` DAN `stackTrace`) secara diam-diam ke *dashboard* Sentry kita[cite: 175].

**Hasil:** Pengguna melihat pesan *error* yang sopan, sementara *developer* (kita) mendapatkan laporan *bug* yang lengkap dengan *stack trace* di *dashboard* Sentry untuk diperbaiki.

### Perbaikan Bug Sentry (Google Login Lambat)
* **Masalah:** Login Google (OAuth) dulu sangat lambat[cite: 143].
* **Penyebab:** Sentry mencoba melacak *callback URL* dari Supabase sebagai "navigasi".
* **Solusi:** Di `lib/main.dart`, konfigurasi Sentry memiliki `tracesSampler` yang diatur untuk **mengabaikan** *callback URL* Supabase agar tidak dilacak[cite: 143].