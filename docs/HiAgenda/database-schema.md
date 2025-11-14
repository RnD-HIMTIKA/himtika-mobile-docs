---
id: database-schema
title: Skema Database
sidebar_label: 2. Skema Database
---

# 🗃️ Skema Database (HiAgenda)

Fitur HiAgenda ditenagai oleh 5 tabel utama yang saling berhubungan.

### 1. `public.user_workspace`

* **Tujuan:** Tabel "Induk" yang menyimpan daftar *workspace*.
* **Kolom Penting:**
    * `id`: ID unik *workspace*.
    * `owner_id`: `user_id` dari si pembuat/pemilik. Sangat penting untuk RLS.
    * `title`: Nama *workspace* (misal: "Agenda Himtika").

### 2. `public.workspace_access`

* **Tujuan:** Tabel "Pivot" yang mencatat siapa saja anggota *workspace*.
* **Kolom Penting:**
    * `workspace_id`: (FK ke `user_workspace.id`).
    * `user_id`: (FK ke `users.id`).
    * `role`: *Role* internal *workspace* (`'owner'`, `'editor'`, atau `'viewer'`).

### 3. `public.workspace_invitations`

* **Tujuan:** Menyimpan "surat undangan" yang sedang menunggu respons.
* **Kolom Penting:**
    * `workspace_id`: *Workspace* yang mengundang.
    * `inviter_id`: Siapa yang mengundang.
    * `invitee_id`: Siapa yang diundang (jika undangan personal).
    * `invitation_type`: `'personal'`, `'link'`, atau `'role'`.
    * `target_role_ids`: (Array) Untuk `invitation_type = 'role'`.
    * `token`: Token unik untuk undangan via *link*.
    * `status`: `'pending'`, `'accepted'`, `'declined'`.

### 4. `public.events`

* **Tujuan:** Menyimpan semua jadwal dan acara.
* **Kolom Penting:**
    * `workspace_id`: *Event* ini milik *workspace* mana.
    * `start_time` / `end_time`: Waktu acara.
    * `recurrence_id`: (FK ke `event_recurrence.id`) Jika acara ini berulang.
    * `reminder_minutes_before`: (Array) Kapan notifikasi harus dikirim (misal: `[10, 30]` -> 10 menit dan 30 menit sebelumnya).

### 5. `public.event_recurrence`

* **Tujuan:** Menyimpan aturan "berulang".
* **Kolom Penting:**
    * `frequency`: Misal: 'WEEKLY'.
    * `by_day`: (Array) Hari apa saja (misal: `['MO', 'WE']` -> Senin, Rabu).
    * `until_date`: Sampai kapan perulangan ini berlaku.

### Diagram Relasi Database

```mermaid
erDiagram
    users ||--o{ user_workspace : "adalah Owner"
    users ||--|{ workspace_access : "adalah Member"
    users ||--o{ workspace_invitations : "adalah Inviter"
    users ||--o{ events : "adalah Creator"

    user_workspace ||--|{ workspace_access : "memiliki"
    user_workspace ||--|{ workspace_invitations : "memiliki"
    user_workspace ||--|{ events : "memiliki"

    events ||--o{ event_recurrence : "memiliki (opsional)"

---