import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing";
import useMockDataStream from "./use-mock-data-stream";
import { SystemGenerator } from "../systems/system-generator";
import { ENTITY_TYPES } from "../entities/entity-types";
import { composeWorld } from "../world/world-layout";
import CameraController from "./camera-controller";
import WorldComposer from "../world/world-composer";
import EnvironmentReactivity from "./environment-reactivity";

export default function Scene() {
    useMockDataStream();

    // --- Build a few systems
    const sysGrid = SystemGenerator.generate({
        id: "sys-grid",
        name: "Analytics Grid",
        type: "grid",
        entityType: ENTITY_TYPES.donut,
        entityCount: 16,
        spacing: 2.2,
    });

    const sysTower = SystemGenerator.generate({
        id: "sys-tower",
        name: "Ingestion Tower",
        type: "tower",
        entityType: ENTITY_TYPES.cylinder,
        entityCount: 12,
        layers: 3,
        spacing: 1.6,
    });

    const sysRadial = SystemGenerator.generate({
        id: "sys-radial",
        name: "Signals Ring",
        type: "radial",
        entityType: ENTITY_TYPES.sphere,
        entityCount: 10,
        radius: 4.5,
    });

    // --- Compose into a world (ring layout)
    const world = composeWorld(
        { id: "world-1", name: "Aether City Alpha", layout: "ring", radius: 22 },
        [sysGrid, sysTower, sysRadial]
    );

    return (
        <Canvas camera={{ position: [18, 25, 18], fov: 90 }}>
            {/* Lights */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[6, 10, 4]} intensity={1.2} />
            
            <EnvironmentReactivity />

            {/* Camera + World */}
            {/* <CameraController /> */}
            <WorldComposer world={world} />

            {/* FX */}
            <EffectComposer>
                <Bloom intensity={0.9} luminanceThreshold={0.22} luminanceSmoothing={0.6} />
                <DepthOfField focusDistance={0.02} focalLength={0.025} bokehScale={1.4} />
                <Vignette eskil={false} offset={0.2} darkness={0.5} />
            </EffectComposer>

            {/* Ground + Env */}
            <Grid infiniteGrid cellSize={0.5} fadeDistance={25} />
            <OrbitControls enableDamping />
            <Environment preset="city" />
        </Canvas>
    );
}
