import { create } from "zustand";
import { SystemGenerator, type GeneratedSystem } from "../core/systems/system-generator";
import type { GeneratedWorld } from "../core/world/types";
import { ENTITY_TYPES } from "../core/entities/entity-types";
import * as THREE from 'three';

interface WorldState {
    worlds: GeneratedWorld[];
    activeWorldId: string | null;

    addWorld: (world: GeneratedWorld) => void;
    removeWorld: (id: string) => void;
    setActiveWorld: (id: string | null) => void;
    addSystemToWorld: (worldId: string, system: GeneratedSystem) => void;
    getActiveWorld: () => GeneratedWorld | null;
}

export const useWorldStore = create<WorldState>((set, get) => ({
    worlds: [],
    activeWorldId: null,

    addWorld: (world) => set((s) => ({ worlds: [...s.worlds, world] })),
    removeWorld: (id) => set((s) => ({ worlds: s.worlds.filter((w) => w.id === id) })),
    setActiveWorld: (id) => set({ activeWorldId: id }),
    addSystemToWorld: (worldId, system) => set((s) => ({
        worlds: s.worlds.map((w) => w.id === worldId ? {
            ...w,
            systems: [
                ...w.systems,
                { system, position: [Math.random() * 20, 0, Math.random() * 20] }
            ]
        } : w)
    })),
    getActiveWorld: () => {
        const { worlds, activeWorldId } = get();
        return worlds.find((w) => w.id === activeWorldId) ?? null;
    }
}));

export const evolveWorlds = () => {
    const store = useWorldStore.getState();
    const { worlds, addSystemToWorld } = store;

    worlds.forEach((world) => {
        // Compute pseudo “activity index”
        const totalEntities = world.systems.reduce(
            (sum, s) => sum + (s.system.positions?.length ?? 0),
            0
        );
        const activity = Math.random() * 100; // replace later with real data

        // Threshold logic
        if (activity > 70 && totalEntities < 80) {
            // Spawn a new system
            const randomType = ["grid", "tower", "radial"][
                Math.floor(Math.random() * 3)
            ] as "grid" | "tower" | "radial";

            const entityType =
                Object.values(ENTITY_TYPES)[
                Math.floor(Math.random() * Object.keys(ENTITY_TYPES).length)
                ];

            const newSystem = SystemGenerator.generate({
                id: `auto-${Date.now()}`,
                name: `Auto ${randomType}`,
                type: randomType,
                entityType,
                entityCount: THREE.MathUtils.randInt(6, 20),
                spacing: THREE.MathUtils.randFloat(1.6, 2.5),
                radius: THREE.MathUtils.randFloat(4, 8),
            });

            addSystemToWorld(world.id, newSystem);
            console.log(`[Aether 3D] - New system spawned in ${world.name}`);
        }

        if (activity < 25 && world.systems.length > 3) {
            // Remove oldest
            world.systems.shift();
            useWorldStore.setState({
                worlds: [...store.worlds],
            });
            console.log(`[Aether 3D] - System removed from ${world.name}`);
        }
    });
};