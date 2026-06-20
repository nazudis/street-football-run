/**
 * buildingLayout — util penempatan gedung kota (deterministik / seeded).
 *
 * Dipisah dari komponen render supaya gampang diganti ke model GLB di Fase 7:
 * komponen tinggal memetakan `BuildingInstance[]` ini ke mesh/model apa pun.
 *
 * Konvensi: arah lari = +Z. Jalan membentang di sepanjang sumbu Z, gedung
 * berjajar di sisi kiri (x < 0) dan kanan (x > 0).
 */

export interface CityLayoutParams {
  /** Panjang jalan (membentang ke +Z). */
  roadLength: number
  /** Lebar jalan (sumbu X). */
  roadWidth: number
  /** Jarak antar gedung di sepanjang Z. */
  buildingSpacing: number
  /** Celah antara tepi jalan dan muka gedung (trotoar). Default 1.5. */
  sidewalk?: number
  /** Seed RNG supaya layout konsisten antar-render. Default 1337. */
  seed?: number
}

export interface BuildingInstance {
  /** Posisi pusat box [x, y, z]. */
  position: [number, number, number]
  /** Dimensi box [lebarX, tinggiY, tebalZ]. */
  size: [number, number, number]
  /** Warna fasad (placeholder box). */
  color: string
  /** Index varian model gedung (deterministik). */
  variant: number
  /** Rotasi Y agar muka gedung menghadap jalan (radian). */
  rotationY: number
}

/** Jumlah varian model gedung tersedia (lihat MODELS.buildings). */
export const BUILDING_VARIANTS = 4

/** PRNG deterministik (mulberry32) — sama seed, sama hasil. */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Palet warna gedung (abu/beton/bata kalem) untuk variasi deterministik. */
const BUILDING_COLORS = [
  '#6b7280',
  '#7c8497',
  '#8a7f72',
  '#9b6a5c',
  '#5f6b7a',
  '#807d76',
  '#6d7b6e',
  '#8d8a82',
]

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * Hasilkan daftar gedung di kedua sisi jalan.
 * Tinggi, lebar, tebal, dan warna divariasikan secara deterministik.
 */
export function generateBuildings(params: CityLayoutParams): BuildingInstance[] {
  const {
    roadLength,
    roadWidth,
    buildingSpacing,
    sidewalk = 1.5,
    seed = 1337,
  } = params

  const rand = mulberry32(seed)
  const buildings: BuildingInstance[] = []

  // Mulai sedikit di belakang spawn (z negatif kecil) sampai melewati ujung jalan.
  const startZ = -buildingSpacing
  const endZ = roadLength + buildingSpacing

  for (const side of [-1, 1] as const) {
    for (let z = startZ; z <= endZ; z += buildingSpacing) {
      const width = lerp(4, 8, rand()) // x
      const depth = lerp(4, 9, rand()) // z
      const height = lerp(6, 22, rand()) // y

      // Muka gedung menempel ke tepi trotoar; pusat box digeser ke luar.
      const innerFaceX = roadWidth / 2 + sidewalk
      const x = side * (innerFaceX + width / 2)

      // Jitter kecil di sepanjang Z supaya barisan tidak terlalu kaku.
      const zJitter = lerp(-buildingSpacing * 0.15, buildingSpacing * 0.15, rand())

      const color = BUILDING_COLORS[Math.floor(rand() * BUILDING_COLORS.length)]
      const variant = Math.floor(rand() * BUILDING_VARIANTS)
      // Muka gedung menghadap jalan: sisi kiri hadap +X, sisi kanan hadap -X.
      const rotationY = side < 0 ? Math.PI / 2 : -Math.PI / 2

      buildings.push({
        position: [x, height / 2, z + zJitter],
        size: [width, height, depth],
        color,
        variant,
        rotationY,
      })
    }
  }

  return buildings
}
