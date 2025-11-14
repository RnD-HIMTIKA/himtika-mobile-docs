---
id: overview
title: Gambaran Umum (HiAgenda)
sidebar_label: 1. Overview
---

# 🗓️ Gambaran Umum (HiAgenda)

HiAgenda adalah fitur **Kalender Kolaboratif**. Fitur ini memungkinkan pengguna (terutama pengurus Himpunan) untuk membuat dan berbagi jadwal dalam ruang kerja (*workspaces*) yang terpisah.

## 🚀 Fungsionalitas Utama

1.  **Manajemen Workspace:**
    * Pengguna bisa membuat *workspace* baru (dan otomatis menjadi 'Owner').
    * Setiap *workspace* memiliki anggota dan *role*-nya sendiri.

2.  **Sistem Role (Owner, Editor, Viewer):**
    * **Owner:** Bisa segalanya. Mengubah nama *workspace*, menghapus *workspace*, mengundang anggota, dan mengubah *role* anggota lain.
    * **Editor:** Bisa menambah, mengedit, dan menghapus *event* di dalam *workspace*.
    * **Viewer:** Hanya bisa melihat *event*.

3.  **Sistem Undangan (Invitation):**
    * **Undangan Personal:** Mengundang *user* spesifik via email/nama.
    * **Undangan via Link:** Membuat *link* publik yang bisa di-klik siapa saja (bisa diatur kedaluwarsa).
    * **Undangan via Role:** Mengundang semua *user* yang memiliki *role* tertentu (Contoh: Semua "FASILKOM" **DAN** "Angkatan_23").

4.  **Manajemen Event:**
    * Membuat *event* satu kali (biasa).
    * Membuat *event* berulang (misal: "Rapat Mingguan setiap Senin & Rabu").
    * Mengatur pengingat notifikasi (misal: "10 menit sebelum acara").

5.  **Notifikasi Otomatis (Serverless):**
    * Pengguna mendapat notifikasi *push* saat diundang ke *workspace* baru.
    * Pengguna mendapat notifikasi *push* saat *event* yang mereka ikuti akan dimulai.

## ✨ Fitur Khusus & Perbaikan (Rilis Final)

* **Workspace Global "Agenda Himtika":**
    * Semua *user* yang baru mendaftar otomatis ditambahkan ke *workspace* ini sebagai 'Viewer'.
    * Hanya "Pengurus Inti" (dicek via RPC `is_agenda_manager`) yang bisa menambah/mengedit *event* di sini.
    * Daftar kolaborator sengaja disembunyikan di UI khusus untuk *workspace* ini.

* **Edit Role Anggota (BARU):**
    * Owner *workspace* kini bisa mengubah *role* anggota lain (misal: dari 'Viewer' ke 'Editor') langsung dari dialog "Info Workspace". Fitur ini didukung oleh RPC `update_workspace_member_role` (No. 61).

* **Perbaikan Avatar Google (BARU):**
    * Avatar pengguna yang login via Google (OAuth) sebelumnya tidak muncul. Ini telah **diperbaiki** dengan mengubah RPC `get_my_workspaces_with_members` (No. 16) menjadi `SECURITY DEFINER` dan menggabungkan data avatar dari `auth.users`.