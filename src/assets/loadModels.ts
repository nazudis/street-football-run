import { useGLTF } from '@react-three/drei'

/**
 * Daftar path model GLB (di-serve dari `public/models/`, path diawali `/`).
 * Semua model sudah dioptimasi (meshopt + tekstur WebP 1k).
 */
export const MODELS = {
  player: '/models/player.glb',
  playerAnimated: '/models/player_animated.glb',
  ball: '/models/ball.glb',
  goal: '/models/goal.glb',
  buildings: [
    '/models/buildings/building_a.glb',
    '/models/buildings/building_b.glb',
    '/models/buildings/building_c.glb',
    '/models/buildings/building_d.glb',
  ],
} as const

/** Preload semua model agar siap saat komponen render (panggil sekali di app). */
export function preloadModels(): void {
  useGLTF.preload(MODELS.player)
  useGLTF.preload(MODELS.playerAnimated)
  useGLTF.preload(MODELS.ball)
  useGLTF.preload(MODELS.goal)
  MODELS.buildings.forEach((url) => useGLTF.preload(url))
}

preloadModels()
