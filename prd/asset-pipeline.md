# Asset Pipeline — Panduan Teknis

Panduan agar asset dari third-party (Meshy, Mixamo, audio) langsung pas dipakai di R3F tanpa banyak revisi.

---

## Lokasi Simpan

```text
src/assets/
├── models/        # .glb hasil Meshy
│   ├── player.glb
│   ├── ball.glb
│   ├── goal.glb
│   └── buildings/
│       ├── building_a.glb
│       └── building_b.glb
└── audio/         # .mp3/.ogg
    ├── footstep.mp3
    ├── kick.mp3
    └── goal.mp3
```

> Vite men-serve file dari `src/assets` lewat import, atau taruh di `public/models` kalau mau di-load via path string. Untuk R3F + `useGLTF`, paling mudah taruh di `public/` lalu load via `/models/player.glb`. **Pilih satu konvensi dan konsisten** — dokumen fase menggunakan `public/models/...`.

---

## Spesifikasi Export (Meshy / 3D)

| Item | Nilai target |
|------|--------------|
| Format | `.glb` (binary, single file) |
| Orientasi | Y-up, menghadap +Z |
| Scale | 1 unit = 1 meter (player ~1.7–1.8 tinggi) |
| Origin | Di kaki untuk karakter; di pusat untuk bola |
| Polycount | Low poly: bangunan < 2k tris, karakter < 15k tris |
| Texture | Baked, max 1024–2048px |

Selalu cek scale & origin setelah import (lihat catatan tiap fase). Kalau salah, fix di Blender atau koreksi via `scale`/`position` di komponen R3F.

---

## Karakter untuk Mixamo (Fase 8)

- Export karakter dari Meshy dalam **T-pose**.
- Upload `.glb`/`.fbx` ke [mixamo.com](https://www.mixamo.com).
- Download animasi sebagai **FBX for Unity** lalu konversi, **atau** lebih mudah: pakai [https://github.com/donmccurdy/glTF-Transform] / online converter FBX→GLB.
- Settings download Mixamo: **30 fps**, **Without Skin** untuk animasi tambahan (skin cukup sekali di animasi pertama), centang **In Place** untuk Walk/Run (biar gerakan dikontrol fisika, bukan root motion).

Animasi yang diperlukan: `Idle`, `Walking`, `Running`, `Soccer Pass` / `Kick`.

---

## Audio (Fase 10)

| File | Sumber | Catatan |
|------|--------|---------|
| footstep.mp3 | freesound.org / sfxr / ElevenLabs SFX | loop pendek, 1 langkah |
| kick.mp3 | freesound.org | "punch" / "ball kick" |
| goal.mp3 | freesound.org | whistle + cheer pendek |

Format: `.mp3` atau `.ogg`, mono, < 200KB tiap file untuk SFX.

---

## Tools Third-Party yang Dipakai

| Tool | Fungsi | Fase |
|------|--------|------|
| [Meshy](https://www.meshy.ai) | Text-to-3D (bangunan, karakter, bola, gawang) | 1, 7 |
| [Mixamo](https://www.mixamo.com) | Auto-rig + animasi karakter | 8 |
| [Freesound](https://freesound.org) / ElevenLabs SFX | Sound effect | 10 |
| Blender (opsional) | Fix scale/origin, optimize, konversi format | 7, 8 |
