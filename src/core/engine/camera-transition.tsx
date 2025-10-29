import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useSpring } from "@react-spring/three";
import { useWorldStore } from "../../store/use-world-store";

export default function CameraTransition() {
    const { camera } = useThree();
    const { activeWorldId } = useWorldStore();
    const [target, setTarget] = useState<[number, number, number]>([0, 80, 120]);
    const [lookAt, setLookAt] = useState<[number, number, number]>([0, 0, 0]);

    // Update target based on world selection
    useEffect(() => {
        if (activeWorldId) {
            setTarget([20, 12, 20]);      // world-level position
            setLookAt([0, 4, 0]);
        } else {
            setTarget([0, 80, 120]);      // galaxy overview
            setLookAt([0, 0, 0]);
        }
    }, [activeWorldId]);

    const { pos } = useSpring({
        pos: target,
        config: { tension: 60, friction: 18 },
    });

    const current = useRef(new THREE.Vector3());
    const look = useRef(new THREE.Vector3());

    useFrame(() => {
        const p = pos.get() as number[];
        current.current.lerp(new THREE.Vector3(...p), 0.05);
        camera.position.copy(current.current);

        // interpolate lookAt for smooth orientation
        look.current.lerp(new THREE.Vector3(...lookAt), 0.05);
        camera.lookAt(look.current);
    });

    return null;
}
