---
id: security-rls
title: Keamanan (RLS)
sidebar_label: 5. Keamanan (RLS)
---

# 🔒 Keamanan (Row Level Security)

Keamanan HiAgenda sangat bergantung pada *role* internal di tabel `workspace_access` ('owner', 'editor', 'viewer').

## 1. Aturan Tabel `events` (Acara)

* **BACA (SELECT):**
    * Aturan: `Allow members to see events in their workspaces`.
    * Logika: Diizinkan jika `workspace_id` ada di dalam `(SELECT get_my_workspace_ids())`.
    * Artinya: Anda bisa **melihat** semua *event* di *workspace* mana pun Anda menjadi anggota.

* **TULIS (INSERT, UPDATE, DELETE):**
    * Aturan: `Allow owners and editors to create/delete/update events`.
    * Logika: Diizinkan jika *role* Anda di `workspace_access` adalah `'owner'` ATAU `'editor'`.
    * Artinya: 'Viewer' **tidak bisa** membuat, mengubah, atau menghapus *event*.

* **PENGECUALIAN (Workspace "Agenda Himtika"):**
    * Aturan: `Allow managers to CUD events in Agenda Himtika`.
    * Logika: Aturan TULIS di atas **tidak berlaku** jika `workspace_id` adalah "Agenda Himtika". Untuk *workspace* ini, RLS akan mengecek menggunakan RPC `is_agenda_manager()`.
    * Artinya: Hanya Pengurus Inti (Kahim, RnD, dll) yang bisa TULIS di "Agenda Himtika", meskipun Anda seorang 'Editor' di sana.

## 2. Aturan Tabel `user_workspace` (Ruang Kerja)

* **BACA (SELECT):**
    * Aturan: `Allow members and invitees to see workspaces`.
    * Logika: Diizinkan jika Anda adalah anggota (ada di `workspace_access`) ATAU Anda punya undangan `status = 'pending'` (ada di `workspace_invitations`).
    * Artinya: Anda bisa melihat *workspace* "HIMTIKA Peduli" di daftar undangan Anda, meskipun Anda belum menerimanya.

* **UBAH (UPDATE) / HAPUS (DELETE):**
    * Aturan: `Allow owners to update/delete their workspaces`.
    * Logika: Diizinkan jika `owner_id` SAMA DENGAN ID Anda.
    * Artinya: Hanya 'Owner' yang bisa mengubah nama atau menghapus *workspace*. 'Editor' dan 'Viewer' tidak bisa.

* **PENGECUALIAN (Delete "Agenda Himtika"):**
    * Aturan: `Prevent deletion of global Agenda Himtika`.
    * Logika: Diizinkan jika `title <> 'Agenda Himtika'::text`.
    * Artinya: **Tidak ada seorang pun**, termasuk *Super Admin*, yang bisa menghapus *workspace* "Agenda Himtika".

## 3. Aturan Tabel `workspace_access` (Anggota)

* **BACA (SELECT):**
    * Aturan: `Allow members to see other members of the same workspace`.
    * Logika: Diizinkan jika Anda adalah anggota *workspace* tersebut.
    * Artinya: Anda bisa melihat daftar kolaborator di "Info Workspace".

* **TULIS (INSERT, UPDATE, DELETE):**
    * Aturan: `Allow owners to add new members` / `remove members` / `update member roles`.
    * Logika: Diizinkan jika ID Anda adalah `owner_id` dari *workspace* tersebut.
    * Artinya: Hanya 'Owner' yang bisa menambah/menghapus anggota atau mengubah *role* mereka (misal: dari 'Viewer' ke 'Editor').