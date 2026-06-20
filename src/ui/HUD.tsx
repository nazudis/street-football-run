import { useGameStore } from '../hooks/useGameStore'
import DistanceMeter from './DistanceMeter'

/**
 * HUD — overlay React di atas Canvas (di luar dunia 3D, konvensi #6).
 * Menampilkan jarak ke gawang, badge area tendang, dan tombol restart.
 * Responsive (clamp/flex), tidak menutupi area gameplay tengah.
 */
const panelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 14px',
  borderRadius: 10,
  background: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  font: '600 clamp(13px, 2.6vw, 16px)/1 system-ui, sans-serif',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255,255,255,0.12)',
  pointerEvents: 'none',
  userSelect: 'none',
}

export default function HUD() {
  const inGoalZone = useGameStore((s) => s.inGoalZone)
  const gameState = useGameStore((s) => s.gameState)
  const reset = useGameStore((s) => s.reset)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        padding: 'clamp(10px, 2.5vw, 20px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      {/* Kiri: jarak ke gawang + badge area tendang. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={panelStyle}>
          <span aria-hidden>🥅</span>
          <span style={{ opacity: 0.75 }}>Jarak</span>
          <DistanceMeter />
        </div>
        {inGoalZone && gameState !== 'win' && (
          <div
            style={{
              ...panelStyle,
              background: 'rgba(226, 192, 68, 0.9)',
              color: '#1a1a1a',
              animation: 'hud-pulse 1.1s ease-in-out infinite',
            }}
          >
            AREA TENDANG
          </div>
        )}
      </div>

      {/* Kanan: tombol restart (selalu tersedia). */}
      <button
        onClick={reset}
        style={{
          pointerEvents: 'auto',
          padding: '8px 16px',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.18)',
          cursor: 'pointer',
          color: '#fff',
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          font: '600 clamp(13px, 2.6vw, 16px)/1 system-ui, sans-serif',
        }}
      >
        ↺ Restart
      </button>

      <style>{`
        @keyframes hud-pulse {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
