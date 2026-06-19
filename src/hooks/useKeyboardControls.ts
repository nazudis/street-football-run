import { useEffect, useRef } from 'react'

/**
 * useKeyboardControls — lacak input WASD + Shift (sprint) tanpa memicu re-render.
 *
 * Mengembalikan ref ke state input terkini; baca `ref.current` di dalam
 * `useFrame`. Mendukung WASD dan arrow keys; Shift = sprint.
 */
export interface MovementInput {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  sprint: boolean
}

const KEY_MAP: Record<string, keyof MovementInput> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  ShiftLeft: 'sprint',
  ShiftRight: 'sprint',
}

export function useKeyboardControls() {
  const input = useRef<MovementInput>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  })

  useEffect(() => {
    const set = (code: string, value: boolean) => {
      const action = KEY_MAP[code]
      if (action) input.current[action] = value
    }
    const onKeyDown = (e: KeyboardEvent) => set(e.code, true)
    const onKeyUp = (e: KeyboardEvent) => set(e.code, false)
    // Reset saat window kehilangan fokus supaya tombol tidak "nyangkut".
    const onBlur = () => {
      input.current = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        sprint: false,
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  return input
}
