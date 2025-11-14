---
id: architecture-flow
title: Alur Arsitektur (Flutter)
sidebar_label: 5. Alur Arsitektur (Flutter)
---

# 🏗️ Alur Arsitektur (Flutter BLoC)

Di aplikasi Flutter, semua logika Auth ditangani oleh `AuthBloc`.

## Alur Login (Email & Password)

1.  **UI (`login_screen.dart`):**
    * Pengguna mengisi email dan password, lalu menekan tombol "Login".
    * UI memanggil `context.read<AuthBloc>().add(LoginEvent(email, password))`.

2.  **BLoC (`auth_bloc.dart`):**
    * BLoC menerima `LoginEvent`.
    * Ia segera `emit(AuthState.Loading)` untuk menampilkan *loading spinner*.
    * Ia memanggil *method* dari *repository*: `final result = await _authRepository.login(event.email, event.password)`.
    * `result` ini adalah `Either<Failure, User>`.
    * **Jika Gagal (`Left`):** `emit(AuthState.Error("Password salah"
    ))`. (Pesan *error* profesional, bukan pesan teknis dari Supabase).
    * **Jika Berhasil (`Right`):** `emit(AuthState.Authenticated(user))` dan pengguna diarahkan ke *home screen*.

3.  **Repository (`auth_repository_impl.dart`):**
    * *Method* `login` dipanggil.
    * Tugasnya adalah memanggil *datasource* dan menangkap *error* Supabase.
    * `try { ... } catch (e) { return Left(ServerFailure(e.message)); }`

4.  **Datasource (`auth_remote_datasource.dart`):**
    * Ini adalah satu-satunya *file* yang "menyentuh" Supabase.
    * `await supabaseClient.auth.signInWithPassword(email: email, password: password);`

## Alur Submit Profil (Update Data)

Saat pengguna mengisi profil (misal: `full_name` baru), alurnya sedikit berbeda.

1.  **UI (`profile_screen.dart`):**
    * Pengguna menekan "Simpan Profil".
    * UI memanggil BLoC, misal: `context.read<ProfileBloc>().add(UpdateProfileEvent(newName))`.

2.  **BLoC (`profile_bloc.dart`):**
    * BLoC memanggil *use case* `SubmitProfileForm` (atau *repository* secara langsung).
    * `await _authRepository.updateProfile(newName)`.

3.  **Repository (`auth_repository_impl.dart`):**
    * Memanggil *datasource* untuk memperbarui tabel `public.users`.
    * `await _authRemoteDatasource.updateProfile(newName)`.

4.  **Datasource (`auth_remote_datasource.dart`):**
    * `await supabaseClient.from('users').update({'full_name': newName}).eq('auth_id', myAuthId);`

5.  **RLS (Di Supabase):**
    * RLS `public.users_update_own` akan mengecek: "Apakah `myAuthId` (dari aplikasi) SAMA DENGAN `auth.uid()` (pengguna yang login)?".
    * Jika Ya, `UPDATE` diizinkan. Jika Tidak, `UPDATE` gagal.