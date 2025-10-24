import { create } from "zustand";
import type { EntityData } from "../core/entities/entity-data";

interface EntitiesState {
    entities: EntityData[];
    addEntity: (entity: EntityData) => void;
    updateEntityValue: (id: string, value: number) => void;
    clearEntities: () => void;
}

export const useEntitiesStore = create<EntitiesState>((set) => ({
    entities: [],
    addEntity: (entity) => set((state) => ({entities: [...state.entities, entity]})),
    updateEntityValue: (id, value) => set((state) => ({
        entities: state.entities.map((e) => e.id === id ? {...e, value} : e)
    })),
    clearEntities: () => set({ entities: [] })
}))