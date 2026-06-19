Scope ini **sangat bagus untuk proyek solo**.

Kenapa?

Karena inti gameplay-nya hanya 3 mekanik:

1. Bergerak
2. Menggiring bola
3. Menendang ke gawang

Tidak ada AI musuh, tidak ada inventory, tidak ada multiplayer, tidak ada ekonomi virtual yang entah kenapa selalu muncul dalam proyek game. Jadi kemungkinan selesai jauh lebih tinggi.

---

# Vision Game

## Judul Sementara

**Street Football Run**

## Gameplay Loop

```text
Spawn
↓
Giring bola
↓
Lewati jalan perkotaan
↓
Sampai area goal
↓
Tendang bola
↓
Gol
↓
Menang
```

Target MVP:

Durasi bermain:

```text
30 - 60 detik
```

---

# Teknologi

```text
React
TypeScript
Vite

React Three Fiber
Three.js

Rapier Physics

GLTF / GLB Assets
```

---

# FASE 0

# Project Setup

## Goal

Browser menampilkan dunia 3D.

---

### Prompt

```text
Buat project React Three Fiber terbaru menggunakan Vite dan TypeScript.

Tambahkan:

- Canvas
- Directional Light
- Ambient Light
- Ground plane
- OrbitControls

Struktur folder harus scalable.

Gunakan TypeScript.
```

---

## Checklist

* [ ] npm run dev berhasil
* [ ] Ada lantai
* [ ] Bisa melihat dunia 3D

---

# FASE 1

# Kota Sederhana

## Goal

Buat lingkungan perkotaan sederhana.

---

### Asset

Meshy:

Prompt:

```text
Low poly urban buildings.
Stylized city buildings.
Game ready.
GLB format.
```

---

### Prompt Coding

```text
Buat sistem city generator sederhana.

Bangunan ditempatkan otomatis di kiri dan kanan jalan.

Gunakan React Three Fiber.

Bangunan berupa box geometry sementara.
```

---

## Checklist

* [ ] Jalan utama
* [ ] Gedung kiri kanan
* [ ] Dunia terasa seperti kota

---

# FASE 2

# Player Controller

## Goal

Karakter bergerak.

---

### Prompt

```text
Buat third person character controller.

Teknologi:

- React Three Fiber
- Rapier
- TypeScript

Fitur:

- WASD
- Sprint dengan Shift
- Smooth camera follow
- Physics based movement
```

---

## Checklist

* [ ] Jalan
* [ ] Lari
* [ ] Kamera mengikuti

---

# FASE 3

# Bola

Ini fase paling penting.

---

## Versi MVP

Bola selalu berada di depan pemain.

Belum physics penuh.

---

### Prompt

```text
Buat sistem dribbling sederhana.

Bola berada sekitar 1 meter di depan pemain.

Saat pemain bergerak bola ikut bergerak.

Gunakan interpolation agar gerakan halus.

React Three Fiber + TypeScript.
```

---

## Checklist

* [ ] Bola mengikuti
* [ ] Terlihat seperti digiring

---

# FASE 4

# Area Goal

## Goal

Ada tujuan permainan.

---

### Prompt

```text
Buat goal zone.

Ketika pemain masuk ke area tertentu:

- tampilkan pesan:
  "Press Space to Shoot"

Gunakan collision sensor Rapier.
```

---

## Checklist

* [ ] Goal zone aktif
* [ ] Prompt muncul

---

# FASE 5

# Shooting System

## Goal

Pemain bisa menendang.

---

### Prompt

```text
Buat sistem shooting.

Saat tombol Space ditekan:

- bola bergerak menuju gawang
- menggunakan physics impulse
- kamera tetap mengikuti

Gunakan Rapier.
```

---

## Checklist

* [ ] Bola meluncur
* [ ] Tidak menembus objek

---

# FASE 6

# Goal Detection

## Goal

Menang.

---

### Prompt

```text
Buat goal detector.

Ketika bola masuk ke area gawang:

- tampilkan tulisan GOAL
- hentikan gameplay
- tampilkan tombol restart
```

---

## Checklist

* [ ] Goal terdeteksi
* [ ] Win screen muncul

---

# FASE 7

# Asset Upgrade

Sekarang baru gantikan placeholder.

---

## Karakter

Meshy Prompt:

```text
Low poly street football player.

Stylized.
Game ready.
T-pose.
GLB.
```

---

## Bola

Meshy Prompt:

```text
Stylized football.
Low poly.
Game ready.
GLB.
```

---

## Gawang

Meshy Prompt:

```text
Street football goal.
Low poly.
Game ready.
GLB.
```

---

## Gedung

Meshy Prompt:

```text
Stylized city buildings.
Low poly.
Colorful.
Game ready.
GLB.
```

---

# FASE 8

# Animasi

Mixamo

Download:

* Idle
* Walking
* Running
* Kick

---

### Prompt

```text
Integrasikan animasi Mixamo.

State:

Idle
Walk
Run
Kick

Gunakan AnimationMixer.

React Three Fiber.
```

---

# FASE 9

# UI

## Prompt

```text
Buat UI game menggunakan React.

Tampilkan:

- Goal status
- Distance to goal
- Restart button

Responsive.
```

---

# FASE 10

# Polish

Tambahkan:

### Sound

Prompt:

```text
Tambahkan audio:

- langkah kaki
- tendangan bola
- suara gol

Gunakan Web Audio API.
```

---

### Kamera Lebih Cinematic

Prompt:

```text
Perbaiki third person camera.

Tambahkan:

- smoothing
- slight lag
- camera collision

React Three Fiber.
```

---

# Struktur Folder Final

```text
src
│
├── components
│   ├── Player
│   ├── Ball
│   ├── Goal
│   ├── City
│
├── systems
│   ├── CameraSystem
│   ├── DribbleSystem
│   ├── ShootSystem
│
├── physics
│
├── hooks
│
├── assets
│   ├── models
│   ├── audio
│
├── ui
│
├── scenes
│   └── MainScene
│
└── App.tsx
```

---

# Roadmap Vibe Coding Terbaik

Jangan pernah meminta AI:

```text
Buat game sepak bola 3D lengkap.
```

Itu hampir pasti menghasilkan tumpukan kode yang tampak optimis dan kemudian meledak saat `npm run dev`.

Sebaliknya, jalankan siklus ini:

```text
1 fitur
↓
Prompt AI
↓
Jalankan
↓
Fix error
↓
Commit Git
↓
Lanjut fitur berikutnya
```

Urutan commit yang saya sarankan:

```text
feat: setup r3f
feat: city environment
feat: player controller
feat: dribble system
feat: goal zone
feat: shooting
feat: goal detection
feat: animations
feat: ui
feat: audio
```

Kalau mengikuti urutan ini, biasanya pada **hari ke-3 atau ke-4** kamu sudah memiliki versi yang benar-benar bisa dimainkan: karakter berlari di kota, menggiring bola, lalu menendangnya ke gawang. Setelah itu tinggal masuk fase berbahaya yang dikenal para developer sebagai "cuma nambah satu fitur lagi", yang secara statistik dapat berlangsung antara 2 minggu sampai 3 tahun.
