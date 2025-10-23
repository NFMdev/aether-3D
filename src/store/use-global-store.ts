import { create } from "zustand";

interface GlobalState {
    rotationSpeed: number;
    setRotationSpeed: (v: number) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
    rotationSpeed: 1,
    setRotationSpeed: (v) => set({rotationSpeed: v})
}))