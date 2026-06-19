import { interactionGroups } from '@react-three/rapier'

/**
 * Collision groups (Rapier interactionGroups).
 *
 * Tujuan utama: player dan bola TIDAK saling bertabrakan secara fisik.
 * Saat dribble, bola kinematic dipaksa ke depan player; tanpa pemisahan ini
 * bola menembus kapsul player dan mendorongnya terlempar ke atas (bug).
 * Keduanya tetap bertabrakan dengan WORLD (ground) — penting untuk mode shot.
 *
 * Sensor (goal zone / goal net, Fase 4+) memfilter via `userData.type`, jadi
 * cukup masuk grup GOAL yang melihat PLAYER & BALL.
 */
export const GROUP = {
  WORLD: 0,
  PLAYER: 1,
  BALL: 2,
  GOAL: 3,
} as const

export const COLLISION = {
  /** Ground & gedung: ditabrak player + bola. */
  world: interactionGroups(GROUP.WORLD, [GROUP.PLAYER, GROUP.BALL]),
  /** Player: hanya bertabrakan dengan world (bukan bola). */
  player: interactionGroups(GROUP.PLAYER, [GROUP.WORLD, GROUP.GOAL]),
  /** Bola: hanya bertabrakan dengan world (bukan player). */
  ball: interactionGroups(GROUP.BALL, [GROUP.WORLD, GROUP.GOAL]),
  /** Sensor goal: mendeteksi player & bola, tanpa respon fisik. */
  goal: interactionGroups(GROUP.GOAL, [GROUP.PLAYER, GROUP.BALL]),
} as const
