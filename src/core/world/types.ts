import type { GeneratedSystem } from "../systems/system-generator";

export type WorldLayout = "grid" | "ring" | "rows";

export interface WorldConfig {
    id: string;
    name: string;
    layout: WorldLayout;
    spacing?: number;
    radius?: number;
    rows?: number;
}

export interface PlacedSystem {
    system: GeneratedSystem;
    position: [number, number, number];
}

export interface GeneratedWorld {
    id: string;
    name: string;
    layout: WorldLayout;
    systems: PlacedSystem[];
}