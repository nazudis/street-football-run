import { useMemo } from 'react'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { generateBuildings, type CityLayoutParams } from './buildingLayout'
import { COLLISION } from '../../physics/collisionGroups'
import GLTFModel from '../GLTFModel'
import { MODELS } from '../../assets/loadModels'

/**
 * City — lingkungan kota: jalan aspal (+Z) + gedung model GLB berjajar
 * kiri-kanan (varian deterministik). Collider gedung = cuboid primitif (WORLD),
 * bukan trimesh model. Logika penempatan ada di `buildingLayout.ts`.
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

      {/* Trotoar kiri-kanan. */}
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

      {/* Gedung: model GLB + collider cuboid primitif. */}
      {buildings.map((b, i) => {
        const [x, , z] = b.position
        const [w, h, d] = b.size
        return (
          <group key={i}>
            <RigidBody type="fixed" colliders={false} position={[x, 0, z]}>
              <CuboidCollider
                args={[w / 2, h / 2, d / 2]}
                position={[0, h / 2, 0]}
                collisionGroups={COLLISION.world}
              />
            </RigidBody>
            <group position={[x, 0, z]}>
              <GLTFModel
                url={MODELS.buildings[b.variant]}
                fitBox={[w, h, d]}
                anchor="bottom"
                rotationY={b.rotationY}
              />
            </group>
          </group>
        )
      })}
    </group>
  )
}
