import { Canvas } from "@react-three/fiber";
import BasicCube from "../entities/basice-cube";
import { Environment, OrbitControls } from "@react-three/drei";

export default function Scene() {
    return (
        <Canvas camera={{ position: [3,3,3], fov:50}}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 5, 2]} intensity={1} />
            <BasicCube />
            <OrbitControls enableDamping />
            <Environment preset="city" />
        </Canvas>
    )
}