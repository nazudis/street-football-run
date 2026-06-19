import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../hooks/useGameStore'

/**
 * CameraRig — kamera third-person follow.
 *
 * Mengikuti player dari belakang (offset world-fixed: di belakang -Z & sedikit
 * di atas) lalu melihat ke arah player. Posisi & target di-lerp tiap frame
 * (frame-rate independent) supaya halus.
 */
// Offset world-space: arah lari = +Z, jadi "belakang" = -Z.
const OFFSET = new THREE.Vector3(0, 6, -9)
const LOOK_HEIGHT = 1.2 // lihat sedikit di atas kaki player
const POS_SMOOTH = 6 // makin besar makin "ketat"
const LOOK_SMOOTH = 10

export default function CameraRig() {
  const camera = useThree((s) => s.camera)
  const playerPosition = useGameStore((s) => s.playerPosition)

  const desiredPos = useRef(new THREE.Vector3())
  const lookTarget = useRef(new THREE.Vector3())
  const currentLook = useRef(new THREE.Vector3(0, LOOK_HEIGHT, 0))

  useFrame((_, delta) => {
    desiredPos.current.copy(playerPosition).add(OFFSET)
    lookTarget.current.copy(playerPosition).setY(playerPosition.y + LOOK_HEIGHT)

    // Faktor lerp frame-rate independent.
    const posAlpha = 1 - Math.exp(-POS_SMOOTH * delta)
    const lookAlpha = 1 - Math.exp(-LOOK_SMOOTH * delta)

    camera.position.lerp(desiredPos.current, posAlpha)
    currentLook.current.lerp(lookTarget.current, lookAlpha)
    camera.lookAt(currentLook.current)
  })

  return null
}
