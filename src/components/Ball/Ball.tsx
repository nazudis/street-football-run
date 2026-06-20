import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, BallCollider, type RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useGameStore } from '../../hooks/useGameStore'
import { COLLISION } from '../../physics/collisionGroups'
import GLTFModel from '../GLTFModel'
import { MODELS } from '../../assets/loadModels'
import {
  BALL_RADIUS,
  DRIBBLE_SMOOTH,
  computeDribbleTarget,
  applyRolling,
} from '../../systems/DribbleSystem'
import { computeShotVelocity, KICK_CONTACT_DELAY } from '../../systems/ShootSystem'
import { playOneShot } from '../../systems/AudioSystem'

// Rapier RigidBodyType.Dynamic === 0.
const DYNAMIC = 0

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

  // `released` = bola benar-benar dilepas (setelah momen kontak kaki).
  // Bola tetap menempel di kaki (kinematic) selama wind-up animasi tendang.
  const [released, setReleased] = useState(false)

  // State posisi/rotasi bola (untuk mode kinematic).
  const pos = useRef(new THREE.Vector3(...SPAWN))
  const quat = useRef(new THREE.Quaternion())

  // Impulse tendangan sudah diberikan?
  const impulseApplied = useRef(false)
  const shotVel = useRef(new THREE.Vector3())

  // Vektor kerja.
  const target = useRef(new THREE.Vector3())
  const prevPos = useRef(new THREE.Vector3(...SPAWN))
  const moveDelta = useRef(new THREE.Vector3())
  const axis = useRef(new THREE.Vector3())
  const rollQuat = useRef(new THREE.Quaternion())
  const up = useRef(new THREE.Vector3(0, 1, 0))

  // Saat menembak: tunda pelepasan bola sampai momen kontak kaki (animasi).
  useEffect(() => {
    if (!isShot) return
    const id = window.setTimeout(
      () => setReleased(true),
      KICK_CONTACT_DELAY * 1000,
    )
    return () => window.clearTimeout(id)
  }, [isShot])

  useFrame((_, delta) => {
    if (!body.current) return

    if (released) {
      // Beri impulse sekali, setelah Rapier benar-benar mengubah body ke dynamic.
      if (!impulseApplied.current && body.current.bodyType() === DYNAMIC) {
        const t = body.current.translation()
        computeShotVelocity(t, shotVel.current)
        const mass = body.current.mass() || 1
        body.current.wakeUp()
        body.current.applyImpulse(
          {
            x: shotVel.current.x * mass,
            y: shotVel.current.y * mass,
            z: shotVel.current.z * mass,
          },
          true,
        )
        impulseApplied.current = true
        playOneShot('kick')
      }
      return // mode shot → fisika Rapier yang pegang
    }

    // Mode dribble — termasuk selama wind-up tendangan (bola menempel di kaki).
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
      type={released ? 'dynamic' : 'kinematicPosition'}
      ccd
      userData={{ type: 'ball' }}
    >
      <BallCollider
        args={[BALL_RADIUS]}
        collisionGroups={COLLISION.ball}
        restitution={0.25}
        friction={0.7}
      />
      <GLTFModel
        url={MODELS.ball}
        fitSize={BALL_RADIUS * 2}
        fitAxis="max"
        anchor="center"
      />
    </RigidBody>
  )
}
