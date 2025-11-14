---
id: offline-handling
title: Penanganan Offline
sidebar_label: 4. Penanganan Offline
---

# 🌐 Penanganan Offline (ConnectivityBloc)

Aplikasi ini sangat bergantung pada koneksi ke Supabase. Apa yang terjadi jika internet pengguna putus?

**Solusi Buruk:** Memaksa pengguna pindah ke halaman "Tidak Ada Koneksi" (`lostsignal_screen.dart`). [cite_start]Ini adalah *User Experience* (UX) yang buruk[cite: 179].

**Solusi Profesional (yang kita pakai):**

1.  **BLoC Global `ConnectivityBloc`:**
    * [cite_start]Kita memiliki BLoC global bernama `ConnectivityBloc`[cite: 176].
    * BLoC ini didaftarkan sebagai **Singleton** (satu instansi untuk seluruh aplikasi) di `lib/core/injection_container.dart`[cite: 176].
    * Tugasnya hanya satu: mendengarkan status konektivitas perangkat dan `emit` status `Online` atau `Offline`.

2.  **BLoC Lain Mendengarkan:**
    * BLoC fitur utama (seperti `WorkspaceBloc`, `InvitationBloc`, `HicodeBloc`, `LeaderboardBloc`) **"mendengarkan"** perubahan *state* dari `ConnectivityBloc`[cite: 177].
    * **Contoh Alur:**
        1.  Pengguna membuka aplikasi dalam mode pesawat (Offline). `HicodeBloc` `emit` `HicodeOffline`.
        2.  Pengguna menyalakan WiFi.
        3.  `ConnectivityBloc` `emit` `Online`.
        4.  `HicodeBloc` mendeteksi perubahan ini.
        5.  [cite_start]`HicodeBloc` secara **otomatis** memicu *event* `add(RefreshHicodeDataEvent())` untuk mengambil data baru dari Supabase[cite: 177].

**Hasil:** Aplikasi secara otomatis me-*refresh* datanya saat pengguna kembali *online* tanpa *user* harus melakukan apa-apa.

[cite_start]Sebagai tambahan, kami juga mengimplementasikan **Pull-to-Refresh** manual di semua halaman utama (Notifikasi, Leaderboard, dll)[cite: 178].