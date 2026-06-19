# Fase 8 — Animasi

**Jalur:** 🎨 Mixamo (generate animasi) → 🤖 Claude Code (integrasi state machine)

## Goal
Karakter beranimasi sesuai keadaan: Idle, Walk, Run, Kick — dengan transisi halus.

---

## 🎨 Third-Party — Mixamo

Kerjakan **manual di [mixamo.com](https://www.mixamo.com)**:

1. Upload `public/models/player.glb` (T-pose dari Fase 7) → Mixamo auto-rig.
2. Cari & download animasi berikut:
   - **Idle**
   - **Walking** (centang **In Place**)
   - **Running** (centang **In Place**)
   - **Soccer Pass** atau **Kicking** → untuk Kick
3. Settings download: **FBX**, **30 fps**. Animasi pertama **With Skin**, sisanya boleh **Without Skin**.
4. Konversi FBX → GLB (pakai [glTF-Transform], Blender, atau converter online). Idealnya **gabung jadi satu `player_animated.glb`** dengan semua clip, atau simpan animasi terpisah.

**Output:** `public/models/player_animated.glb` (mesh + clips: `Idle`, `Walk`, `Run`, `Kick`).

> Tips: beri nama clip yang konsisten saat ekspor supaya gampang dipanggil di kode.

---

## 🤖 Claude Code — Integrasi Animasi

### Plan
1. Load model beranimasi pakai `useAnimations` (drei) untuk dapat `actions`.
2. Buat state machine animasi sederhana berdasar kondisi gerak:
   - kecepatan ~0 → Idle
   - bergerak pelan → Walk
   - sprint → Run
   - event tendang → Kick (one-shot, lalu balik)
3. Cross-fade antar animasi supaya halus.

### Prompt
```text
Integrasikan animasi Mixamo ke Player. Model: public/models/player_animated.glb
dengan clip: Idle, Walk, Run, Kick.

Lakukan:
- Load dengan useGLTF + useAnimations (drei) untuk mendapatkan actions & names.
- Buat animation state machine di Player berdasarkan kondisi (dari Fase 2/5):
  - speed ≈ 0  -> "Idle"
  - bergerak (walk speed) -> "Walk"
  - sprint (Shift) -> "Run"
  - saat menembak (Fase 5) -> mainkan "Kick" sekali (clampWhenFinished / LoopOnce),
    lalu kembali ke state gerak.
- Gunakan crossFadeTo / fadeIn-fadeOut (mis. 0.2s) untuk transisi halus.
- Pastikan animasi In-Place: gerakan posisi tetap dikontrol fisika (Fase 2), bukan root motion.

React Three Fiber + @react-three/drei (useAnimations) + TypeScript.
```

### Files
- update `src/components/Player/Player.tsx`
- `src/components/Player/usePlayerAnimation.ts` (state machine, opsional)

---

## Checklist
- [ ] Diam → Idle
- [ ] Jalan → Walk, Lari → Run
- [ ] Menendang → animasi Kick muncul lalu kembali normal
- [ ] Transisi antar animasi halus (tidak nyentak)

## Catatan integrasi
- Kalau karakter "ngesot" (sliding), kemungkinan kecepatan animasi tidak match kecepatan gerak — sinkronkan speed atau pakai animasi In-Place murni.
- Kick sebaiknya dipicu dari event shoot (Fase 5), idealnya impulse bola dilepas di tengah animasi (timing) supaya terasa nendang beneran.
- Commit: `feat: animations`
