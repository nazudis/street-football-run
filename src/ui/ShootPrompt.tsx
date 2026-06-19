import { useGameStore } from '../hooks/useGameStore'

/**
 * ShootPrompt — overlay DOM (di luar Canvas, konvensi #6).
 * Muncul saat player berada di goal zone: "Press Space to Shoot".
 */
export default function ShootPrompt() {
  const inGoalZone = useGameStore((s) => s.inGoalZone)
  const gameState = useGameStore((s) => s.gameState)
  if (!inGoalZone || gameState === 'win') return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '12px 24px',
        borderRadius: 12,
        background: 'rgba(0, 0, 0, 0.6)',
        color: '#fff',
        font: '600 18px/1 system-ui, sans-serif',
        letterSpacing: 0.3,
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.15)',
        userSelect: 'none',
        pointerEvents: 'none',
        animation: 'shoot-pulse 1.1s ease-in-out infinite',
      }}
    >
      Press{' '}
      <kbd
        style={{
          padding: '2px 8px',
          margin: '0 4px',
          borderRadius: 6,
          background: '#fff',
          color: '#111',
          fontWeight: 700,
        }}
      >
        Space
      </kbd>{' '}
      to Shoot
      <style>{`
        @keyframes shoot-pulse {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
