---
id: architecture-flow
title: Alur Arsitektur (Flutter)
sidebar_label: 6. Alur Arsitektur (Flutter)
---

# 🏗️ Alur Arsitektur (Flutter BLoC)

Di sisi Flutter, fitur HiAgenda dikelola oleh beberapa BLoC, terutama `WorkspaceBloc` (untuk data utama) dan `CalendarBloc` (untuk *event*).

## Alur 1: Memuat Halaman Kalender

1.  **UI (`calendar_screen.dart`):**
    * Halaman dibuka.
    * UI memanggil: `context.read<WorkspaceBloc>().add(LoadWorkspacesEvent())`.
    * UI memanggil: `context.read<CalendarBloc>().add(LoadEventsInRangeEvent(tanggal_terpilih))`.

2.  **BLoC (`workspace_bloc.dart`):**
    * Menerima `LoadWorkspacesEvent`.
    * `emit(WorkspaceLoading())`.
    * Memanggil *repository*: `final workspaces = await _workspaceRepository.getMyWorkspacesWithMembers();`
    * `emit(WorkspaceLoaded(workspaces))`
    * Data ini dipakai untuk mengisi *dropdown* pilihan *workspace* dan dialog "Info Workspace".

3.  **Repository (`workspace_repository_impl.dart`):**
    * Memanggil *datasource*.

4.  **Datasource (`workspace_remote_datasource.dart`):**
    * Memanggil RPC inti: `await supabaseClient.rpc('get_my_workspaces_with_members');`.
    * RPC ini (seperti dijelaskan di *file* Logika Backend) sudah `SECURITY DEFINER` dan otomatis mem-fix masalah avatar Google.

## Alur 2: Owner Mengubah Role Anggota (Fitur Baru)

1.  **UI (`workspace_info_dialog.dart`):**
    * Owner membuka dialog.
    * Owner memilih "Jadikan Editor" pada User B.
    * UI memanggil: `context.read<WorkspaceBloc>().add(UpdateMemberRoleEvent(workspaceId, userB_id, 'editor'))`.

2.  **BLoC (`workspace_bloc.dart`):**
    * Menerima `UpdateMemberRoleEvent`.
    * Memanggil *repository*: `await _workspaceRepository.updateMemberRole(event.workspaceId, event.userId, event.newRole);`
    * Jika berhasil, BLoC akan memanggil `add(LoadWorkspacesEvent())` lagi untuk me-*refresh* data.

3.  **Datasource:**
    * Memanggil RPC: `await supabaseClient.rpc('update_workspace_member_role', ...);`.

## Alur 3: Menerima Undangan (Deep Link)

1.  **OS (Android/iOS):**
    * Pengguna (di luar aplikasi) mengklik *link* `https://himtika.cs.unsika.ac.id/join-workspace/TOKEN_UUID`.
    * Sistem Operasi mendeteksi *link* ini.

2.  **Manifest (`AndroidManifest.xml`):**
    * *File* `AndroidManifest.xml` memiliki `intent-filter` yang dikonfigurasi untuk menangkap *host* (`himtika.cs.unsika.ac.id`) dan *path* (`/join-workspace`).
    * Aplikasi HIMFO dibuka dan *link* tersebut diteruskan ke Flutter.

3.  **Flutter (BLoC/Router):**
    * Logika *routing* di Flutter mendeteksi *link* masuk.
    * Ia mengambil `TOKEN_UUID` dari *link*.
    * Memanggil (misalnya) `context.read<InvitationBloc>().add(AcceptLinkInvitationEvent(token))`.

4.  **Datasource:**
    * Memanggil RPC: `await supabaseClient.rpc('accept_link_invitation', params: {'p_invitation_token': token});`.
    * Jika berhasil, BLoC akan me-*refresh* daftar *workspace*.