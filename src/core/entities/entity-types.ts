import * as THREE from 'three';

export type EntityShape = "cube" | "sphere" | "cylinder" | "donut" | "prism";

export interface EntityBehavior {
    rotationSpeed: number;
    pulseIntensity?: number;
    reactive?: boolean;
}

export interface EntityVisual {
    color: string;
    metalness?: number;
    roughness?: number;
    scale?: [number, number, number];
    emissive?: string;
}

export interface EntityTypeDefinition {
    id: EntityShape;
    label: string;
    visual: EntityVisual;
    behavior: EntityBehavior;
    geometry?: () => THREE.BufferGeometry;
}

export const ENTITY_TYPES: Record<EntityShape, EntityTypeDefinition> = {
    cube: {
        id: "cube",
        label: "Cube",
        visual: {
            color: "#4f46e5",
            metalness: 0.2,
            roughness: 0.4
        },
        behavior: { rotationSpeed: 0.6, reactive: true },
        geometry: () => new THREE.BoxGeometry(1, 1, 1)
    },
    sphere: {
        id: "sphere",
        label: "Sphere",
        visual: {
            color: "#22c55e",
            metalness: 0.1,
            roughness: 0.6
        },
        behavior: { rotationSpeed: 0.15, reactive: true },
        geometry: () => new THREE.SphereGeometry(0.7, 32, 32)
    },
    cylinder: {
        id: "cylinder",
        label: "Cylinder",
        visual: {
            color: "#eab308",
            metalness: 0.3,
            roughness: 0.5
        },
        behavior: { rotationSpeed: 0.3 },
        geometry: () => new THREE.CylinderGeometry(0.5, 0.5, 1.2, 16)
    },
    donut: {
        id: "donut",
        label: "Donut",
        visual: {
            color: "#ec4899",
            metalness: 0.4,
            roughness: 0.3
        },
        behavior: { rotationSpeed: 0.8, pulseIntensity: 0.1 },
        geometry: () => new THREE.TorusGeometry(0.6, 0.2, 16, 32)
    },
    prism: {
        id: "prism",
        label: "Prism",
        visual: {
            color: "#0ea5e9",
            metalness: 0.2,
            roughness: 0.6
        },
        behavior: { rotationSpeed: 0.4 },
        geometry: () => new THREE.ConeGeometry(0.6, 1.2, 6)
    }
}