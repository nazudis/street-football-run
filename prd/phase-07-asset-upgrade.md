# Fase 7 — Asset Upgrade

**Jalur:** 🎨 Third-Party (generate) → lalu 🤖 Claude Code (integrasi)
Mulai sekarang baru ganti semua placeholder dengan model asli.

## Goal
Player capsule → model karakter; sphere → bola; box → gawang & gedung. Visual naik kelas.

---

## 🎨 Third-Party — Generate Asset (Meshy)

Kerjakan ini **manual di Meshy**, lalu taruh file ke `public/models/`. Lihat [asset-pipeline.md](asset-pipeline.md) untuk spesifikasi export.

### 1. Karakter → `public/models/player.glb`
```text
Low poly street football player.
Stylized.
Game ready.
T-pose.
GLB.
```
> **Wajib T-pose** — file ini juga dipakai untuk Mixamo di Fase 8.

### 2. Bola → `public/models/ball.glb`
```text
Stylized football.
Low poly.
Game ready.
GLB.
```

### 3. Gawang → `public/models/goal.glb`
```text
Street football goal.
Low poly.
Game ready.
GLB.
```

### 4. Gedung → `public/models/buildings/building_a.glb`, `building_b.glb`, ...
```text
Stylized city buildings.
Low poly.
Colorful.
Game ready.
GLB.
```
> Generate 2–4 variasi gedung supaya kota tidak monoton.

**Checklist export tiap model:** `.glb`, Y-up, skala meter, origin benar (kaki untuk player, pusat untuk bola). Kalau scale/origin meleset, fix di Blender.

---

## 🤖 Claude Code — Integrasi Model

### Plan
1. Buat loader util pakai `useGLTF` + preload.
2. Ganti placeholder mesh di Player, Ball, Goal, City dengan model.
3. **Pertahankan collider fisika tetap primitif** (capsule/ball/cuboid) — jangan pakai trimesh model untuk fisika, cukup model sebagai visual di dalam RigidBody.
4. Sesuaikan scale/offset agar model pas dengan collider.

### Prompt
```text
Integrasikan model GLB menggantikan placeholder. File ada di public/models/.

Lakukan:
- Buat helper preload semua model (useGLTF.preload) di satu tempat.
- Player (src/components/Player): render <primitive> dari player.glb sebagai child visual
  di dalam RigidBody. PERTAHANKAN CapsuleCollider untuk fisika. Sesuaikan scale & posisi
  model agar kaki menempel di tanah dan pas dengan collider.
- Ball: render ball.glb sebagai visual, tetap pakai ball collider primitif.
- Goal: render goal.glb sebagai visual; collider gawang pakai cuboid/compound primitif
  + sensor net (Fase 6) tetap berfungsi.
- City: ganti box placeholder dengan model gedung (building_a/b/...), pilih variasi
  secara deterministik. Collider gedung pakai cuboid primitif (jangan trimesh).

Jangan pakai trimesh collider dari model (mahal & rawan bug). Visual = model, fisika = primitif.
Pastikan tidak ada error loading & dev server jalan.
```

### Files
- `src/assets/loadModels.ts` (preload)
- update `Player.tsx`, `Ball.tsx`, `Goal/*`, `City.tsx`

---

## Checklist
- [ ] Karakter, bola, gawang, gedung memakai model GLB
- [ ] Skala & posisi pas (kaki player di tanah, bola tidak melayang)
- [ ] Collider tetap primitif (fisika tidak berubah perilakunya)
- [ ] Tidak ada error load model

## Catatan integrasi
- `useGLTF` butuh Suspense; bungkus scene dengan `<Suspense fallback={null}>`.
- Kalau model menghadap arah salah, koreksi rotasi di wrapper, jangan ubah collider.
- Commit: `feat: model assets`
