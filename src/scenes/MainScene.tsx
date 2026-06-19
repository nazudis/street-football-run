import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import City from '../components/City/City'

/**
 * MainScene — dunia 3D (Fase 1).
 * Ground dasar, pencahayaan, kota (jalan + gedung), kamera orbit.
 * Konvensi: arah lari = +Z.
 */
export default function MainScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [16, 12, -8], fov: 50 }}
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

      {/* Ground dasar (tanah) di bawah jalan & gedung. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 100]} receiveShadow>
        <planeGeometry args={[200, 320]} />
        <meshStandardMaterial color="#3a3f36" />
      </mesh>

      {/* Kota: jalan + gedung */}
      <City />

      {/* Kontrol kamera (sementara untuk inspeksi sampai ada follow-camera). */}
      <OrbitControls makeDefault target={[0, 2, 24]} />
    </Canvas>
  )
}
