import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useGameStore } from '../../hooks/useGameStore'
import { COLLISION } from '../../physics/collisionGroups'
import { GOAL_ZONE } from './goalConfig'

/**
 * GoalZone — sensor di ujung jalan (+Z). Saat player masuk → `inGoalZone` &
 * `canShoot` true; saat keluar → false. Tidak solid (sensor), hanya mendeteksi.
 *
 * Filter hanya player via `userData.type === 'player'` (bola juga lewat sini
 * tapi diabaikan untuk prompt). Konvensi: UI prompt-nya di luar Canvas
 * (lihat `src/ui/ShootPrompt.tsx`).
 */
export default function GoalZone() {
  const setInGoalZone = useGameStore((s) => s.setInGoalZone)
  const setCanShoot = useGameStore((s) => s.setCanShoot)

  const { centerZ, halfX, halfY, halfZ } = GOAL_ZONE

  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[halfX, halfY, halfZ]}
          position={[0, halfY, centerZ]}
          sensor
          collisionGroups={COLLISION.goal}
          onIntersectionEnter={({ other }) => {
            if (other.rigidBody?.userData) {
              const data = other.rigidBody.userData as { type?: string }
              if (data.type === 'player') {
                setInGoalZone(true)
                setCanShoot(true)
              }
            }
          }}
          onIntersectionExit={({ other }) => {
            if (other.rigidBody?.userData) {
              const data = other.rigidBody.userData as { type?: string }
              if (data.type === 'player') {
                setInGoalZone(false)
                setCanShoot(false)
              }
            }
          }}
        />
      </RigidBody>

      {/* Penanda visual area tembak di permukaan jalan. */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, centerZ]}
        receiveShadow
      >
        <planeGeometry args={[halfX * 2, halfZ * 2]} />
        <meshStandardMaterial
          color="#e2c044"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}
