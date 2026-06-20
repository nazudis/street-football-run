import { useEffect, useRef } from 'react'
import { useGameStore } from '../hooks/useGameStore'
import { GOAL_LINE_Z } from '../components/Goal/goalConfig'

/**
 * DistanceMeter — jarak player→gawang (live).
 *
 * Update via interval (100ms) + tulis langsung ke DOM (textContent), bukan
 * setState — menghindari re-render React tiap frame. Baca `playerPosition`
 * (Vector3 non-reaktif) dari store.
 */
export default function DistanceMeter() {
  const valueRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const tick = () => {
      const z = useGameStore.getState().playerPosition.z
      const dist = Math.max(0, GOAL_LINE_Z - z)
      if (valueRef.current) {
        valueRef.current.textContent = dist < 1 ? '0' : Math.round(dist).toString()
      }
    }
    tick()
    const id = window.setInterval(tick, 100)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span>
      <span ref={valueRef}>—</span>
      <span style={{ opacity: 0.7, marginLeft: 4 }}>m</span>
    </span>
  )
}
