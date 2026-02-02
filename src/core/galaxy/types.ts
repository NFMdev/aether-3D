import type { GeneratedWorld } from "../world/types";

export interface GalaxyConfig {
    id: string;
    name: string;
    orbitRadius?: number;
}

export interface GalaxyWorld {
    world: GeneratedWorld;
    position: [number, number, number];
    orbitSpeed: number;
}

export interface GeneratedGalaxy {
    id: string;
    name: string;
    worlds: GalaxyWorld[];
}