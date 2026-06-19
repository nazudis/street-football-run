import { useMemo } from 'react'
import { generateBuildings, type CityLayoutParams } from './buildingLayout'

/**
 * City — lingkungan kota: jalan lurus (aspal) + gedung placeholder (box)
 * berjajar kiri-kanan. Konvensi: arah lari = +Z.
 *
 * Placeholder box dipakai sampai Fase 7 (asset GLB). Logika penempatan ada
 * di `buildingLayout.ts` supaya gampang diganti model nanti.
 */
export interface CityProps extends Partial<CityLayoutParams> {}

export default function City({
  roadLength = 200,
  roadWidth = 8,
  buildingSpacing = 12,
  sidewalk = 1.5,
  seed = 1337,
}: CityProps) {
  const buildings = useMemo(
    () => generateBuildings({ roadLength, roadWidth, buildingSpacing, sidewalk, seed }),
    [roadLength, roadWidth, buildingSpacing, sidewalk, seed],
  )

  return (
    <group>
      {/* Jalan utama: membentang dari z=0 ke +Z (arah lari). */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, roadLength / 2]}
        receiveShadow
      >
        <planeGeometry args={[roadWidth, roadLength]} />
        <meshStandardMaterial color="#2b2b30" />
      </mesh>

      {/* Trotoar kiri-kanan (sedikit lebih terang dari aspal). */}
      {([-1, 1] as const).map((side) => (
        <mesh
          key={`sidewalk-${side}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[side * (roadWidth / 2 + sidewalk / 2), 0.02, roadLength / 2]}
          receiveShadow
        >
          <planeGeometry args={[sidewalk, roadLength]} />
          <meshStandardMaterial color="#4a4a50" />
        </mesh>
      ))}

      {/* Gedung placeholder. */}
      {buildings.map((b, i) => (
        <mesh key={i} position={b.position} castShadow receiveShadow>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color={b.color} />
        </mesh>
      ))}
    </group>
  )
}
