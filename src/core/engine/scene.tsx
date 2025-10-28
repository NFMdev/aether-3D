import { Canvas } from "@react-three/fiber";
import { Environment, Grid, OrbitControls } from "@react-three/drei";
import EntityManager from "../entities/entity-manager";
import CameraController from "./camera-controller";
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import useDynamicBloom from "./use-dynamic-bloom";
import useMockDataStream from "./use-mock-data-stream";
import useEnvironmentReactivity from "./use-environment-reactivity";
import BloomController from "./bloom-controller";

export default function Scene() {

    return (
        <Canvas
            camera={{ position: [8,5,8], fov:90}}
        >
            <ambientLight intensity={0.4} />
            <directionalLight position={[2, 5, 2]} intensity={1.2} />
            
            <CameraController />
            <EntityManager />

            <EffectComposer>
                <BloomController />
                <DepthOfField
                    focusDistance={0.02}
                    focalLength={0.025}
                    bokehScale={1.5}
                />
                <Vignette
                    eskil={false}
                    offset={0.2}
                    darkness={0.5}
                    blendFunction={BlendFunction.NORMAL}
                />
            </EffectComposer>

            <Grid infiniteGrid cellSize={0.5} fadeDistance={25} />
            <OrbitControls enableDamping />
            <Environment preset="city" />
        </Canvas>
    );
}
