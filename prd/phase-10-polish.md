# Fase 10 — Polish (Audio + Kamera Cinematic)

**Jalur:** 🎨 Third-Party (cari/generate audio) → 🤖 Claude Code (audio system + kamera)

## Goal
Game terasa hidup: ada SFX langkah/tendangan/gol, dan kamera third-person lebih sinematik (smoothing, lag, anti-tembus dinding).

---

## 🎨 Third-Party — Audio

Kerjakan **manual**: ambil/generate SFX dari [Freesound](https://freesound.org), ElevenLabs SFX, atau sejenis. Simpan ke `public/audio/` (lihat [asset-pipeline.md](asset-pipeline.md)).

| File | Deskripsi yang dicari |
|------|----------------------|
| `public/audio/footstep.mp3` | langkah kaki, pendek, bisa di-loop |
| `public/audio/kick.mp3` | suara tendangan bola ("ball kick"/"punch") |
| `public/audio/goal.mp3` | peluit + sorak pendek (saat gol) |

Format: mp3/ogg, mono, ringan (< 200KB per SFX).

---

## 🤖 Claude Code — Bagian A: Audio System

### Prompt
```text
Tambahkan audio system menggunakan Web Audio API (atau howler/use-sound) di src/systems/AudioSystem.ts.

Trigger:
- Footstep: saat player bergerak di tanah; mainkan footstep.mp3 berulang sesuai langkah
  (interval berbasis kecepatan), berhenti saat diam.
- Kick: mainkan kick.mp3 saat shoot (Fase 5), idealnya sinkron dengan animasi Kick (Fase 8).
- Goal: mainkan goal.mp3 sekali saat gameState menjadi 'win' (Fase 6).

Preload audio sekali. Beri kontrol volume sederhana & guard agar tidak overlap berlebihan.
File ada di public/audio/. React Three Fiber + TypeScript.
```

### Files (A)
- `src/systems/AudioSystem.ts`
- `src/hooks/useSound.ts` (opsional)
- hook trigger di Player (footstep), ShootSystem (kick), GoalNet (goal)

---

## 🤖 Claude Code — Bagian B: Kamera Cinematic

### Prompt
```text
Perbaiki third person camera di src/systems/CameraSystem (dari Fase 2).

Tambahkan:
- Smoothing posisi & lookAt yang lebih halus (lerp dengan damping berbasis delta time).
- Slight lag: kamera sedikit tertinggal saat player berakselerasi/berbelok.
- Camera collision: raycast dari player ke kamera; jika ada objek (gedung/gawang) di antara,
  dekatkan kamera supaya tidak menembus tembok.
- Opsional: sedikit zoom-in / fokus ke bola saat momen shooting.

Pakai damping yang frame-rate independent. React Three Fiber + TypeScript.
```

### Files (B)
- update `src/systems/CameraSystem.ts`

---

## Checklist
- [ ] SFX langkah saat jalan/lari
- [ ] SFX tendangan saat shoot
- [ ] SFX gol saat menang
- [ ] Kamera halus, ada sedikit lag natural
- [ ] Kamera tidak menembus gedung/tembok

## Catatan integrasi
- Browser memblokir audio sebelum interaksi user pertama — inisialisasi AudioContext setelah klik/keypress pertama (mis. saat start game).
- Camera collision: gunakan raycaster Three atau Rapier raycast; jaga jarak minimum supaya kamera tidak nempel ke kepala player.
- Commit: `feat: audio & camera polish`
