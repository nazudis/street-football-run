# Fase 2 — Player Controller

**Jalur:** 🤖 Claude Code saja (placeholder capsule untuk badan player)

## Goal
Karakter bisa jalan & lari pakai WASD + Shift, gerakan berbasis fisika, kamera mengikuti dengan halus.

---

## 🤖 Claude Code

### Plan
1. Install & setup Rapier (`@react-three/rapier`) — bungkus scene dengan `<Physics>`.
2. Player = RigidBody (mis. capsule collider) dengan placeholder mesh capsule.
3. Input WASD via hook keyboard; Shift = sprint (naikkan kecepatan).
4. Gerak berbasis velocity/impulse di `useFrame`, hadap arah gerak.
5. Kamera third-person follow dengan lerp/smoothing (sistem terpisah di `systems/CameraSystem`).

### Prompt — Setup fisika (kalau belum ada)
```text
Tambahkan Rapier physics ke project: install @react-three/rapier.
Bungkus isi MainScene dengan <Physics> (gravity normal).
Ubah ground plane jadi RigidBody type="fixed" dengan collider cuboid tipis.
Pastikan dev server tetap jalan.
```

### Prompt — Controller
```text
Buat third person character controller di src/components/Player/Player.tsx.

Teknologi: React Three Fiber + @react-three/rapier + TypeScript.

Fitur:
- Player adalah RigidBody dinamis dengan CapsuleCollider, lockRotations agar tidak terguling.
- Placeholder mesh: capsule berwarna (model asli menyusul di Fase 7).
- Input WASD (buat hook useKeyboardControls di src/hooks/).
- Shift = sprint (mis. walkSpeed 4, runSpeed 8).
- Gerakan physics-based: set linear velocity berdasarkan input arah, relatif ke arah kamera.
- Player menghadap (rotate) ke arah gerak secara smooth.
- Gerak di bidang XZ; jangan ubah komponen Y velocity (biar gravitasi jalan).

Buat camera follow di src/systems/CameraSystem.ts (atau komponen):
- Kamera third-person di belakang & sedikit di atas player.
- Posisi & lookAt di-lerp tiap frame (smoothing) supaya tidak kaku.

Render <Player/> di MainScene, kamera default mengikuti player (matikan OrbitControls
atau jadikan toggle dev).
```

### Files
- `src/hooks/useKeyboardControls.ts`
- `src/components/Player/Player.tsx`
- `src/systems/CameraSystem.ts` (atau `CameraRig.tsx`)
- update `src/scenes/MainScene.tsx` (wrap `<Physics>`)

---

## Checklist
- [ ] Player jalan dengan WASD
- [ ] Shift bikin lari lebih cepat
- [ ] Kamera mengikuti dengan halus (tidak patah-patah)
- [ ] Player tidak terguling / tidak nembus lantai

## Catatan integrasi
- Gerak relatif ke arah kamera membuat kontrol terasa natural; pastikan vektor arah dinormalisasi.
- Simpan ref ke posisi player (mis. via context/zustand atau ref shared) — akan dipakai Fase 3 (bola ikut) & Fase 9 (distance UI).
- Commit: `feat: player controller`
