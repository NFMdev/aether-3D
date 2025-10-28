import type { EntityTypeDefinition } from "../entities/entity-types";

export type LayoutPattern = "grid" | "tower" | "radial";

export interface SystemConfig {
    id: string;
    name: string;
    type: LayoutPattern;
    entityType: EntityTypeDefinition;
    entityCount: number;
    spacing?: number;
    layers?: number; // for towers
    radius?: number; // for radials
}

export interface GeneratedSystem {
    id: string;
    name: string;
    positions: [number, number, number][];
    type: LayoutPattern;
    entityType: EntityTypeDefinition;
}

// Proceduralo system generator
export class SystemGenerator {
    static generate(config: SystemConfig): GeneratedSystem {
        const {
            id,
            name,
            type,
            entityType,
            entityCount,
            spacing = 2,
            layers = 1,
            radius = 5
        } = config;

        const positions: [number, number, number][] = [];

        switch(type) {
            case "grid":
                const size = Math.ceil(Math.sqrt(entityCount));
                for (let x = 0; x < size; x++) {
                    for (let z = 0; z < size; z++) {
                        if (positions.length >= entityCount) break;
                        positions.push([x * spacing, 0, z * spacing]);
                    }
                }
                break;
            case "tower":
                for (let i = 0; i < entityCount; i++) {
                    const layer = Math.floor(i / layers);
                    const x = (i % layers) * spacing - (layers * spacing) / 2;
                    const y = layer * spacing * 1.5;
                    positions.push([x, y, 0]);
                }
                break;
            case "radial":
                const angleStep = (Math.PI * 2) / entityCount;
                for (let i = 0; i < entityCount; i++) {
                    const angle = i * angleStep;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;
                    positions.push([x, 0, z]);
                }
                break;
        }

        return {
            id,
            name,
            positions,
            type,
            entityType
        };
    }
}