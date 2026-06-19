# Fase 4 — Area Goal

**Jalur:** 🤖 Claude Code saja

## Goal
Ada zona di ujung jalan; saat player masuk zona, muncul prompt "Press Space to Shoot".

---

## 🤖 Claude Code

### Plan
1. Buat `GoalZone` = collider sensor Rapier (tidak solid, hanya mendeteksi).
2. Tempatkan di ujung jalan (sumbu +Z, sebelum posisi gawang).
3. Saat player masuk → set state global `inGoalZone = true`; saat keluar → false.
4. Tampilkan teks prompt (HTML overlay via drei `<Html>` atau UI layer) saat `inGoalZone`.

### Prompt
```text
Buat goal zone di src/components/Goal/GoalZone.tsx menggunakan Rapier sensor.

Spesifikasi:
- RigidBody type="fixed" dengan collider cuboid yang di-set sebagai sensor (tidak menabrak fisik).
- Posisi di ujung jalan (+Z), sebelum lokasi gawang. Ukuran zona cukup lebar selebar jalan.
- Gunakan onIntersectionEnter / onIntersectionExit untuk deteksi player masuk/keluar.
- Simpan status ke state global (buat store ringan dengan zustand di src/hooks/useGameStore.ts
  jika belum ada): inGoalZone: boolean.
- Saat inGoalZone true, tampilkan prompt "Press Space to Shoot"
  (pakai drei <Html> di dunia, atau overlay React di src/ui/).

Pastikan deteksi hanya untuk collider player (cek lewat userData / collider ref).
React Three Fiber + @react-three/rapier + TypeScript.
```

### Files
- `src/components/Goal/GoalZone.tsx`
- `src/hooks/useGameStore.ts` (state global: `inGoalZone`, nanti diperluas untuk `isGoal`, `phase`)
- `src/ui/ShootPrompt.tsx` (opsional, kalau pakai overlay React)

---

## Checklist
- [ ] Goal zone aktif (sensor mendeteksi)
- [ ] Prompt "Press Space to Shoot" muncul saat masuk
- [ ] Prompt hilang saat keluar zona

## Catatan integrasi
- Buat `useGameStore` sekarang karena akan jadi pusat state: `inGoalZone`, `isGoal`, `canShoot`, `gameState` ('playing' | 'win'). Fase 5, 6, 9 semua memakainya.
- Identifikasi collider player: set `userData={{ type: 'player' }}` di RigidBody player (Fase 2) supaya sensor bisa memfilter.
- Commit: `feat: goal zone`
