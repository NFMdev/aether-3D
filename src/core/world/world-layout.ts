import type { GeneratedSystem } from "../systems/system-generator";
import type { GeneratedWorld, PlacedSystem, WorldConfig } from "./types";

export function composeWorld(config: WorldConfig, systems: GeneratedSystem[]): GeneratedWorld {
    const spacing = config.spacing ?? 1;
    const radius = config.radius ?? 5;
    const rows = config.rows ?? 2;

    const placed: PlacedSystem[] = [];

    switch (config.layout) {
        case "grid":
            const side = Math.ceil(Math.sqrt(systems.length));
            systems.forEach((sys, i) => {
                const x = i % side;
                const z = Math.floor(i / side);
                placed.push({
                    system: sys,
                    position: [x * spacing, 0, z * spacing]
                });
            });
            break;
        case "ring":
            const step = (Math.PI * 2) / Math.max(1, systems.length);
            systems.forEach((sys, i) => {
                const angle = i * step;
                placed.push({
                    system: sys,
                    position: [
                        Math.cos(angle) * radius,
                        0,
                        Math.sin(angle) * radius
                    ]
                });
            });
            break;
        case "rows":
            systems.forEach((sys, i) => {
                const row = Math.floor(i / rows);
                const col = i % rows;
                placed.push({
                    system: sys,
                    position: [col * spacing, 0, row * spacing]
                });
            });
            break;
    }

    return {
        id: config.id,
        name: config.name,
        layout: config.layout,
        systems: placed
    }
}