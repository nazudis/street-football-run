# Fase 5 — Shooting System

**Jalur:** 🤖 Claude Code saja

## Goal
Saat Space ditekan (di goal zone), bola lepas dari dribble dan meluncur ke arah gawang pakai physics impulse, tidak menembus objek.

---

## 🤖 Claude Code

### Plan
1. Tangkap input Space (hanya aktif saat `inGoalZone`).
2. Switch bola dari mode dribble (kinematic/follow) → mode shot (dynamic RigidBody).
3. Beri impulse ke arah gawang (arah +Z, sedikit ke atas) dengan kekuatan tetap.
4. Bola tunduk pada collision (tidak nembus gawang/tanah/gedung).
5. Set state `canShoot=false` setelah menendang supaya tidak dobel-tendang.

### Prompt
```text
Buat shooting system di src/systems/ShootSystem.ts, terintegrasi dengan Ball (Fase 3).

Spesifikasi:
- Dengarkan tombol Space; hanya berlaku jika inGoalZone === true dan belum menembak.
- Saat ditembak:
  - Ubah bola dari mode dribble (mengikuti player) menjadi RigidBody DINAMIS.
  - Beri applyImpulse ke arah gawang: arah utama +Z dengan sedikit komponen +Y (lob ringan),
    magnitude impulse konstan yang bisa di-tweak (mis. {x:0, y:2, z:18}).
  - Set state: isShot=true, canShoot=false.
- Bola sekarang ikut fisika penuh: collider ball (ball collider), restitution sedang
  agar memantul wajar, tidak menembus tanah/gawang/gedung.
- Kamera tetap mengikuti (boleh fokus ke bola setelah tembakan — opsional).

Gunakan @react-three/rapier ref (rigidBodyRef) untuk applyImpulse.
React Three Fiber + TypeScript.
```

### Files
- `src/systems/ShootSystem.ts`
- update `src/components/Ball/Ball.tsx` (dukung dua mode: dribble vs dynamic)
- update `src/hooks/useGameStore.ts` (`isShot`, `canShoot`)

---

## Checklist
- [ ] Tekan Space → bola meluncur ke arah gawang
- [ ] Bola tidak menembus tanah/objek
- [ ] Tidak bisa nembak dua kali (sekali tendang)

## Catatan integrasi
- Transisi kinematic→dynamic: cara aman di Rapier adalah set `type` lewat ref atau render ulang RigidBody dengan key berbeda. Atau: bola selalu dynamic, tapi saat dribble posisinya di-`setNextKinematicTranslation`. Pilih satu pendekatan dan dokumentasikan.
- Pastikan gawang (mesh/collider) sudah ada minimal placeholder agar bisa diuji; collider gawang detail di Fase 6.
- Commit: `feat: shooting`
