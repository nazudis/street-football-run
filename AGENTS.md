# AGENTS.md — Street Football Run

> Dokumen acuan utama untuk agent (Claude Code, dll.) yang bekerja di project ini.
> **Wajib dibaca sebelum mulai coding.** Berisi visi, tech stack, konvensi, struktur, dan status fase.

---

## ⚠️ INSTRUKSI WAJIB: Jaga Dokumen Ini Tetap Update

Seiring berjalannya project, **setiap kali ada perubahan atau penambahan konvensi / keputusan arsitektur / hal penting lain**, agent **HARUS memperbarui AGENTS.md ini** di bagian yang relevan pada turn yang sama.

Yang wajib dicatat ke sini begitu terjadi:
- Konvensi baru atau yang berubah (penamaan, struktur folder, arah sumbu, pola fisika, dll).
- Keputusan teknis penting (mis. pilih zustand vs context, cara transisi kinematic↔dynamic, dll).
- Library baru yang ditambahkan + alasannya.
- Penyimpangan dari rencana PRD (apa yang berubah & kenapa).
- Update status fase di tabel [Status Fase](#status-fase).
- Gotcha / jebakan yang ditemukan supaya tidak terulang.

Aturan:
- Catat **fakta & keputusan**, bukan log aktivitas. Singkat, padat, actionable.
- Kalau sebuah konvensi di sini menjadi usang, **ubah/hapus** — jangan biarkan info basi.
- Tambahkan entri ber-tanggal di [Changelog Keputusan](#changelog-keputusan) untuk perubahan signifikan.

---

## Visi Game

**Street Football Run** — game mini 3D berbasis browser. Pemain menggiring bola menyusuri jalan kota, sampai di area gawang, lalu menendang bola untuk mencetak gol & menang.

Inti gameplay hanya 3 mekanik: **Bergerak · Menggiring · Menendang**. Tidak ada AI musuh, inventory, multiplayer, atau ekonomi.

**Gameplay loop:** Spawn → Giring bola → Lewati jalan kota → Sampai area goal → Tendang → Gol → Menang.
**Target durasi bermain (MVP):** 30–60 detik.

---

## Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Framework | React + TypeScript |
| Build tool | Vite |
| 3D | Three.js + React Three Fiber (R3F) |
| Helper R3F | @react-three/drei |
| Fisika | Rapier (@react-three/rapier) |
| State | zustand (`useGameStore`) |
| Asset model | GLTF / GLB |

> TypeScript strict mode. Semua komponen `.tsx`, util/hook `.ts`.

---

## Struktur Folder

```text
src/
├── components/
│   ├── Player/      # karakter + controller + animasi
│   ├── Ball/        # bola (mode dribble & shot)
│   ├── Goal/        # gawang, goal zone (sensor), goal net detector
│   └── City/        # generator kota + layout gedung
├── systems/
│   ├── CameraSystem # third-person follow + cinematic
│   ├── DribbleSystem
│   ├── ShootSystem
│   └── AudioSystem
├── physics/         # helper/konfigurasi fisika
├── hooks/           # useKeyboardControls, useGameStore, useSound, dll
├── assets/          # (lihat juga public/ untuk GLB & audio)
│   ├── models/
│   └── audio/
├── ui/              # HUD, WinScreen, ShootPrompt (overlay React, DI LUAR <Canvas>)
├── scenes/
│   └── MainScene.tsx
└── App.tsx
```

> Asset GLB & audio yang di-load via path di-serve dari `public/models/...` dan `public/audio/...` (konvensi yang dipakai di dokumen fase).

---

## Konvensi Penting

Konvensi ini mengikat seluruh fase. Kalau ada yang berubah, update di sini.

1. **Arah lari = sumbu +Z.** Player bergerak ke +Z; gawang ada di ujung +Z. Pegang konsisten di city, player, kamera, gawang.
2. **Visual ≠ collider.** Visual pakai model GLB; collider fisika **selalu primitif** (CapsuleCollider untuk player, ball collider untuk bola, cuboid untuk gedung/gawang). **Jangan pakai trimesh collider** dari model — mahal & rawan bug.
3. **State global di `useGameStore` (zustand).** Field inti: `inGoalZone`, `canShoot`, `isShot`, `isGoal`, `gameState` ('playing' | 'win'), + action `reset()`. Semua fase yang butuh state lintas-komponen lewat sini.
4. **Bola punya 2 mode:** `dribble` (kinematic / posisi diset manual mengikuti player) dan `shot` (dynamic, kena impulse). Simpan flag `isShot`. Pilih satu pendekatan transisi kinematic↔dynamic dan dokumentasikan saat sudah diputuskan.
5. **Identifikasi collider via `userData`:** RigidBody player `userData={{ type: 'player' }}`, bola `userData={{ type: 'ball' }}`. Sensor (goal zone & goal net) memfilter berdasarkan ini.
6. **UI di luar `<Canvas>`.** HUD/overlay = React DOM biasa di `src/ui/`, bukan di dalam dunia 3D. Drei `<Html>` hanya untuk label in-world (mis. prompt 3D).
7. **Skala = meter.** 1 unit = 1 meter. Player ~1.7–1.8 tinggi. Origin model: di kaki untuk karakter, di pusat untuk bola.
8. **Movement physics-based & frame-rate independent.** Pakai delta time untuk lerp/damping kamera & gerakan.
9. **Placeholder dulu, asset belakangan.** Box/sphere/capsule placeholder sampai Fase 7. Jangan blok gameplay karena nunggu asset.

---

## Alur Pengerjaan (Vibe Coding)

Satu fitur per siklus — jangan minta "buat game lengkap" sekaligus.

```text
1 fitur → Prompt AI → Jalankan → Fix error → Commit Git → Lanjut fitur berikutnya
```

Dua jalur kerja di tiap fase:
- 🤖 **Claude Code** — coding (prompt siap-paste ada di tiap `prd/phase-XX-*.md`).
- 🎨 **Third-Party** — generate asset manual (Meshy untuk model, Mixamo untuk animasi, Freesound/ElevenLabs untuk audio).

---

## Ringkasan Fase & Urutan Commit

| Fase | Nama | Jalur | Commit |
|------|------|-------|--------|
| 0 | Project Setup | 🤖 | `feat: setup r3f` |
| 1 | Kota Sederhana | 🤖 | `feat: city environment` |
| 2 | Player Controller | 🤖 | `feat: player controller` |
| 3 | Dribbling Bola | 🤖 | `feat: dribble system` |
| 4 | Area Goal | 🤖 | `feat: goal zone` |
| 5 | Shooting System | 🤖 | `feat: shooting` |
| 6 | Goal Detection | 🤖 | `feat: goal detection` ← **MVP playable** |
| 7 | Asset Upgrade | 🎨+🤖 | `feat: model assets` |
| 8 | Animasi | 🎨+🤖 | `feat: animations` |
| 9 | UI | 🤖 | `feat: ui` |
| 10 | Polish (Audio+Kamera) | 🎨+🤖 | `feat: audio & camera polish` |

Detail lengkap (plan + prompt + checklist) tiap fase ada di folder [`prd/`](prd/):
- Index: [prd/README.md](prd/README.md)
- Checklist gabungan: [prd/phase-checklist.md](prd/phase-checklist.md)
- Pipeline asset: [prd/asset-pipeline.md](prd/asset-pipeline.md)

---

## Pipeline Asset (Ringkas)

| Item | Tool | Lokasi simpan |
|------|------|---------------|
| Karakter, bola, gawang, gedung | Meshy (text-to-3D, `.glb`) | `public/models/` |
| Animasi karakter | Mixamo (Idle/Walk/Run/Kick) | `public/models/player_animated.glb` |
| SFX (footstep/kick/goal) | Freesound / ElevenLabs SFX | `public/audio/` |

Spesifikasi export: `.glb` binary, Y-up, skala meter, low poly, texture baked. Detail di [prd/asset-pipeline.md](prd/asset-pipeline.md).

---

## Status Fase

> **Update tabel ini setiap fase selesai.** ⬜ belum · 🟡 progres · ✅ selesai

| Fase | Status | Catatan |
|------|--------|---------|
| 0 Setup | ✅ | Vite+R3F+drei, MainScene (lantai, lighting, OrbitControls). `npm run dev` OK. |
| 1 City | ✅ | Jalan +Z (plane aspal) + gedung box placeholder seeded (kiri/kanan), trotoar, fog. Layout di `buildingLayout.ts`. |
| 2 Player | ✅ | Rapier `<Physics>`, ground fixed, player capsule (RigidBody dynamic, rotasi dikunci), WASD+Shift relatif kamera, CameraRig follow (lerp). |
| 3 Dribble | ✅ | Bola sphere, mode dribble (kinematicPosition) lerp di depan player + rolling. Mode shot (dynamic) sudah di-wire via `isShot`. |
| 4 Goal Zone | ✅ | Sensor cuboid di +Z (`goalConfig.ts`), set `inGoalZone`/`canShoot` via userData player. Prompt "Press Space to Shoot" = overlay DOM di `src/ui/ShootPrompt.tsx`. |
| 5 Shooting | ✅ | Space (saat `canShoot`) → `shoot()` set `isShot`, Ball switch ke dynamic lalu `applyImpulse` ke arah gawang (lob ringan). Rangka gawang placeholder (tiang+mistar) sebagai target. |
| 6 Goal Detection | ✅ | **MVP playable.** Sensor gol di mulut gawang → `gameState='win'`. WinScreen "GOAL!" + Restart. Reset via `runId` (remount Player/Ball ke spawn). Player freeze saat win. |
| 7 Assets | ✅ | Model GLB (player/ball/goal/4 gedung) menggantikan placeholder via `GLTFModel` (auto-fit bbox). Collider tetap primitif. Aset Meshy dioptimasi (480MB→39MB). Mentah di `assets-raw/` (gitignore). |
| 8 Animation | ✅ | `player_animated.glb` (Mixamo: Idle/Walk/Run/Kick) via `useAnimations`. State machine di `PlayerModel.tsx`: locomotion ref dari Player + Kick one-shot saat `isShot`. Crossfade 0.2s. |
| 9 UI | ⬜ | |
| 10 Polish | ⬜ | |

---

## Changelog Keputusan

> Catat keputusan teknis/konvensi signifikan beserta tanggal. Terbaru di atas.

- 2026-06-20 — Fase 8 selesai. Animasi Mixamo: clip `Idle_5`/`Walking`/`Running`/`Kick_a_Soccer_Ball` di `player_animated.glb` (dioptimasi 47MB→398KB; **tanpa simplify** karena skinned mesh). `PlayerModel.tsx`: `useAnimations`, clip dipetakan via substring (idle/walk/run/kick). Lokomosi dikontrol `locomotion` ref dari Player (Idle/Walk/Run via input+sprint), Kick one-shot (LoopOnce+clampWhenFinished) dipicu `isShot`, durasi via timer `performance.now()`. Crossfade 0.2s. Model skinned TIDAK di-clone (rusak skinning) — pakai scene langsung (player single instance), fit via group pembungkus. `MODELS.player` (statik) tak lagi dipakai Player.
- 2026-06-20 — Fase 7 selesai. (a) **Optimasi aset wajib**: export mentah Meshy 480MB (bola 320k verts + 4× tekstur 4K) → dioptimasi `@gltf-transform/cli optimize --compress meshopt --texture-compress webp --texture-size 1024` jadi ~39MB total. Mentah disimpan lokal di `assets-raw/` (gitignore) — `player.glb` mentah dipakai lagi untuk Mixamo (Fase 8). (b) `src/components/GLTFModel.tsx`: pembungkus auto-fit (ukur Box3 → skala ke `fitSize`/`fitAxis`, anchor `bottom`/`center`) supaya skala/origin Meshy yang acak otomatis pas dengan collider primitif. (c) Loader `src/assets/loadModels.ts` (`useGLTF.preload`). (d) drei `useGLTF` otomatis pasang Meshopt+Draco decoder. (e) Konstanta koreksi arah hadap: Player `rotationY={Math.PI}`, Goal `GOAL_FACING`. Gedung: varian deterministik + collider cuboid WORLD. Scene dibungkus `<Suspense>`.
- 2026-06-19 — Fase 6 selesai → **MVP playable**. Pola reset: store punya `runId` yang naik di `reset()`; MainScene render `<Player key=runId>` & `<Ball key=runId>` → remount fresh ke spawn (semua ref & posisi balik otomatis, lebih bersih daripada teleport manual). Sensor gol (`GoalNet`) filter `userData.type==='ball'`, set `gameState='win'`. Player freeze saat `win` (baca `getState().gameState` di useFrame). WinScreen & ShootPrompt = overlay DOM; ShootPrompt disembunyikan saat win.
- 2026-06-19 — Fase 5 selesai. Tendang: Space → `shoot()` (guard `canShoot && !isShot`) set `isShot`. Ball menunggu Rapier benar-benar memindah body ke `dynamic` (`bodyType()===0`) lewat fase `idle→pending→done` baru `applyImpulse`. Impulse = kecepatan target × `mass()` (mass-independent, predictable). Arah tembak ke mulut gawang (x=0, z=GOAL_LINE_Z) + lob `SHOOT_VSPEED`. Bola: `restitution 0.45`, `friction 0.6`. Rangka gawang placeholder collider grup WORLD.
- 2026-06-19 — Fase 4 selesai. Posisi gawang & zona dipusatkan di `src/components/Goal/goalConfig.ts` (GOAL_LINE_Z=196, GOAL_ZONE centerZ=184) supaya konsisten dengan Fase 6. Sensor pakai `onIntersectionEnter/Exit` + filter `other.rigidBody.userData.type==='player'`. Goal zone juga set `canShoot` (dipakai Fase 5).
- 2026-06-19 — Collision groups (`src/physics/collisionGroups.ts`): player & bola TIDAK saling tabrak (fix bug player terlempar ke atas saat bola kinematic menembus kapsul ketika belok/putar balik). Keduanya tetap tabrak WORLD (ground). Grup: WORLD=0, PLAYER=1, BALL=2, GOAL=3. Sensor goal melihat PLAYER & BALL. Pasang `collisionGroups` di tiap collider.
- 2026-06-19 — Fase 3 selesai. Transisi kinematic↔dynamic bola diputuskan: satu `<RigidBody>` dengan `type` di-switch dari `isShot` store (`kinematicPosition` saat dribble → `dynamic` saat shot). Saat dribble, posisi diset manual via `setNextKinematicTranslation/Rotation` (lerp ke target = playerPos + playerForward × DRIBBLE_DISTANCE). Bola pakai `ccd` (anti tunneling saat ditendang kencang nanti). Player publish `playerForward` (unit XZ) ke store untuk dribble.
- 2026-06-19 — Fase 2 selesai. Stack fisika: `@react-three/rapier@1.5` (v2 butuh R3F 9/React 19 → tidak dipakai). State: `zustand@5` di `src/hooks/useGameStore.ts`. Keputusan: (a) `playerPosition` = Vector3 stabil di store, dimutasi in-place tiap frame (non-reaktif, dibaca kamera/bola/UI) — bukan via setState. (b) Gerak relatif arah kamera; player = RigidBody dynamic dengan `enabledRotations={[false,false,false]}`, gerak via `setLinvel` di XZ (Y dibiarkan untuk gravitasi). (c) Visual capsule menghadap arah gerak (rotasi child group, bukan body). (d) Input keyboard via ref (`useKeyboardControls`), tidak memicu re-render.
- 2026-06-19 — Vite di-upgrade ke 8.0.5 (berbasis Rolldown/oxc). Plugin React wajib `@vitejs/plugin-react@^6` (v4 hanya support Vite ≤7 → memunculkan warning oxc/`Invalid key "jsx"`). Jangan turunkan ke v4 selama Vite 8.
- 2026-06-19 — Fase 0 selesai. Scaffold manual (bukan `npm create vite`) supaya tidak menimpa AGENTS.md/prd/. Stack pinned: three 0.169, @react-three/fiber 8, @react-three/drei 9, React 18. TS project references (tsconfig.app/node) + strict.
