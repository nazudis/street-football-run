# Street Football Run — PRD Breakdown

Dokumen ini memecah [BASE_PRD.md](BASE_PRD.md) menjadi breakdown per-fase yang **eksekusi-ready**.

Setiap file fase dipisah menjadi 2 jalur kerja:

- 🤖 **Claude Code** — prompt/plan untuk coding (copy-paste ke Claude Code).
- 🎨 **Third-Party** — prompt untuk generate asset (Meshy, Mixamo, audio generator) yang dikerjakan manual di luar Claude Code.

> Prinsip utama: **kode dulu pakai placeholder, asset belakangan.** Jangan blok progres gameplay hanya karena nunggu asset jadi.

---

## Peta Fase

| Fase | Nama | Jalur Kerja | File |
|------|------|-------------|------|
| 0 | Project Setup | 🤖 Claude Code | [phase-00-setup.md](phase-00-setup.md) |
| 1 | Kota Sederhana | 🤖 Claude Code (placeholder) | [phase-01-city.md](phase-01-city.md) |
| 2 | Player Controller | 🤖 Claude Code | [phase-02-player-controller.md](phase-02-player-controller.md) |
| 3 | Dribbling Bola | 🤖 Claude Code | [phase-03-ball-dribble.md](phase-03-ball-dribble.md) |
| 4 | Area Goal | 🤖 Claude Code | [phase-04-goal-zone.md](phase-04-goal-zone.md) |
| 5 | Shooting System | 🤖 Claude Code | [phase-05-shooting.md](phase-05-shooting.md) |
| 6 | Goal Detection | 🤖 Claude Code | [phase-06-goal-detection.md](phase-06-goal-detection.md) |
| 7 | Asset Upgrade | 🎨 Third-Party + 🤖 integrasi | [phase-07-asset-upgrade.md](phase-07-asset-upgrade.md) |
| 8 | Animasi | 🎨 Mixamo + 🤖 integrasi | [phase-08-animation.md](phase-08-animation.md) |
| 9 | UI | 🤖 Claude Code | [phase-09-ui.md](phase-09-ui.md) |
| 10 | Polish (Audio + Camera) | 🎨 Audio + 🤖 Claude Code | [phase-10-polish.md](phase-10-polish.md) |

Panduan teknis asset (format, scale, naming) ada di [asset-pipeline.md](asset-pipeline.md).

---

## Milestone Playable

```text
Fase 0 → 6  = MVP playable (placeholder box) → ini target hari ke-3/4
Fase 7 → 8  = naik visual (model + animasi)
Fase 9 → 10 = UI + polish (audio, kamera)
```

## Urutan Commit

```text
feat: setup r3f              # fase 0
feat: city environment       # fase 1
feat: player controller      # fase 2
feat: dribble system         # fase 3
feat: goal zone              # fase 4
feat: shooting               # fase 5
feat: goal detection         # fase 6
feat: model assets           # fase 7
feat: animations             # fase 8
feat: ui                     # fase 9
feat: audio & camera polish  # fase 10
```

## Cara Pakai Tiap File

Tiap file fase punya bagian:
1. **Goal** — definisi selesai.
2. **🤖 Claude Code** — plan singkat + prompt siap-paste.
3. **🎨 Third-Party** (jika ada) — tool, prompt generate, setting export, lokasi simpan.
4. **Checklist** — verifikasi sebelum commit.
5. **Catatan integrasi** — gotcha yang sering muncul.
