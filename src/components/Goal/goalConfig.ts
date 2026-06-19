/**
 * Konfigurasi posisi gawang & goal zone, dipakai bersama oleh GoalZone (Fase 4),
 * dan nanti Goal/net detector (Fase 6). Semua di sumbu +Z (arah lari).
 *
 * Catatan: `halfX` mengikuti setengah lebar jalan default (roadWidth 8 → 4).
 */
export const GOAL_LINE_Z = 98 // garis gawang (mistar) — gawang dipasang di sini
export const GOAL_WIDTH = 7 // lebar mulut gawang
export const GOAL_HEIGHT = 3 // tinggi mistar

/** Zona pemicu prompt tembak, sedikit sebelum garis gawang. */
export const GOAL_ZONE = {
  centerZ: 92,
  halfX: 4,
  halfY: 2,
  halfZ: 9,
} as const
