import { useGameStore } from '../hooks/useGameStore'

/**
 * WinScreen — overlay DOM saat menang (konvensi #6).
 * Teks "GOAL!" + tombol Restart (memanggil `reset()` → remount via runId).
 */
export default function WinScreen() {
  const gameState = useGameStore((s) => s.gameState)
  const reset = useGameStore((s) => s.reset)

  if (gameState !== 'win') return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        background: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(3px)',
        zIndex: 10,
      }}
    >
      <h1
        style={{
          margin: 0,
          font: '800 96px/1 system-ui, sans-serif',
          letterSpacing: 2,
          color: '#f4d03f',
          textShadow: '0 6px 30px rgba(244,208,63,0.45)',
          animation: 'goal-pop 0.5s cubic-bezier(.2,1.4,.5,1) both',
        }}
      >
        GOAL!
      </h1>
      <button
        onClick={reset}
        style={{
          padding: '14px 36px',
          borderRadius: 12,
          border: 'none',
          cursor: 'pointer',
          font: '700 20px/1 system-ui, sans-serif',
          color: '#111',
          background: '#fff',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        }}
      >
        Restart
      </button>
      <style>{`
        @keyframes goal-pop {
          0% { transform: scale(0.4); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
