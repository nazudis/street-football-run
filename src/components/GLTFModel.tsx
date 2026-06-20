import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/**
 * GLTFModel — pembungkus visual model GLB dengan **auto-fit**.
 *
 * Model dari Meshy punya skala & origin yang acak. Komponen ini mengukur
 * bounding box lalu menormalkan: skala ke `fitSize` (pada sumbu `fitAxis`) dan
 * menempatkan anchor (`bottom` = kaki di y=0, `center` = pusat di origin).
 * Dengan begitu collider fisika tetap primitif & konsisten, model hanya visual.
 *
 * Catatan: meng-clone scene supaya aman dipakai banyak instance (mis. gedung).
 */
type Anchor = 'bottom' | 'center'
type FitAxis = 'height' | 'width' | 'depth' | 'max'

interface GLTFModelProps {
  url: string
  /** Ukuran target pada sumbu `fitAxis` (meter). Jika undefined, skala asli. */
  fitSize?: number
  fitAxis?: FitAxis
  anchor?: Anchor
  /** Koreksi arah hadap model (radian). */
  rotationY?: number
}

export default function GLTFModel({
  url,
  fitSize,
  fitAxis = 'height',
  anchor = 'bottom',
  rotationY = 0,
}: GLTFModelProps) {
  const { scene } = useGLTF(url)

  const { object, scale } = useMemo(() => {
    const clone = scene.clone(true)

    // Aktifkan bayangan pada semua mesh.
    clone.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })

    const box = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    let s = 1
    if (fitSize) {
      const dim =
        fitAxis === 'height'
          ? size.y
          : fitAxis === 'width'
            ? size.x
            : fitAxis === 'depth'
              ? size.z
              : Math.max(size.x, size.y, size.z)
      if (dim > 1e-6) s = fitSize / dim
    }

    // Recenter di XZ; anchor menentukan sumbu Y.
    clone.position.x -= center.x
    clone.position.z -= center.z
    clone.position.y -= anchor === 'bottom' ? box.min.y : center.y

    return { object: clone, scale: s }
  }, [scene, fitSize, fitAxis, anchor])

  return (
    <group rotation={[0, rotationY, 0]} scale={scale}>
      <primitive object={object} />
    </group>
  )
}
