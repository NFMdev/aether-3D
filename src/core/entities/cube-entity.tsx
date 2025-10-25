import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { EntityData } from "./entity-data";
import { Billboard, Text } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";
import { useEntitiesStore } from "../../store/use-entities-store";

interface Props {
    data: EntityData;
}

export default function CubeEntity({ data }: Props) {
    const mesh = useRef<THREE.Mesh>(null!);
    const selectedId = useEntitiesStore((s) => s.selectedId);
    const isSelected = selectedId === data.id;

    useFrame(({ clock }) => {
        const scale = 1 + data.value * 0.01;
        mesh.current.scale.set(scale, scale, scale);
        mesh.current.rotation.y += 0.01 + data.value * 0.0005;

        if (isSelected && mesh.current.material instanceof THREE.MeshStandardMaterial) {
            mesh.current.material.emissiveIntensity = 0.4 + Math.sin(clock.elapsedTime * 4) * 0.2;
        }
    });

    const { y, opacity } = useSpring({
        y: 1.4,
        opacity: 1,
        config: { tension: 120, friction: 14 }
    });

    return (
        <group position={data.position}>
            <mesh
                ref={mesh}
                onPointerOver={() => document.body.style.cursor = "pointer"}
                onPointerOut={() => document.body.style.cursor = "default"}
                onClick={(e) => {
                    e.stopPropagation();
                    useEntitiesStore.getState().selectEntity(data.id);
                }}
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color={data.color}
                    emissive={isSelected ? "#facc15" : "#000000"}
                    emissiveIntensity={isSelected ? 0.6 : 0}
                    roughness={0.4}
                    metalness={0.2}
                />
            </mesh>

            {isSelected && (
                <mesh scale={mesh.current?.scale}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshBasicMaterial 
                        color="#facc15"
                        transparent
                        opacity={0.3}
                        wireframe
                    />
                </mesh>
            )}

            <Billboard>
                <a.group position-y={y} visible={opacity.to((o) => o > 0)}>
                    <Text
                        fontSize={0.25}
                        color="#ffffff"
                        outlineWidth={0.02}
                        outlineColor="black"
                        anchorX="center"
                        anchorY={"bottom"}
                    >
                        {`${data.name}: ${data.value.toFixed(1)}`}
                    </Text>
                </a.group>
            </Billboard>
        </group>
    );
}
