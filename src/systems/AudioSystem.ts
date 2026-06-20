/**
 * AudioSystem — manajer SFX sederhana (HTMLAudioElement).
 *
 * - `footstep` : loop selama bergerak (rate naik saat lari), pause saat diam.
 * - `kick`/`goal` : one-shot (clone node agar boleh tumpang-tindih).
 *
 * Browser memblokir audio sebelum interaksi user; semua `play()` di-guard
 * (catch) dan footstep baru benar-benar bunyi setelah gesture pertama (mis.
 * tekan WASD). Volume master + mute disediakan.
 */
type OneShot = 'kick' | 'goal'

const SRC = {
  footstep: '/audio/footstep.mp3',
  kick: '/audio/kick.mp3',
  goal: '/audio/goal.mp3',
} as const

const VOLUME = {
  footstep: 0.35,
  kick: 0.7,
  goal: 0.9,
} as const

let master = 1
let muted = false

const footstep = new Audio(SRC.footstep)
footstep.loop = true
footstep.preload = 'auto'

// Elemen dasar one-shot (di-clone saat dimainkan).
const base: Record<OneShot, HTMLAudioElement> = {
  kick: new Audio(SRC.kick),
  goal: new Audio(SRC.goal),
}
base.kick.preload = 'auto'
base.goal.preload = 'auto'

export function setMuted(m: boolean): void {
  muted = m
  if (m) footstep.pause()
}

export function isMuted(): boolean {
  return muted
}

export function setMasterVolume(v: number): void {
  master = Math.max(0, Math.min(1, v))
}

/** Mainkan SFX sekali (boleh tumpang-tindih). */
export function playOneShot(name: OneShot): void {
  if (muted) return
  const node = base[name].cloneNode() as HTMLAudioElement
  node.volume = VOLUME[name] * master
  node.play().catch(() => {})
}

/**
 * Kontrol loop langkah kaki. `active` saat player bergerak; `rate` mempercepat
 * (mis. 1.0 walk, ~1.5 run). Idempoten — aman dipanggil tiap frame.
 */
export function setFootstep(active: boolean, rate = 1): void {
  if (muted || !active) {
    if (!footstep.paused) footstep.pause()
    return
  }
  footstep.volume = VOLUME.footstep * master
  footstep.playbackRate = rate
  if (footstep.paused) footstep.play().catch(() => {})
}
