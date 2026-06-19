import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useGameStore } from '../../hooks/useGameStore'
import { COLLISION } from '../../physics/collisionGroups'
import { GOAL_LINE_Z, GOAL_WIDTH, GOAL_HEIGHT } from './goalConfig'

/**
 * GoalNet — sensor pendeteksi gol di mulut gawang + jaring visual sederhana.
 *
 * Saat bola (userData.type==='ball') masuk → `isGoal=true`, `gameState='win'`.
 * Sensor sengaja cukup dalam supaya bola cepat tidak menembus tanpa terdeteksi
 * (bola juga ber-CCD).
 */
const NET_DEPTH = 1.2 // kedalaman jaring & sensor (sumbu Z, di belakang garis)

export default function GoalNet() {
  const setIsGoal = useGameStore((s) => s.setIsGoal)
  const setGameState = useGameStore((s) => s.setGameState)

  const halfW = GOAL_WIDTH / 2

  return (
    <group position={[0, 0, GOAL_LINE_Z]}>
      {/* Sensor gol (tepat di belakang garis gawang). */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[halfW - 0.1, GOAL_HEIGHT / 2, NET_DEPTH / 2]}
          position={[0, GOAL_HEIGHT / 2, NET_DEPTH / 2]}
          sensor
          collisionGroups={COLLISION.goal}
          onIntersectionEnter={({ other }) => {
            const data = other.rigidBody?.userData as { type?: string } | undefined
            if (data?.type === 'ball' && useGameStore.getState().gameState !== 'win') {
              setIsGoal(true)
              setGameState('win')
            }
          }}
        />
      </RigidBody>

      {/* Jaring visual (belakang + dua sisi), wireframe semi-transparan. */}
      <mesh position={[0, GOAL_HEIGHT / 2, NET_DEPTH]}>
        <planeGeometry args={[GOAL_WIDTH, GOAL_HEIGHT]} />
        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.35} />
      </mesh>
      {([-1, 1] as const).map((side) => (
        <mesh
          key={side}
          position={[side * halfW, GOAL_HEIGHT / 2, NET_DEPTH / 2]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[NET_DEPTH, GOAL_HEIGHT]} />
          <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  )
}
