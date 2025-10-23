import { useState } from 'react'
import './App.css'
import Scene from '../core/engine/scene'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="w-full h-screen bg-gray-900 text-white">
      <Scene />
    </div>
  )
}

export default App
