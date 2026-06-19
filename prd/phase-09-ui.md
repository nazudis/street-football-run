# Fase 9 — UI

**Jalur:** 🤖 Claude Code saja

## Goal
HUD game: status gol, jarak ke gawang, tombol restart. Responsive.

---

## 🤖 Claude Code

### Plan
1. Buat layer UI HTML/React di atas Canvas (bukan di dalam dunia 3D).
2. Tampilkan: status gol, jarak player→gawang (live), tombol restart.
3. Hubungkan ke `useGameStore` & posisi player.
4. Responsive (mobile & desktop).

### Prompt
```text
Buat UI game (HUD) di src/ui/ sebagai overlay React di atas Canvas.

Komponen:
- src/ui/HUD.tsx — container HUD, position fixed/absolute di atas canvas.
- Tampilkan:
  - Goal status (mis. badge "GOAL!" saat menang, dari gameState).
  - Distance to goal: hitung jarak player ke gawang secara live (update tiap frame /
    throttled), tampilkan dalam meter.
  - Restart button (panggil reset() dari useGameStore).
- Reuse WinScreen (Fase 6) atau integrasikan ke HUD.
- Styling responsive: enak dilihat di desktop & mobile (gunakan rem/%, font readable,
  hindari menutupi area gameplay).

Data dari src/hooks/useGameStore.ts dan posisi player (ref/state).
Pisahkan UI dari logika 3D — UI tidak boleh di dalam <Canvas>.
React + TypeScript.
```

### Files
- `src/ui/HUD.tsx`
- `src/ui/DistanceMeter.tsx` (opsional)
- update `src/App.tsx` (render HUD di luar `<Canvas>`)

---

## Checklist
- [ ] Goal status tampil
- [ ] Distance to goal update secara live
- [ ] Restart button berfungsi
- [ ] Layout rapi di desktop & mobile

## Catatan integrasi
- Update distance tiap frame bisa bikin re-render React berlebihan — throttle (mis. tiap 100ms) atau pakai ref + update DOM langsung.
- UI overlay = `<div>` biasa di luar Canvas, atau drei `<Html fullscreen>` di dalam. Untuk HUD layar, di luar Canvas lebih simpel.
- Commit: `feat: ui`
