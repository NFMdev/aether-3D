import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import EntityManager from "../entities/entity-manager";
import useMockDataStream from "./use-mock-data-stream";

export default function Scene() {
    useMockDataStream();
    return (
        <Canvas camera={{ position: [3,3,3], fov:90}}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 5, 2]} intensity={1} />
            <EntityManager />
            <OrbitControls enableDamping />
            <Environment preset="city" />
        </Canvas>
    );
}