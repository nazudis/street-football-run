# Fase 6 — Goal Detection

**Jalur:** 🤖 Claude Code saja
**Ini menutup MVP — setelah ini game sudah bisa dimainkan dari awal sampai menang.**

## Goal
Saat bola masuk area gawang → tampil "GOAL", gameplay berhenti, muncul tombol restart.

---

## 🤖 Claude Code

### Plan
1. Buat sensor di mulut gawang (collider sensor Rapier).
2. Deteksi bola masuk → set `gameState='win'`, `isGoal=true`.
3. Render win screen overlay: teks "GOAL!" + tombol Restart.
4. Restart = reset posisi player & bola, reset state ke 'playing'.

### Prompt
```text
Buat goal detector di src/components/Goal/GoalNet.tsx (atau perluas Goal).

Spesifikasi:
- Tambahkan collider SENSOR di mulut gawang (area kecil di dalam gawang).
- onIntersectionEnter: jika yang masuk adalah bola (cek userData type='ball'),
  set state global gameState='win' dan isGoal=true.
- Saat gameState='win':
  - Hentikan gameplay: matikan input player & bola (freeze update).
  - Tampilkan overlay React di src/ui/WinScreen.tsx: teks besar "GOAL!" + tombol "Restart".
- Tombol Restart: reset posisi player ke spawn, reset bola ke mode dribble di depan player,
  reset state (gameState='playing', isGoal=false, isShot=false, canShoot=true).

Gunakan useGameStore (Fase 4). Beri userData type='ball' pada RigidBody bola.
React Three Fiber + @react-three/rapier + TypeScript.
```

### Files
- `src/components/Goal/GoalNet.tsx` (sensor gawang)
- `src/ui/WinScreen.tsx`
- update `src/hooks/useGameStore.ts` (`gameState`, `isGoal`, action `reset()`)
- update Player & Ball (hormati freeze saat 'win', dan logic reset)

---

## Checklist
- [ ] Bola masuk gawang → "GOAL!" muncul
- [ ] Gameplay berhenti saat menang
- [ ] Tombol Restart mengembalikan ke kondisi awal & bisa main lagi

## Catatan integrasi
- Sensor gawang harus cukup dalam supaya bola cepat tidak "lewat" tanpa terdeteksi (tunneling). Kalau bola sangat cepat, aktifkan CCD di RigidBody bola.
- Reset bersih lebih mudah jika semua entity membaca posisi spawn dari konstanta terpusat.
- 🎉 Setelah commit ini, MVP selesai. Commit: `feat: goal detection`
