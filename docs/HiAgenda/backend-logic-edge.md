---
id: backend-logic-edge
title: Logika Notifikasi (Edge Function)
sidebar_label: 4. Logika Notifikasi (Edge)
---

# ⚡ Logika Notifikasi (Edge Function)

HiAgenda menggunakan **Edge Functions** (kode *serverless* TypeScript/Deno) dan **Database Webhooks/Cron Jobs** untuk mengirim notifikasi *push* secara otomatis.

Alurnya ada dua: Pengingat Event dan Notifikasi Undangan.

## 1. Alur Notifikasi: Pengingat Event

* **Tujuan:** Mengirim notifikasi "Event akan dimulai" 10 menit sebelumnya.
* **Pemicu:** **Cron Job** (Tugas Terjadwal).

```sql
-- Nama Cron: check-event-reminders
-- Jadwal: */5 * * * * (Setiap 5 menit)
-- Perintah: Memanggil Edge Function 'event-reminder'
SELECT
net.http_post(
url:='.../functions/v1/event-reminder',
headers:=...
);

Edge Function: event-reminder
DIPANGGIL oleh Cron Job setiap 5 menit.

Memanggil RPC get_pending_notifications (No. 17):

RPC ini (tidak dibahas di file RPC) bertugas mencari event yang (start_time - reminder_minutes_before) kurang dari waktu sekarang DAN belum ada di tabel sent_notifications.

Mendapatkan Token FCM: Fungsi ini mengambil Service Account Firebase dari Supabase Secrets untuk otentikasi ke Google.

Mengirim Notifikasi: Looping setiap event yang pending dan setiap token FCM anggota workspace, lalu mengirim pesan via fcm.googleapis.com.

Mencatat Pengiriman: Jika berhasil terkirim, fungsi ini INSERT data ke tabel public.sent_notifications. Ini KRUSIAL agar notifikasi tidak terkirim berulang kali setiap 5 menit.

2. Alur Notifikasi: Undangan Workspace
Tujuan: Mengirim notifikasi "Anda diundang oleh X" saat diundang.

Pemicu: Database Webhook (Pemicu Database).

# Nama Webhook: on-new-invitation [cite: 75]
# Tabel: workspace_invitations
# Event: INSERT
# Tipe: HTTP Request
# URL: .../functions/v1/invitation-notifier

Edge Function: invitation-notifier
DIPANGGIL oleh Webhook setiap kali ada INSERT baru di workspace_invitations.

Mendapat payload: Fungsi ini menerima data baris undangan yang baru saja dibuat.

Filter Undangan: Fungsi ini mengecek apakah invitation_type == 'personal'. Jika undangan via link atau role, notifikasi tidak dikirim.

Mengambil Data: Mengambil data pengundang (inviterData), data yang diundang (inviteeData - termasuk fcm_token), dan data workspace (workspaceData).

Mendapatkan Token FCM: Sama seperti event-reminder.

Mengirim Notifikasi: Mengirim pesan FCM ke fcm_token milik inviteeData.