# Phase Checklist — Street Football Run

Tracking ringkas semua fase dalam satu halaman. Centang saat selesai & sudah di-commit.
Detail tiap fase ada di file `phase-XX-*.md`.

Legenda jalur: 🤖 Claude Code · 🎨 Third-Party (asset)

---

## Fase 0 — Project Setup 🤖
- [ ] `npm run dev` berhasil tanpa error
- [ ] Ada lantai (ground plane)
- [ ] Bisa orbit/zoom kamera
- [ ] Struktur folder dibuat
- [ ] Commit: `feat: setup r3f`

## Fase 1 — Kota Sederhana 🤖
- [ ] Jalan utama lurus (arah +Z)
- [ ] Gedung berjajar kiri & kanan (box placeholder)
- [ ] Dunia terasa seperti koridor kota
- [ ] Parameter panjang/lebar jalan bisa diubah
- [ ] Commit: `feat: city environment`

## Fase 2 — Player Controller 🤖
- [ ] Rapier `<Physics>` terpasang, ground jadi fixed body
- [ ] Player jalan dengan WASD
- [ ] Shift = lari lebih cepat
- [ ] Kamera follow halus
- [ ] Player tidak terguling / tidak nembus lantai
- [ ] Commit: `feat: player controller`

## Fase 3 — Dribbling Bola 🤖
- [ ] Bola selalu di depan player
- [ ] Bola ikut bergerak & terlihat menggelinding
- [ ] Gerakan halus saat belok (sedikit lag natural)
- [ ] Bola mendukung 2 mode (dribble / shot)
- [ ] Commit: `feat: dribble system`

## Fase 4 — Area Goal 🤖
- [ ] `useGameStore` dibuat
- [ ] Goal zone (sensor) mendeteksi player
- [ ] Prompt "Press Space to Shoot" muncul/hilang
- [ ] Commit: `feat: goal zone`

## Fase 5 — Shooting System 🤖
- [ ] Space → bola meluncur ke gawang (impulse)
- [ ] Bola tidak menembus tanah/objek
- [ ] Tidak bisa nembak dua kali
- [ ] Commit: `feat: shooting`

## Fase 6 — Goal Detection 🤖 ✅ (MVP SELESAI)
- [ ] Bola masuk gawang → "GOAL!"
- [ ] Gameplay berhenti saat menang
- [ ] Restart mengembalikan ke kondisi awal
- [ ] Commit: `feat: goal detection`

---
### 🎯 Checkpoint: setelah Fase 6, game playable end-to-end (placeholder).
---

## Fase 7 — Asset Upgrade 🎨 + 🤖
**Generate (Meshy):**
- [ ] `player.glb` (T-pose!)
- [ ] `ball.glb`
- [ ] `goal.glb`
- [ ] `buildings/building_a.glb`, `_b.glb`, ...

**Integrasi (Claude Code):**
- [ ] Semua placeholder diganti model GLB
- [ ] Skala & posisi pas (kaki di tanah, bola tidak melayang)
- [ ] Collider tetap primitif (bukan trimesh)
- [ ] Tidak ada error load
- [ ] Commit: `feat: model assets`

## Fase 8 — Animasi 🎨 + 🤖
**Generate (Mixamo):**
- [ ] Idle, Walking (In Place), Running (In Place), Kick
- [ ] Export → `player_animated.glb`

**Integrasi (Claude Code):**
- [ ] Diam → Idle
- [ ] Jalan → Walk, Lari → Run
- [ ] Menendang → Kick lalu kembali normal
- [ ] Transisi halus (cross-fade)
- [ ] Commit: `feat: animations`

## Fase 9 — UI 🤖
- [ ] Goal status tampil
- [ ] Distance to goal update live
- [ ] Restart button berfungsi
- [ ] Layout responsive (desktop & mobile)
- [ ] Commit: `feat: ui`

## Fase 10 — Polish 🎨 + 🤖
**Audio (third-party):**
- [ ] `footstep.mp3`, `kick.mp3`, `goal.mp3`

**Integrasi (Claude Code):**
- [ ] SFX langkah saat jalan/lari
- [ ] SFX tendangan saat shoot
- [ ] SFX gol saat menang
- [ ] Kamera halus + sedikit lag natural
- [ ] Kamera tidak menembus gedung
- [ ] Commit: `feat: audio & camera polish`

---

## Progress Ringkas

| Fase | Status |
|------|--------|
| 0 Setup | ⬜ |
| 1 City | ⬜ |
| 2 Player | ⬜ |
| 3 Dribble | ⬜ |
| 4 Goal Zone | ⬜ |
| 5 Shooting | ⬜ |
| 6 Goal Detection | ⬜ |
| 7 Assets | ⬜ |
| 8 Animation | ⬜ |
| 9 UI | ⬜ |
| 10 Polish | ⬜ |

> Update kolom status: ⬜ belum · 🟡 progres · ✅ selesai
