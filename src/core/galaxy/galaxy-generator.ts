import type { GeneratedWorld } from "../world/types";
import type { GalaxyConfig, GalaxyWorld, GeneratedGalaxy } from "./types";
import * as THREE from 'three';

export function generateGalaxy(config: GalaxyConfig, worlds: GeneratedWorld[]): GeneratedGalaxy {
    const orbitRadius = config.orbitRadius ?? 60;
    const step = (Math.PI * 2) / worlds.length;

    const galaxyWorlds: GalaxyWorld[] = worlds.map((world, i) => {
        const angle = i * step;
        const pos: [number, number, number] = [
            Math.cos(angle) * orbitRadius,
            0,
            Math.sin(angle) * orbitRadius
        ];
        return { world, position: pos, orbitSpeed: THREE.MathUtils.randFloat(0.005, 0.015) };
    });

    return { id: config.id, name: config.name, worlds: galaxyWorlds };
}