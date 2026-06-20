import MainScene from './scenes/MainScene'
import HUD from './ui/HUD'
import LoadingScreen from './ui/LoadingScreen'
import ShootPrompt from './ui/ShootPrompt'
import WinScreen from './ui/WinScreen'
import { useShootControls } from './systems/ShootSystem'

export default function App() {
  // Input tembak (Space) — listener global, hanya aktif lewat action shoot().
  useShootControls()

  return (
    <>
      <MainScene />
      {/* Overlay UI di luar Canvas (konvensi #6). */}
      <HUD />
      <ShootPrompt />
      <WinScreen />
      <LoadingScreen />
    </>
  )
}
