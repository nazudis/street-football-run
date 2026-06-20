import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'

/**
 * LoadingScreen — overlay DOM saat aset (GLB/audio) sedang diunduh.
 * Memakai `useProgress` (drei) yang melacak THREE DefaultLoadingManager.
 * Fade-out setelah selesai; ada safety timeout supaya tidak nyangkut.
 */
export default function LoadingScreen() {
  const { active, progress, loaded } = useProgress()
  const [hidden, setHidden] = useState(false)
  const [fading, setFading] = useState(false)

  // Selesai memuat → fade lalu sembunyikan.
  useEffect(() => {
    if (!active && loaded > 0 && progress >= 100) {
      setFading(true)
      const t = setTimeout(() => setHidden(true), 600)
      return () => clearTimeout(t)
    }
  }, [active, loaded, progress])

  // Safety: jangan biarkan loader nyangkut selamanya.
  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 20000)
    return () => clearTimeout(t)
  }, [])

  if (hidden) return null

  const pct = Math.min(100, Math.round(progress))

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        background: 'radial-gradient(circle at 50% 40%, #232532 0%, #121319 70%)',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.6s ease',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          fontSize: 56,
          animation: 'ls-bounce 0.9s ease-in-out infinite',
        }}
        aria-hidden
      >
        ⚽
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ font: '800 clamp(20px, 5vw, 30px)/1.1 system-ui', letterSpacing: 1 }}>
          STREET FOOTBALL RUN
        </div>
        <div style={{ marginTop: 8, opacity: 0.65, font: '500 14px/1 system-ui' }}>
          Memuat aset… {pct}%
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 'min(320px, 70vw)',
          height: 8,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.12)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 999,
            background: 'linear-gradient(90deg, #e2c044, #f4d03f)',
            transition: 'width 0.25s ease',
          }}
        />
      </div>

      <style>{`
        @keyframes ls-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  )
}
