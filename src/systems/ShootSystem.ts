import { useEffect } from 'react'
import * as THREE from 'three'
import { useGameStore } from '../hooks/useGameStore'
import { GOAL_LINE_Z } from '../components/Goal/goalConfig'

/**
 * ShootSystem — input & matematika tendangan.
 *
 * Transisi dribble→shot (lihat AGENTS.md): satu `<RigidBody>` yang `type`-nya
 * di-switch via `isShot` (kinematicPosition → dynamic). Saat dynamic, Ball
 * memberi impulse memakai `computeShotVelocity` di sini.
 */

/** Kecepatan horizontal tendangan (m/s). */
export const SHOOT_HSPEED = 18
/** Komponen vertikal (lob ringan, m/s). */
export const SHOOT_VSPEED = 4

/**
 * Hitung kecepatan target bola saat ditendang: arah horizontal menuju mulut
 * gawang (x=0, z=GOAL_LINE_Z) + lob ke atas. Ditulis ke `out`.
 */
export function computeShotVelocity(
  ballPos: { x: number; y: number; z: number },
  out: THREE.Vector3,
): THREE.Vector3 {
  const dx = 0 - ballPos.x
  const dz = GOAL_LINE_Z - ballPos.z
  const len = Math.hypot(dx, dz) || 1
  out.set((dx / len) * SHOOT_HSPEED, SHOOT_VSPEED, (dz / len) * SHOOT_HSPEED)
  return out
}

/**
 * useShootControls — dengarkan tombol Space; tembak hanya jika `canShoot`
 * (dijaga oleh action `shoot()` di store). Dipanggil sekali (mis. di App).
 */
export function useShootControls(): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        useGameStore.getState().shoot()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
