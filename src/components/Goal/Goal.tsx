import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { COLLISION } from '../../physics/collisionGroups'
import { GOAL_LINE_Z, GOAL_WIDTH, GOAL_HEIGHT } from './goalConfig'
import GLTFModel from '../GLTFModel'
import { MODELS } from '../../assets/loadModels'

/**
 * Goal — gawang. Visual = model GLB; collider TETAP primitif (tiang + mistar
 * cuboid, grup WORLD) supaya bola membentur rangka. Sensor gol ada di GoalNet.
 *
 * `GOAL_FACING` mengoreksi arah hadap model bila mulut gawang menghadap salah
 * (mulut harus terbuka ke -Z, arah datangnya player).
 */
const POST = 0.12 // setengah tebal tiang/mistar
const GOAL_FACING = Math.PI // radian; mulut gawang menghadap -Z (arah player)

export default function Goal() {
  const halfW = GOAL_WIDTH / 2

  return (
    <group position={[0, 0, GOAL_LINE_Z]}>
      {/* Visual model gawang (fit selebar mulut gawang). */}
      <GLTFModel
        url={MODELS.goal}
        fitSize={GOAL_WIDTH}
        fitAxis="width"
        anchor="bottom"
        rotationY={GOAL_FACING}
      />

      {/* Collider rangka (primitif). */}
      <RigidBody type="fixed" colliders={false}>
        {([-1, 1] as const).map((side) => (
          <CuboidCollider
            key={side}
            args={[POST, GOAL_HEIGHT / 2, POST]}
            position={[side * halfW, GOAL_HEIGHT / 2, 0]}
            collisionGroups={COLLISION.world}
          />
        ))}
        <CuboidCollider
          args={[halfW + POST, POST, POST]}
          position={[0, GOAL_HEIGHT, 0]}
          collisionGroups={COLLISION.world}
        />
      </RigidBody>
    </group>
  )
}
