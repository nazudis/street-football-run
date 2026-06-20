import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'
import { COLLISION } from '../physics/collisionGroups'
import { useGameStore } from '../hooks/useGameStore'
import '../assets/loadModels'
import City from '../components/City/City'
import Player from '../components/Player/Player'
import Ball from '../components/Ball/Ball'
import GoalZone from '../components/Goal/GoalZone'
import Goal from '../components/Goal/Goal'
import GoalNet from '../components/Goal/GoalNet'
import CameraRig from '../systems/CameraRig'

/**
 * SunLight — directional light yang mengikuti player. Shadow frustum kecil
 * (murah + tajam) tapi tetap menutupi player sepanjang jalan 200m.
 */
function SunLight() {
  const ref = useRef<THREE.DirectionalLight>(null)
  const playerPosition = useGameStore((s) => s.playerPosition)
  useFrame(() => {
    const l = ref.current
    if (!l) return
    l.position.set(
      playerPosition.x + 10,
      playerPosition.y + 20,
      playerPosition.z + 5,
    )
    l.target.position.copy(playerPosition)
    l.target.updateMatrixWorld()
  })
  return (
    <directionalLight
      ref={ref}
      intensity={1.4}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-left={-20}
      shadow-camera-right={20}
      shadow-camera-top={20}
      shadow-camera-bottom={-20}
      shadow-camera-near={0.5}
      shadow-camera-far={70}
    />
  )
}

/**
 * MainScene — dunia 3D (Fase 2).
 * Physics (Rapier), ground fixed, kota, player + kamera follow.
 * Konvensi: arah lari = +Z.
 */
export default function MainScene() {
  // Naik tiap reset → remount Player & Ball ke kondisi spawn.
  const runId = useGameStore((s) => s.runId)

  return (
    <Canvas
      shadows
      // Batasi pixel ratio (hindari render 2×/4× piksel di layar retina → FPS).
      dpr={[1, 1.5]}
      gl={{ powerPreference: 'high-performance', antialias: true }}
      camera={{ position: [0, 6, -9], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#1a1a20']} />
      <fog attach="fog" args={['#1a1a20', 60, 220]} />

      {/* Pencahayaan */}
      <ambientLight intensity={0.5} />
      <SunLight />

      <Physics gravity={[0, -9.81, 0]}>
       <Suspense fallback={null}>
        {/* Ground: RigidBody fixed + cuboid collider tipis. */}
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider
            args={[100, 0.5, 160]}
            position={[0, -0.5, 100]}
            collisionGroups={COLLISION.world}
          />
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 100]}
            receiveShadow
          >
            <planeGeometry args={[200, 320]} />
            <meshStandardMaterial color="#3a3f36" />
          </mesh>
        </RigidBody>

        {/* Kota: jalan + gedung (visual saja untuk sekarang). */}
        <City />

        {/* Area goal (sensor pemicu prompt tembak) + rangka gawang + jaring/sensor gol. */}
        <GoalZone />
        <Goal />
        <GoalNet />

        {/* Player + bola (key=runId → remount bersih saat restart) + kamera follow. */}
        <Player key={`player-${runId}`} />
        <Ball key={`ball-${runId}`} />
        <CameraRig />
       </Suspense>
      </Physics>
    </Canvas>
  )
}
