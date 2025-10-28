import { useThree } from "@react-three/fiber";
import { useEntitiesStore } from "../../store/use-entities-store";
import * as THREE from 'three';
import { useEffect } from "react";

export default function environmentReactivity() {
    const { scene } = useThree();
    const entities = useEntitiesStore((s) => s.entities);

    useEffect(() => {
        if (!(scene.background instanceof THREE.Color)) {
            scene.background = new THREE.Color("#0a0a0a");
        }

        const bg = scene.background as THREE.Color;

        const color = new THREE.Color();
        const ambient = scene.children.find(
            (c) => c instanceof THREE.AmbientLight
        ) as THREE.AmbientLight | undefined;

        const interval = setInterval(() => {
            if (entities.length === 0) return;

            const avgValue = entities.reduce((acc, e) => acc + e.value, 0) / entities.length;

            // Map value -> color hue (0 = red, 120 = green, 240 = blue)
            const hue = THREE.MathUtils.clamp(180 - avgValue, 20, 180);
            const bgColor = color.setHSL(hue / 360, 0.6, 0.08);

            bg?.lerp(bgColor, 0.1);
            if (ambient) {
                ambient.intensity = THREE.MathUtils.lerp(
                    ambient.intensity,
                    0.3 + avgValue / 150,
                    0.1
                );
            }
        }, 200);

        return () => clearInterval(interval);
    }, [scene, entities]);

    return null;
}