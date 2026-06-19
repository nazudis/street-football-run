import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CapsuleCollider, type RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useKeyboardControls } from '../../hooks/useKeyboardControls'
import { useGameStore } from '../../hooks/useGameStore'
import { COLLISION } from '../../physics/collisionGroups'

const WALK_SPEED = 4
const RUN_SPEED = 8
const TURN_LERP = 12 // kecepatan player menghadap arah gerak

// Geometri collider capsule: total tinggi = 2*halfHeight + 2*radius = 1.8 m.
const RADIUS = 0.4
const HALF_HEIGHT = 0.5
const SPAWN: [number, number, number] = [0, 1.2, 0]

/**
 * Player — third-person character controller (placeholder capsule).
 *
 * RigidBody dinamis + CapsuleCollider, rotasi dikunci agar tidak terguling.
 * Gerak berbasis velocity di bidang XZ, relatif arah kamera; komponen Y
 * dibiarkan agar gravitasi tetap jalan. Visual capsule menghadap arah gerak.
 */
export default function Player() {
  const body = useRef<RapierRigidBody>(null)
  const visual = useRef<THREE.Group>(null)
  const input = useKeyboardControls()
  const camera = useThree((s) => s.camera)
  const playerPosition = useGameStore((s) => s.playerPosition)
  const playerForward = useGameStore((s) => s.playerForward)

  // Vektor kerja (dialokasi sekali, dipakai ulang tiap frame).
  const forwardDir = useRef(new THREE.Vector3())
  const rightDir = useRef(new THREE.Vector3())
  const moveDir = useRef(new THREE.Vector3())
  const up = useRef(new THREE.Vector3(0, 1, 0))

  useFrame((_, delta) => {
    if (!body.current) return

    // Freeze gerakan saat menang: rem horizontal, biarkan gravitasi.
    if (useGameStore.getState().gameState === 'win') {
      const v = body.current.linvel()
      body.current.setLinvel({ x: 0, y: v.y, z: 0 }, true)
      return
    }

    const { forward, backward, left, right, sprint } = input.current

    // Arah relatif kamera, diproyeksikan ke bidang XZ.
    camera.getWorldDirection(forwardDir.current)
    forwardDir.current.y = 0
    forwardDir.current.normalize()
    // right = forward × up (sehingga D = kanan layar).
    rightDir.current.crossVectors(forwardDir.current, up.current).normalize()

    const fwd = (forward ? 1 : 0) - (backward ? 1 : 0)
    const str = (right ? 1 : 0) - (left ? 1 : 0)

    moveDir.current
      .set(0, 0, 0)
      .addScaledVector(forwardDir.current, fwd)
      .addScaledVector(rightDir.current, str)

    const speed = sprint ? RUN_SPEED : WALK_SPEED
    const linvel = body.current.linvel()

    if (moveDir.current.lengthSq() > 0) {
      moveDir.current.normalize().multiplyScalar(speed)
      body.current.setLinvel(
        { x: moveDir.current.x, y: linvel.y, z: moveDir.current.z },
        true,
      )

      // Hadapkan visual ke arah gerak secara halus.
      if (visual.current) {
        const targetAngle = Math.atan2(moveDir.current.x, moveDir.current.z)
        const current = visual.current.rotation.y
        let diff = targetAngle - current
        // Normalisasi selisih ke (-PI, PI].
        diff = Math.atan2(Math.sin(diff), Math.cos(diff))
        visual.current.rotation.y = current + diff * Math.min(1, TURN_LERP * delta)
      }
    } else {
      // Tidak ada input → rem horizontal, biarkan Y (gravitasi).
      body.current.setLinvel({ x: 0, y: linvel.y, z: 0 }, true)
    }

    // Publikasikan posisi player ke store (live, non-reaktif).
    const t = body.current.translation()
    playerPosition.set(t.x, t.y, t.z)

    // Publikasikan arah hadap (dari rotasi visual) untuk dribble bola.
    if (visual.current) {
      const a = visual.current.rotation.y
      playerForward.set(Math.sin(a), 0, Math.cos(a))
    }
  })

  return (
    <RigidBody
      ref={body}
      position={SPAWN}
      colliders={false}
      enabledRotations={[false, false, false]}
      canSleep={false}
      userData={{ type: 'player' }}
    >
      <CapsuleCollider args={[HALF_HEIGHT, RADIUS]} collisionGroups={COLLISION.player} />
      <group ref={visual}>
        {/* Badan capsule placeholder. */}
        <mesh castShadow>
          <capsuleGeometry args={[RADIUS, HALF_HEIGHT * 2, 8, 16]} />
          <meshStandardMaterial color="#e84d3d" />
        </mesh>
        {/* Penanda arah hadap (hidung) di sisi +Z lokal. */}
        <mesh position={[0, 0.2, RADIUS + 0.05]} castShadow>
          <boxGeometry args={[0.18, 0.18, 0.25]} />
          <meshStandardMaterial color="#f4d03f" />
        </mesh>
      </group>
    </RigidBody>
  )
}
