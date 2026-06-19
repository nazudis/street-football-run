# Fase 3 — Dribbling Bola

**Jalur:** 🤖 Claude Code saja (placeholder sphere)
**Fase paling penting untuk feel game.**

## Goal
Bola selalu berada ~1 meter di depan player dan ikut bergerak halus saat player jalan/lari — terlihat seperti digiring.

---

## 🤖 Claude Code

### Plan (versi MVP — belum physics penuh)
1. Bola = mesh sphere placeholder.
2. Tiap frame, hitung posisi target = posisi player + (arah hadap player × jarak dribble).
3. Lerp posisi bola menuju target (smoothing) supaya tidak nempel kaku.
4. Tambahkan rotasi bola sesuai kecepatan (efek menggelinding) — opsional tapi bikin meyakinkan.

### Prompt
```text
Buat sistem dribbling sederhana di src/systems/DribbleSystem.ts + src/components/Ball/Ball.tsx.

Versi MVP (belum physics penuh):
- Bola = sphere placeholder (radius ~0.3).
- Tiap frame hitung target = posisi player + forwardDir * dribbleDistance (mis. 1.0).
  Tinggi bola di permukaan tanah (y = radius).
- Lerp posisi bola ke target dengan faktor smoothing (mis. 0.15) agar gerakan halus
  dan ada sedikit "tertinggal" saat player berbelok.
- Putar bola sesuai jarak yang ditempuh (rolling) berdasarkan delta posisi.
- Ambil posisi & arah player dari state/ref yang sudah ada (Fase 2).

React Three Fiber + TypeScript. Render <Ball/> di MainScene.
Buat dribbleDistance & smoothing sebagai konstanta yang mudah di-tweak.
```

### Files
- `src/components/Ball/Ball.tsx`
- `src/systems/DribbleSystem.ts`
- update `src/scenes/MainScene.tsx`

---

## Checklist
- [ ] Bola selalu di depan player
- [ ] Bola ikut bergerak & terlihat menggelinding
- [ ] Gerakan halus saat belok (sedikit lag natural)

## Catatan integrasi
- **Penting:** desain Ball supaya nanti bisa switch antara mode "dribble (kinematic, ikut player)" dan mode "shot (dynamic, kena impulse)" — lihat Fase 5. Simpan flag `isShot` di state bola.
- Saat dribble, bola sebaiknya kinematic/diset posisinya manual; saat ditendang, baru jadi dynamic RigidBody.
- Commit: `feat: dribble system`
