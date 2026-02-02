import { useFrame } from "@react-three/fiber";
import { useWorldStore } from "../../store/use-world-store";
import type { GeneratedGalaxy } from "./types";
import * as THREE from 'three';
import WorldComposer from "../world/world-composer";
import { useWorldActivity } from "../../store/use-world-activity";

interface Props {
    galaxy: GeneratedGalaxy;
}

export default function GalaxyView({ galaxy }: Props) {
    const setActiveWorld = useWorldStore((s) => s.setActiveWorld);
    const activityMap = useWorldActivity();

    useFrame((_, delta) => {
        galaxy.worlds.forEach((gw) => {
            const r = new THREE.Vector3(...gw.position);
            const angle = gw.orbitSpeed * delta * 60;
            const rotated = new THREE.Vector3(
                r.x * Math.cos(angle) - r.z * Math.sin(angle),
                r.y,
                r.x * Math.sin(angle) - r.z * Math.cos(angle)
            );
            gw.position = [rotated.x, rotated.y, rotated.z];
        });
    });

    return (
        <group name={galaxy.name}>
            {galaxy.worlds.map(({ world, position }) => {
                const activity = activityMap[world.id] ?? 50;
                const scale = 0.2 + activity / 200;
                const color = new THREE.Color().setHSL(
                    (120 - activity) / 360,
                    0.7,
                    0.5
                );

                return (
                    <group
                        key={world.id}
                        position={position}
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveWorld(world.id);
                        }}
                    >
                        {/* glow halo */}
                        <mesh scale={scale * 1.4}>
                            <sphereGeometry args={[1, 16, 16]} />
                            <meshBasicMaterial color={color} transparent opacity={0.15} />
                        </mesh>
                        <group scale={[scale, scale, scale]}>
                            <WorldComposer world={world} scale={[0.2, 0.2, 0.2]} />
                        </group>
                    </group>
                );
            })}
        </group>
    );
}