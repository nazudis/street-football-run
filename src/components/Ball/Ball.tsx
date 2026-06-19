import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, BallCollider, type RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useGameStore } from '../../hooks/useGameStore'
import {
  BALL_RADIUS,
  DRIBBLE_SMOOTH,
  computeDribbleTarget,
  applyRolling,
} from '../../systems/DribbleSystem'

/**
 * Ball — bola dengan 2 mode (lihat AGENTS.md #4):
 *  - `dribble`  : RigidBody kinematicPosition, posisi diset manual mengikuti
 *                 player (lerp) + efek menggelinding. (Fase 3, sekarang)
 *  - `shot`     : RigidBody dynamic, kena impulse. (Fase 5)
 *
 * Mode dipilih dari `isShot` di store. Transisi kinematic↔dynamic dilakukan
 * dengan mengganti `type` RigidBody; saat shot, Rapier mengambil alih fisika.
 */
const SPAWN: [number, number, number] = [0, BALL_RADIUS, 1.0]

export default function Ball() {
  const body = useRef<RapierRigidBody>(null)
  const isShot = useGameStore((s) => s.isShot)
  const playerPosition = useGameStore((s) => s.playerPosition)
  const playerForward = useGameStore((s) => s.playerForward)

  // State posisi/rotasi bola (untuk mode kinematic).
  const pos = useRef(new THREE.Vector3(...SPAWN))
  const quat = useRef(new THREE.Quaternion())

  // Vektor kerja.
  const target = useRef(new THREE.Vector3())
  const prevPos = useRef(new THREE.Vector3(...SPAWN))
  const moveDelta = useRef(new THREE.Vector3())
  const axis = useRef(new THREE.Vector3())
  const rollQuat = useRef(new THREE.Quaternion())
  const up = useRef(new THREE.Vector3(0, 1, 0))

  useFrame((_, delta) => {
    if (!body.current || isShot) return // mode shot → fisika Rapier yang pegang

    // Target di depan player, lalu lerp (smoothing frame-rate independent).
    computeDribbleTarget(playerPosition, playerForward, target.current)
    const alpha = 1 - Math.exp(-DRIBBLE_SMOOTH * delta)

    prevPos.current.copy(pos.current)
    pos.current.lerp(target.current, alpha)

    // Efek menggelinding berdasarkan perpindahan aktual.
    moveDelta.current.subVectors(pos.current, prevPos.current)
    applyRolling(
      quat.current,
      moveDelta.current,
      axis.current,
      rollQuat.current,
      up.current,
    )

    body.current.setNextKinematicTranslation(pos.current)
    body.current.setNextKinematicRotation(quat.current)
  })

  return (
    <RigidBody
      ref={body}
      position={SPAWN}
      colliders={false}
      type={isShot ? 'dynamic' : 'kinematicPosition'}
      ccd
      userData={{ type: 'ball' }}
    >
      <BallCollider args={[BALL_RADIUS]} />
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[BALL_RADIUS, 24, 24]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.5} />
      </mesh>
      {/* Tanda agar putaran menggelinding terlihat. */}
      <mesh castShadow>
        <sphereGeometry args={[BALL_RADIUS * 1.01, 8, 6]} />
        <meshStandardMaterial color="#222" wireframe />
      </mesh>
    </RigidBody>
  )
}
