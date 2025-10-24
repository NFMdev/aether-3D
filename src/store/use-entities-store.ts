import { create } from "zustand";
import type { EntityData } from "../core/entities/entity-data";
import { persist } from "zustand/middleware";

interface EntitiesState {
    entities: EntityData[];
    selectedId: string | null;

    addEntity: (entity: EntityData) => void;
    updateEntity: (id: string, patch: Partial<EntityData>) => void;
    updateEntityValue: (id: string, value: number) => void;
    removeEntity: (id: string) => void;
    clearEntities: () => void;
    selectEntity: (id: string | null) => void;
}

export const useEntitiesStore = create<EntitiesState>()(
    persist(
        (set, get) => ({
            entities: [],
            selectedId: null,
            addEntity: (e) => set((s) => ({entities: [...s.entities, e]})),
            updateEntity: (id, patch) => set((s) => ({
                entities: s.entities.map((ent) => ent.id === id ? {...ent, ...patch} : ent)
            })),
            updateEntityValue: (id, value) => set((s) => ({
                entities: s.entities.map((ent) => ent.id === id ? { ...ent, value } : ent)
            })),
            removeEntity: (id) => set((s) => ({
                entities: s.entities.filter((ent) => ent.id !== id),
                selectedId: s.selectedId === id ? null : s.selectedId
            })),
            clearEntities: () => set({ entities: [], selectedId: null }),
            selectEntity: (id) => set({ selectedId: id })
        }), { name: "aether3d-entities" }
    )
);