# Fase 0 — Project Setup

**Jalur:** 🤖 Claude Code saja (tidak ada asset)

## Goal
Browser menampilkan dunia 3D kosong: ada lantai, pencahayaan, dan kamera yang bisa di-orbit.

---

## 🤖 Claude Code

### Plan
1. Scaffold project Vite + React + TypeScript.
2. Install `three`, `@react-three/fiber`, `@react-three/drei`.
3. Buat struktur folder scalable (lihat `src/` di bawah).
4. Buat `MainScene` dengan Canvas, lighting, ground, OrbitControls.
5. Pastikan `npm run dev` jalan tanpa error.

### Prompt
```text
Buat project React Three Fiber baru dengan Vite + TypeScript.

Setup:
- Vite + React + TypeScript (template react-ts)
- Install: three, @react-three/fiber, @react-three/drei
- Strict mode TypeScript

Buat scene awal di src/scenes/MainScene.tsx berisi:
- <Canvas> dengan shadows enabled, camera default position [10, 10, 10]
- Ambient light (intensity ~0.5)
- Directional light dengan castShadow (posisi [10,10,5])
- Ground plane 100x100 (receiveShadow), warna abu netral
- OrbitControls dari drei

Buat struktur folder ini sebagai placeholder kosong (dengan index/barrel jika perlu):
src/
├── components/   (Player, Ball, Goal, City)
├── systems/      (CameraSystem, DribbleSystem, ShootSystem)
├── physics/
├── hooks/
├── assets/models, assets/audio
├── ui/
├── scenes/MainScene.tsx
└── App.tsx

App.tsx hanya me-render <MainScene/>.
Jangan tambahkan fitur lain dulu. Pastikan `npm run dev` jalan.
```

### Files yang dibuat/diubah
- `package.json`, `vite.config.ts`, `tsconfig.json`
- `src/App.tsx`
- `src/scenes/MainScene.tsx`
- folder kosong sesuai struktur

---

## Checklist
- [ ] `npm run dev` berhasil tanpa error
- [ ] Ada lantai (ground plane) terlihat
- [ ] Bisa orbit/zoom kamera dengan mouse
- [ ] Struktur folder sudah dibuat

## Catatan integrasi
- Pastikan `shadows` di Canvas + `castShadow`/`receiveShadow` konsisten, kalau tidak bayangan tidak muncul.
- Commit: `feat: setup r3f`
