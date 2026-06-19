import * as THREE from 'three'

/**
 * DribbleSystem — helper matematika untuk menggiring bola (mode dribble).
 *
 * Murni fungsi (tanpa React) supaya gampang diuji & dipakai ulang. Komponen
 * Ball memanggil ini tiap frame saat mode dribble.
 */

export const BALL_RADIUS = 0.3
/** Jarak bola di depan player (meter). */
export const DRIBBLE_DISTANCE = 1.0
/**
 * Faktor smoothing posisi (frame-rate independent: alpha = 1 - e^(-k·dt)).
 * Makin kecil makin "tertinggal" saat player belok (lag natural).
 */
export const DRIBBLE_SMOOTH = 9

/**
 * Hitung posisi target bola = posisi player + arah hadap × jarak dribble,
 * dengan tinggi menempel tanah (y = radius). Hasil ditulis ke `out`.
 */
export function computeDribbleTarget(
  playerPos: THREE.Vector3,
  playerForward: THREE.Vector3,
  out: THREE.Vector3,
): THREE.Vector3 {
  out
    .copy(playerForward)
    .setY(0)
    .normalize()
    .multiplyScalar(DRIBBLE_DISTANCE)
    .add(playerPos)
  out.y = BALL_RADIUS
  return out
}

/**
 * Akumulasi rotasi menggelinding (rolling) ke `quat` berdasarkan perpindahan
 * bola di bidang XZ. Sumbu putar = up × arah gerak, sudut = jarak / radius.
 */
export function applyRolling(
  quat: THREE.Quaternion,
  delta: THREE.Vector3,
  axis: THREE.Vector3,
  rollQuat: THREE.Quaternion,
  up: THREE.Vector3,
): void {
  const distance = Math.hypot(delta.x, delta.z)
  if (distance < 1e-5) return
  // Sumbu putar = up × arah gerak (horizontal, tegak lurus arah jalan).
  axis.set(delta.x, 0, delta.z).normalize()
  axis.crossVectors(up, axis).normalize()
  const angle = distance / BALL_RADIUS
  rollQuat.setFromAxisAngle(axis, angle)
  quat.premultiply(rollQuat).normalize()
}
