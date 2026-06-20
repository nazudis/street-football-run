import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useRapier } from '@react-three/rapier'
import * as THREE from 'three'
import { useGameStore } from '../hooks/useGameStore'
import { COLLISION } from '../physics/collisionGroups'

/**
 * CameraRig — kamera third-person follow yang lebih sinematik.
 *
 * - Posisi & lookAt di-lerp dengan damping frame-rate independent (sedikit lag
 *   natural saat player berakselerasi/berbelok).
 * - Camera collision: raycast (Rapier) dari player ke posisi kamera; bila ada
 *   gedung/gawang di antara, kamera didekatkan supaya tidak menembus tembok.
 */
const OFFSET = new THREE.Vector3(0, 6, -9) // belakang (-Z) & sedikit di atas
const LOOK_HEIGHT = 1.2
const POS_SMOOTH = 6
const LOOK_SMOOTH = 10
const MIN_DIST = 1.5 // jarak minimum supaya kamera tak nempel ke kepala
const WALL_MARGIN = 0.3

export default function CameraRig() {
  const camera = useThree((s) => s.camera)
  const playerPosition = useGameStore((s) => s.playerPosition)
  const { rapier, world } = useRapier()

  const desiredPos = useRef(new THREE.Vector3())
  const lookTarget = useRef(new THREE.Vector3())
  const currentLook = useRef(new THREE.Vector3(0, LOOK_HEIGHT, 0))
  const rayDir = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    desiredPos.current.copy(playerPosition).add(OFFSET)
    lookTarget.current.copy(playerPosition).setY(playerPosition.y + LOOK_HEIGHT)

    // Camera collision: ray dari look target ke kamera; clamp bila kena WORLD.
    rayDir.current.subVectors(desiredPos.current, lookTarget.current)
    const maxDist = rayDir.current.length()
    if (maxDist > 1e-3) {
      rayDir.current.divideScalar(maxDist) // normalize
      const ray = new rapier.Ray(lookTarget.current, rayDir.current)
      const hit = world.castRay(
        ray,
        maxDist,
        true,
        undefined,
        COLLISION.cameraRay,
      )
      if (hit) {
        const d = Math.max(MIN_DIST, hit.timeOfImpact - WALL_MARGIN)
        desiredPos.current
          .copy(lookTarget.current)
          .addScaledVector(rayDir.current, d)
      }
    }

    const posAlpha = 1 - Math.exp(-POS_SMOOTH * delta)
    const lookAlpha = 1 - Math.exp(-LOOK_SMOOTH * delta)

    camera.position.lerp(desiredPos.current, posAlpha)
    currentLook.current.lerp(lookTarget.current, lookAlpha)
    camera.lookAt(currentLook.current)
  })

  return null
}
