import { useFrame, useThree } from "@react-three/fiber";
import { useEntitiesStore } from "../../store/use-entities-store";
import { useSpring } from "@react-spring/core";
import { useRef } from "react";
import * as THREE from "three";

export default function CameraController() {
    const { camera } = useThree();
    const { entities, selectedId} = useEntitiesStore();

    const selectedEntity = entities.find((e) => e.id === selectedId);

    const targetPosition = selectedEntity ? [
        selectedEntity.position[0] + 3,
        selectedEntity.position[1] + 2,
        selectedEntity.position[2] + 3
    ] : camera.position;

    const { pos } = useSpring({ pos: targetPosition, config: { tension: 80, friction: 14 } });

    const orbitAngle = useRef(0);

    useFrame(({ clock }) => {
        if (!selectedEntity) {
            orbitAngle.current += 0.004;
            const radius = 10;
            const x = Math.sin(orbitAngle.current) * radius;
            const z = Math.cos(orbitAngle.current) * radius;
            const y = 4 + Math.sin(clock.elapsedTime * 1);
            camera.position.lerp(new THREE.Vector3(x, y, z), 0.05);
            camera.lookAt(0, 1, 0);
            return;
        }

        const p = pos.get() as number[];
        camera.position.set(p[0], p[1], p[2]);
        camera.lookAt(...selectedEntity.position)
    });

    return null;
}