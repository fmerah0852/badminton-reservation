# DIRO Badminton Reservation

Simple **Badminton Court Reservation App** built for DIRO technical test (Full Stack Developer).  
User bisa:

1. Memilih **tanggal**
2. Melihat dan memilih **timeslot yang masih available** untuk tanggal tersebut
3. Memilih **lapangan yang masih kosong** pada tanggal & jam tersebut
4. Melakukan **konfirmasi booking** (plus simulasi payment)

Bonus: tersedia **Admin Dashboard** sederhana untuk mengelola data lapangan dan melihat daftar booking.

---

## 🔧 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Go (net/http), PostgreSQL driver (`lib/pq`)
- **Database**: PostgreSQL
- **Infra / DevOps**:
  - Docker (multi-stage build untuk backend & frontend)
  - Kubernetes (Minikube) – Deploy backend, frontend, dan Postgres di cluster lokal

---

## ✨ Core Features

### User Flow (sesuai soal)

- **Date → Timeslot → Court → Summary**
- List tanggal yang bisa dibooking
- Timeslot hanya tampil jika:
  - Slot tersebut **belum penuh**
  - Untuk tanggal hari ini, jam yang sudah lewat diberi status **PAST**
- Court list:
  - Hanya menampilkan **lapangan yang kosong di jam tersebut**
  - Ada informasi: nama lapangan, surface, AC, dan harga per jam
- Ringkasan Booking:
  - Tanggal, jam, lapangan, nama user, dan status pembayaran
  - Simulasi payment: tombol **“Book & Pay Now”** akan mengubah status menjadi `PAID`

### Availability Engine (Backend)

Endpoint utama:

- `GET /api/dates` – Mengembalikan list tanggal yang bisa dibooking
- `GET /api/availability?date=YYYY-MM-DD` – Mengembalikan slot jam dan status:
  - `AVAILABLE`, `FULL`, `PAST`, `MAINTENANCE`
- `GET /api/courts?date=YYYY-MM-DD&time=HH:MM` – List lapangan yang **masih available** untuk tanggal & jam tersebut
- `POST /api/bookings` – Membuat booking baru (dengan handling race condition di level DB)

### Admin Dashboard

Route: `/admin`

- **Courts Management**
  - List lapangan
  - Tambah lapangan baru (nama, harga, surface, AC, image URL)
  - Edit & delete
- **Bookings Overview**
  - List semua booking (court, user, tanggal, jam, status)

---

## 🗂 Project Structure

```bash
badminton-reservation/
├─ backend/
│  ├─ cmd/
│  │  └─ api/
│  │     └─ main.go          # entrypoint HTTP server
│  └─ internal/
│     ├─ db/                 # koneksi & setup schema PostgreSQL
│     ├─ models/             # struct domain (Court, Booking, dsb)
│     ├─ availability/       # logic perhitungan slot availability
│     ├─ courts/             # service & CRUD courts
│     ├─ bookings/           # service booking + payment simulation
│     └─ httpserver/         # routing & HTTP handlers
│
├─ frontend/
│  ├─ src/
│  │  ├─ app/
│  │  │  ├─ page.tsx         # wizard Date → Time → Court → Summary
│  │  │  └─ admin/
│  │  │     └─ page.tsx      # admin dashboard
│  │  ├─ components/         # Stepper, TimeSlotGrid, CourtCard, SummaryCard, dsb
│  │  └─ lib/
│  │     └─ api.ts           # wrapper fetch ke backend API
│  └─ public/
│     └─ courts/             # gambar dummy lapangan
│
└─ deploy/
   ├─ docker/
   │  ├─ backend.Dockerfile
   │  └─ frontend.Dockerfile
   └─ k8s/
      ├─ namespace.yaml
      ├─ postgres.yaml
      ├─ backend.yaml
      └─ frontend.yaml
