import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'
import { MODELS } from '../../assets/loadModels'
import { useGameStore } from '../../hooks/useGameStore'

/** State lokomosi yang dipublikasikan Player tiap frame. */
export type Locomotion = 'Idle' | 'Walk' | 'Run'

interface PlayerModelProps {
  /** Ref state lokomosi (di-update Player di useFrame, non-reaktif). */
  locomotion: MutableRefObject<Locomotion>
  /** Tinggi target model (meter). */
  height?: number
  /** Koreksi arah hadap (radian). */
  rotationY?: number
}

const FADE = 0.2 // durasi cross-fade (detik)

/**
 * PlayerModel — render karakter beranimasi (Mixamo) + state machine animasi.
 *
 * Clip dipetakan dari nama Mixamo via substring (idle/walk/run/kick). Lokomosi
 * (Idle/Walk/Run) dikontrol dari `locomotion` ref; tendangan dipicu dari
 * `isShot` (one-shot, clamp, lalu balik ke lokomosi). Animasi In-Place — posisi
 * tetap diurus fisika (Fase 2), bukan root motion.
 *
 * Catatan: model skinned → JANGAN clone (rusak skinning). Hanya satu instance
 * player, jadi pakai scene langsung; transform fit ditaruh di group pembungkus.
 */
export default function PlayerModel({
  locomotion,
  height = 1.8,
  rotationY = 0,
}: PlayerModelProps) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(MODELS.playerAnimated)
  // Clone skinned scene (SkeletonUtils mempertahankan skinning) supaya tiap
  // mount punya instance sendiri — scene cache tidak dipindah & tidak hilang
  // saat remount (restart via runId).
  const model = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions } = useAnimations(animations, model)
  const isShot = useGameStore((s) => s.isShot)

  // Fit: ukur bbox sekali → skala ke tinggi target & offset anchor (kaki di 0).
  const fit = useMemo(() => {
    model.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(model)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const scale = size.y > 1e-6 ? height / size.y : 1
    return {
      scale,
      offset: [-center.x, -box.min.y, -center.z] as [number, number, number],
    }
  }, [model, height])

  // Bayangan.
  useEffect(() => {
    model.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
  }, [model])

  // Petakan nama clip Mixamo → peran.
  const clip = useMemo(() => {
    const names = Object.keys(actions)
    const find = (kw: string) =>
      names.find((n) => n.toLowerCase().includes(kw))
    return {
      Idle: find('idle'),
      Walk: find('walk'),
      Run: find('run'),
      Kick: find('kick'),
    }
  }, [actions])

  const currentName = useRef<string | undefined>(undefined)
  const kickUntil = useRef(0)

  const fadeTo = (name?: string) => {
    if (!name || currentName.current === name) return
    const next = actions[name]
    if (!next) return
    const prev = currentName.current ? actions[currentName.current] : undefined
    next.reset().fadeIn(FADE).play()
    prev?.fadeOut(FADE)
    currentName.current = name
  }

  // Konfigurasi kick sebagai one-shot.
  useEffect(() => {
    if (clip.Kick && actions[clip.Kick]) {
      actions[clip.Kick]!.setLoop(THREE.LoopOnce, 1)
      actions[clip.Kick]!.clampWhenFinished = true
    }
  }, [actions, clip.Kick])

  // Mulai dari Idle.
  useEffect(() => {
    fadeTo(clip.Idle ?? clip.Walk)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clip.Idle])

  // Picu Kick saat menembak.
  useEffect(() => {
    if (isShot && clip.Kick && actions[clip.Kick]) {
      const a = actions[clip.Kick]!
      a.reset().fadeIn(FADE).play()
      const prev = currentName.current ? actions[currentName.current] : undefined
      if (prev && prev !== a) prev.fadeOut(FADE)
      currentName.current = clip.Kick
      kickUntil.current =
        performance.now() + a.getClip().duration * 1000
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShot])

  useFrame(() => {
    const kicking = performance.now() < kickUntil.current
    if (kicking) return // biarkan kick selesai
    fadeTo(clip[locomotion.current])
  })

  return (
    <group ref={group} rotation={[0, rotationY, 0]} scale={fit.scale}>
      <group position={fit.offset}>
        <primitive object={model} />
      </group>
    </group>
  )
}
