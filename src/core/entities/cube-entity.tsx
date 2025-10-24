import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import type { EntityData } from "./entity-data";
import { Billboard, Text } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";

interface Props {
    data: EntityData;
}

export default function CubeEntity({ data }: Props) {
    const mesh = useRef<THREE.Mesh>(null!);
    const [hovered, setHovered] = useState(false);

    useFrame(() => {
        const scale = 1 + data.value * 0.01;
        mesh.current.scale.set(scale, scale, scale);
        mesh.current.rotation.y += 0.01 + data.value * 0.0005;
    });

    const { y, opacity } = useSpring({
        y: hovered ? 1.4 : 1.0,
        opacity: hovered ? 1 : 0,
        config: { tension: 120, friction: 14 }
    });

    return (
        <group position={data.position}>
            <mesh
                ref={mesh}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={(e) => {
                    e.stopPropagation();
                    import("../../store/use-entities-store").then(({ useEntitiesStore }) => {
                        useEntitiesStore.getState().selectEntity(data.id);
                    });
                }}
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color={hovered ? "#facc15" : data.color}
                    roughness={0.4}
                    metalness={0.2}
                />
            </mesh>

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
