import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

/**
 * MainScene — dunia 3D dasar (Fase 0).
 * Lantai, pencahayaan, kamera orbit. Konvensi: arah lari = +Z.
 */
export default function MainScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [10, 10, 10], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Pencahayaan */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Lantai 100x100 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#8a8a8a" />
      </mesh>

      {/* Kontrol kamera */}
      <OrbitControls makeDefault />
    </Canvas>
  )
}
