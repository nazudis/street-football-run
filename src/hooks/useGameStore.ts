import { create } from 'zustand'
import * as THREE from 'three'

/**
 * useGameStore — state global game (zustand).
 *
 * Konvensi (AGENTS.md): field inti lintas-komponen ada di sini.
 * `playerPosition` adalah Vector3 stabil yang dimutasi in-place tiap frame
 * (NON-reaktif — dibaca via `.x/.z`, tidak memicu re-render). Dipakai kamera
 * follow, dan nanti bola (Fase 3) & UI jarak (Fase 9).
 */
export type GameState = 'playing' | 'win'

interface GameStore {
  inGoalZone: boolean
  canShoot: boolean
  isShot: boolean
  isGoal: boolean
  gameState: GameState

  /** Posisi player live (mutasi in-place, jangan di-set ulang). */
  playerPosition: THREE.Vector3
  /** Arah hadap player live (unit vector di XZ, mutasi in-place). */
  playerForward: THREE.Vector3
  /** Naik tiap reset; dipakai sebagai React key Player/Ball untuk remount bersih. */
  runId: number

  setInGoalZone: (v: boolean) => void
  setCanShoot: (v: boolean) => void
  setIsShot: (v: boolean) => void
  setIsGoal: (v: boolean) => void
  setGameState: (s: GameState) => void
  /** Tembak: hanya jika sedang `canShoot` & belum `isShot`. */
  shoot: () => void
  reset: () => void
}

const initialFlags = {
  inGoalZone: false,
  canShoot: false,
  isShot: false,
  isGoal: false,
  gameState: 'playing' as GameState,
}

export const useGameStore = create<GameStore>((set) => ({
  ...initialFlags,
  playerPosition: new THREE.Vector3(0, 0, 0),
  playerForward: new THREE.Vector3(0, 0, 1),
  runId: 0,

  setInGoalZone: (v) => set({ inGoalZone: v }),
  setCanShoot: (v) => set({ canShoot: v }),
  setIsShot: (v) => set({ isShot: v }),
  setIsGoal: (v) => set({ isGoal: v }),
  setGameState: (s) => set({ gameState: s }),

  shoot: () =>
    set((s) =>
      s.canShoot && !s.isShot ? { isShot: true, canShoot: false } : {},
    ),

  // Reset flag + naikkan runId → Player & Ball remount fresh ke spawn.
  reset: () => set((s) => ({ ...initialFlags, runId: s.runId + 1 })),
}))
