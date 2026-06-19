import MainScene from './scenes/MainScene'
import ShootPrompt from './ui/ShootPrompt'
import { useShootControls } from './systems/ShootSystem'

export default function App() {
  // Input tembak (Space) — listener global, hanya aktif lewat action shoot().
  useShootControls()

  return (
    <>
      <MainScene />
      {/* Overlay UI di luar Canvas (konvensi #6). */}
      <ShootPrompt />
    </>
  )
}
