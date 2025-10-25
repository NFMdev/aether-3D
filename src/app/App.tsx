import './App.css';
import Scene from '../core/engine/scene';
import ControlPanel from '../ui/control-panel';

function App() {

  return (
    <div className="w-full h-screen bg-gray-900 text-white">
      <Scene />
      <ControlPanel />
    </div>
  )
}

export default App
