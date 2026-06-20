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
  /** Mode "contain": skala uniform agar model muat di dalam kotak [x,y,z]. */
  fitBox?: [number, number, number]
  /** Mode "stretch": skala non-uniform agar model mengisi kotak [x,y,z] persis. */
  stretchBox?: [number, number, number]
  anchor?: Anchor
  /** Koreksi arah hadap model (radian). */
  rotationY?: number
  /** Mesh mengecor bayangan? (matikan untuk objek latar demi performa). */
  castShadow?: boolean
  /** Mesh menerima bayangan? */
  receiveShadow?: boolean
}

export default function GLTFModel({
  url,
  fitSize,
  fitAxis = 'height',
  fitBox,
  stretchBox,
  anchor = 'bottom',
  rotationY = 0,
  castShadow = true,
  receiveShadow = true,
}: GLTFModelProps) {
  const { scene } = useGLTF(url)

  const { object, scale } = useMemo(() => {
    const clone = scene.clone(true)

    // Atur bayangan pada semua mesh.
    clone.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = castShadow
        o.receiveShadow = receiveShadow
      }
    })

    clone.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    const dimScale = (target: number, dim: number) =>
      dim > 1e-6 ? target / dim : 1
    let s: [number, number, number] = [1, 1, 1]
    if (stretchBox) {
      // Isi kotak persis (non-uniform) → gedung penuh tinggi, lebar terkurung.
      s = [
        dimScale(stretchBox[0], size.x),
        dimScale(stretchBox[1], size.y),
        dimScale(stretchBox[2], size.z),
      ]
    } else if (fitBox) {
      // Contain: skala uniform terbesar yang tetap muat di dalam kotak.
      const u = Math.min(
        dimScale(fitBox[0], size.x),
        dimScale(fitBox[1], size.y),
        dimScale(fitBox[2], size.z),
      )
      s = [u, u, u]
    } else if (fitSize) {
      const dim =
        fitAxis === 'height'
          ? size.y
          : fitAxis === 'width'
            ? size.x
            : fitAxis === 'depth'
              ? size.z
              : Math.max(size.x, size.y, size.z)
      const u = fitSize > 0 ? dimScale(fitSize, dim) : 1
      s = [u, u, u]
    }

    // Recenter di XZ; anchor menentukan sumbu Y.
    clone.position.x -= center.x
    clone.position.z -= center.z
    clone.position.y -= anchor === 'bottom' ? box.min.y : center.y

    return { object: clone, scale: s }
  }, [scene, fitSize, fitAxis, fitBox, stretchBox, anchor, castShadow, receiveShadow])

  return (
    <group rotation={[0, rotationY, 0]} scale={scale}>
      <primitive object={object} />
    </group>
  )
}
