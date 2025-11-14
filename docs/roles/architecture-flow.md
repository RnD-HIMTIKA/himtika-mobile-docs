---
id: architecture-flow
title: Alur Arsitektur (Flutter)
sidebar_label: 5. Alur Arsitektur (Flutter)
---

# 🏗️ Alur Arsitektur (Flutter BLoC)

Di sisi Flutter, fitur ini dikelola oleh (misalnya) `RoleManagementBloc`.

## Alur 1: Memuat Halaman Admin Panel

1.  **UI (`role_management_page.dart`):**
    * Halaman dibuka.
    * UI memanggil: `context.read<RoleManagementBloc>().add(LoadAdminDataEvent())`.

2.  **BLoC (`role_management_bloc.dart`):**
    * BLoC menerima `LoadAdminDataEvent`.
    * `emit(RoleManagementLoading())`.
    * Memanggil *repository* untuk 2 hal sekaligus:
        * `final users = await _repository.searchUsers(query: '', scope: 'GENERAL');`
        * `final roles = await _repository.getAssignableRoles();`
    * `emit(RoleManagementLoaded(users: users, assignableRoles: roles))`.

3.  **Repository (`role_repository_impl.dart`):**
    * *Method* `searchUsers` memanggil `_datasource.searchUsers(...)`.
    * *Method* `getAssignableRoles` memanggil `_datasource.getAssignableRoles(...)`.

4.  **Datasource (`role_remote_datasource.dart`):**
    * `_datasource.searchUsers` memanggil RPC: `supabaseClient.rpc('search_admin_users', ...)` [cite: RPC.txt (309)].
    * `_datasource.getAssignableRoles` memanggil RPC: `supabaseClient.rpc('get_assignable_roles')` [cite: RPC.txt (290)].

## Alur 2: Admin Menyimpan Perubahan

1.  **UI (`role_management_page.dart`):**
    * Admin menekan tombol "Simpan" pada User A.
    * UI memanggil: `context.read<RoleManagementBloc>().add(UpdateUserRolesEvent(userId: 'uuid-user-A', newRoleIds: ['uuid-role-1', 'uuid-role-2']))`.

2.  **BLoC (`role_management_bloc.dart`):**
    * BLoC menerima `UpdateUserRolesEvent`.
    * `emit(RoleManagementLoading())`.
    * Memanggil *repository*: `await _repository.updateUserPengurusRoles(event.userId, event.newRoleIds)`.
    * Jika berhasil, `emit(RoleManagementSuccess("Role berhasil diupdate!"))`.
    * Jika gagal (misal: *role* eksklusif), tangkap `PostgrestException` dan `emit(RoleManagementFailure(e.message))` [cite: Overview.txt (483)].

3.  **Repository (`role_repository_impl.dart`):**
    * *Method* `updateUserPengurusRoles` memanggil `_datasource.updateUserPengurusRoles(...)`.

4.  **Datasource (`role_remote_datasource.dart`):**
    * `_datasource.updateUserPengurusRoles` memanggil RPC: `supabaseClient.rpc('update_user_pengurus_roles', ...)` [cite: RPC.txt (348)].