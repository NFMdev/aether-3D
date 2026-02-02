import { useRef } from "react";
import type { EntityTypeDefinition } from "./entity-types";
import * as THREE from 'three';
import { useFrame } from "@react-three/fiber";

interface Props {
    type: EntityTypeDefinition;
    value: number;
    position: [number, number, number];
    selected?: boolean;
}

export default function GenericEntity({ type, value, position, selected }: Props) {
    const mesh = useRef<THREE.Mesh>(null!);

    const rotationSpeed = type.behavior.rotationSpeed ?? 0;
    const pulseIntensity = type.behavior.pulseIntensity ?? 0;
    const color = new THREE.Color(type.visual.color);

    useFrame((_, delta) => {
        if (!mesh.current) return;

        if (rotationSpeed > 0) {
            mesh.current.rotation.x += delta * rotationSpeed;
            mesh.current.rotation.y += delta * rotationSpeed * 0.8;
        }

        if (type.behavior.reactive) {
            const scale = 1 + Math.sin(value * 0.05) * pulseIntensity;
            mesh.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <mesh ref={mesh} position={position}>
            <primitive object={type.geometry ? type.geometry() : new THREE.BoxGeometry(1, 1, 1)} />
            <meshStandardMaterial
                color={color}
                emissive={selected ? color.clone().multiplyScalar(0.5) : "#000000"}
                metalness={type.visual.metalness}
                roughness={type.visual.roughness}
            />
        </mesh>
    )
}