import { useEffect, useState } from 'react'
import './App.css'
import Scene from '../core/engine/scene'
import { useEntitiesStore } from '../store/use-entities-store'

function App() {
  const addEntity = useEntitiesStore((s) => s.addEntity);

  useEffect(() => {
    addEntity({
      id: "cube-1",
      name: "CPU",
      type: "cube",
      value: 10,
      color: "#4f46e5",
      position: [0, 1, 0],
    });
    addEntity({
      id: "cube-2",
      name: "Memory",
      type: "cube",
      value: 20,
      color: "#22c55e",
      position: [2, 1, 0],
    });
  }, [addEntity]);

  return (
    <div className="w-full h-screen bg-gray-900 text-white">
      <Scene />
    </div>
  )
}

export default App
