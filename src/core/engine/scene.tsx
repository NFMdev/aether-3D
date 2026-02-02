import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Environment,
    Grid
} from "@react-three/drei";

import {
    EffectComposer,
    Bloom,
    DepthOfField,
    Vignette
} from "@react-three/postprocessing";

import { ENTITY_TYPES } from "../entities/entity-types";
import { SystemGenerator } from "../systems/system-generator";
import { composeWorld } from "../world/world-layout";
import WorldComposer from "../world/world-composer";
import { generateGalaxy } from "../galaxy/galaxy-generator";
import GalaxyView from "../galaxy/galaxy-view";

import EnvironmentReactivity from "./environment-reactivity";
import CameraTransition from "./camera-transition";
import WorldEvolution from "./world-evolution";

import { useWorldStore } from "../../store/use-world-store";
import { useWorldActivity } from "../../store/use-world-activity";

export default function Scene() {
    // Zustand world manager
    const {
        addWorld,
        getActiveWorld,
        worlds,
        setActiveWorld
    } = useWorldStore();

    // Build an initial world once
    const activeWorld = getActiveWorld();

    if (!activeWorld && worlds.length === 0) {
        const systems = [
            SystemGenerator.generate({
                id: "sys-grid",
                name: "Analytics Grid",
                type: "grid",
                entityType: ENTITY_TYPES.donut,
                entityCount: 16,
                spacing: 2.2
            }),
            SystemGenerator.generate({
                id: "sys-tower",
                name: "Ingestion Tower",
                type: "tower",
                entityType: ENTITY_TYPES.cylinder,
                entityCount: 12,
                layers: 3,
                spacing: 1.6
            }),
            SystemGenerator.generate({
                id: "sys-radial",
                name: "Signals Ring",
                type: "radial",
                entityType: ENTITY_TYPES.sphere,
                entityCount: 10,
                radius: 4.5
            })
        ];

        const world = composeWorld(
            { id: "world-1", name: "Aether City Alpha", layout: "grid", spacing: 20 },
            systems
        );

        addWorld(world);
        setActiveWorld(null);
    }

    // Derived state: active world + global activity
    const world = getActiveWorld();
    const activityMap = useWorldActivity();
    const avgActivity =
        Object.values(activityMap).reduce((a, b) => a + b, 0) /
        (Object.keys(activityMap).length || 1);

    // Generate galaxy snapshot from current worlds
    const galaxy = generateGalaxy(
        { id: "galaxy-1", name: "Aether Cluster", orbitRadius: 60 },
        useWorldStore.getState().worlds
    );

    // Scene Composition
    return (
        <Canvas camera={{ position: [0, 50, 100], fov: 55 }}>
            {/* Lights react to global galaxy activity */}
            <ambientLight intensity={0.4 + avgActivity / 200} />
            <directionalLight
                position={[50, 100, 20]}
                intensity={1 + avgActivity / 150}
                color={`hsl(${180 - avgActivity}, 70%, 60%)`}
            />

            {/* Environment logic & evolution */}
            <EnvironmentReactivity />
            <WorldEvolution />
            <CameraTransition />

            {/* Conditional rendering: Galaxy - World */}
            {world ? (
                <WorldComposer world={world} />
            ) : (
                <GalaxyView galaxy={galaxy} />
            )}

            {/* Post-processing */}
            <EffectComposer>
                <Bloom
                    intensity={0.9}
                    luminanceThreshold={0.22}
                    luminanceSmoothing={0.6}
                />
                <DepthOfField
                    focusDistance={0.02}
                    focalLength={0.025}
                    bokehScale={1.4}
                />
                <Vignette eskil={false} offset={0.2} darkness={0.5} />
            </EffectComposer>

            {/* Helpers / Controls */}
            <Grid infiniteGrid cellSize={1} fadeDistance={80} />
            <OrbitControls enableDamping />
            <Environment preset="city" />
        </Canvas>
    );
}
