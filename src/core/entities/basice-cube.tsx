import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function BasicCube() {
    const mesh = useRef<THREE.Mesh>(null!);

    useFrame((_, delta) => {
        mesh.current.rotation.x += delta * 0.6;
        mesh.current.rotation.y += delta * 0.4;
    });

    return (
        <mesh ref={mesh} position={[0, 1, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#4f46e5" roughness={0.4} metalness={0.2} />
        </mesh>
    );
}