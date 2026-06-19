import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { COLLISION } from '../../physics/collisionGroups'
import { GOAL_LINE_Z, GOAL_WIDTH, GOAL_HEIGHT } from './goalConfig'

/**
 * Goal — rangka gawang placeholder (dua tiang + mistar) di garis gawang (+Z).
 * Visual box + cuboid collider (grup WORLD) supaya bola bisa membentur tiang.
 * Deteksi gol (net sensor) menyusul di Fase 6.
 */
const POST = 0.12 // setengah tebal tiang/mistar

export default function Goal() {
  const halfW = GOAL_WIDTH / 2

  return (
    <RigidBody type="fixed" colliders={false} position={[0, 0, GOAL_LINE_Z]}>
      {/* Tiang kiri & kanan */}
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * halfW, GOAL_HEIGHT / 2, 0]}>
          <CuboidCollider
            args={[POST, GOAL_HEIGHT / 2, POST]}
            collisionGroups={COLLISION.world}
          />
          <mesh castShadow>
            <boxGeometry args={[POST * 2, GOAL_HEIGHT, POST * 2]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
        </group>
      ))}

      {/* Mistar atas */}
      <group position={[0, GOAL_HEIGHT, 0]}>
        <CuboidCollider
          args={[halfW + POST, POST, POST]}
          collisionGroups={COLLISION.world}
        />
        <mesh castShadow>
          <boxGeometry args={[GOAL_WIDTH + POST * 2, POST * 2, POST * 2]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      </group>
    </RigidBody>
  )
}
