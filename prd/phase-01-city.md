# Fase 1 — Kota Sederhana

**Jalur:** 🤖 Claude Code (pakai placeholder box) — asset Meshy opsional, bisa ditunda ke Fase 7.

## Goal
Lingkungan perkotaan sederhana: jalan utama lurus, gedung berjajar di kiri-kanan, terasa seperti koridor kota.

---

## 🤖 Claude Code

### Plan
1. Buat komponen `City` dengan procedural generator sederhana.
2. Jalan = plane panjang di tengah (sumbu Z sebagai arah lari).
3. Gedung = box geometry ditempatkan otomatis di kiri & kanan sepanjang jalan, dengan variasi tinggi/lebar.
4. Parameterkan: panjang jalan, jarak antar gedung, lebar jalan — supaya gampang di-tweak.

### Prompt
```text
Buat sistem city generator sederhana di src/components/City/.

Spesifikasi:
- Jalan utama: plane panjang mengarah ke sumbu +Z (mis. lebar 8, panjang 200), warna gelap (aspal).
- Gedung: untuk sekarang pakai BOX GEOMETRY placeholder (belum model).
- Tempatkan gedung otomatis berbaris di kiri (x negatif) dan kanan (x positif) jalan,
  dengan spacing teratur sepanjang Z.
- Variasikan tinggi & warna gedung secara deterministik (seeded) supaya tidak flat.
- Buat props yang bisa dikonfigurasi: roadLength, roadWidth, buildingSpacing.
- Semua mesh castShadow/receiveShadow.

Gunakan React Three Fiber + TypeScript. Render <City/> di MainScene.
Pisahkan logika penempatan ke fungsi util agar mudah diganti model nanti (Fase 7).
```

### Files
- `src/components/City/City.tsx`
- `src/components/City/buildingLayout.ts` (util penempatan)
- update `src/scenes/MainScene.tsx`

---

## 🎨 Third-Party (OPSIONAL — boleh skip dulu, dipakai penuh di Fase 7)

**Tool:** Meshy (Text-to-3D)

**Prompt generate:**
```text
Low poly urban buildings.
Stylized city buildings.
Game ready.
GLB format.
```

**Setting export:** `.glb`, low poly (< 2k tris/gedung), Y-up. Simpan ke `public/models/buildings/`.

> Rekomendasi: di fase ini **cukup box placeholder**. Generate model bangunan beneran nanti di Fase 7 sekalian dengan asset lain, supaya gaya visual konsisten.

---

## Checklist
- [ ] Jalan utama terlihat lurus
- [ ] Gedung berjajar kiri & kanan
- [ ] Dunia terasa seperti koridor kota
- [ ] Parameter panjang/lebar jalan bisa diubah

## Catatan integrasi
- Tentukan **arah lari = +Z** dan pegang konvensi ini di semua fase berikutnya (player, kamera, gawang di ujung +Z).
- Commit: `feat: city environment`
