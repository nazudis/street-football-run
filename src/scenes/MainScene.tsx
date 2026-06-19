import { Canvas } from '@react-three/fiber'
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier'
import { COLLISION } from '../physics/collisionGroups'
import City from '../components/City/City'
import Player from '../components/Player/Player'
import Ball from '../components/Ball/Ball'
import GoalZone from '../components/Goal/GoalZone'
import Goal from '../components/Goal/Goal'
import CameraRig from '../systems/CameraRig'

/**
 * MainScene — dunia 3D (Fase 2).
 * Physics (Rapier), ground fixed, kota, player + kamera follow.
 * Konvensi: arah lari = +Z.
 */
export default function MainScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 6, -9], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#1a1a20']} />
      <fog attach="fog" args={['#1a1a20', 60, 220]} />

      {/* Pencahayaan */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 5]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
      />

      <Physics gravity={[0, -9.81, 0]}>
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

        {/* Area goal (sensor pemicu prompt tembak) + rangka gawang. */}
        <GoalZone />
        <Goal />

        {/* Player + bola + kamera follow. */}
        <Player />
        <Ball />
        <CameraRig />
      </Physics>
    </Canvas>
  )
}
