import MainScene from './scenes/MainScene'
import ShootPrompt from './ui/ShootPrompt'

export default function App() {
  return (
    <>
      <MainScene />
      {/* Overlay UI di luar Canvas (konvensi #6). */}
      <ShootPrompt />
    </>
  )
}
