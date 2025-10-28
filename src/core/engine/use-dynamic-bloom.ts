import { useRef } from "react";
import { useEntitiesStore } from "../../store/use-entities-store";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';

export default function useDynamicBloom() {
    const entities = useEntitiesStore((s) => s.entities);
    const intensity = useRef(0.8);

    useFrame(() => {
        if(entities.length === 0) return;

        const avg = entities.reduce((acc, e) => acc + e.value, 0) / entities.length;
        const target =  THREE.MathUtils.clamp(0.6 +  avg / 150, 0.6, 2.0);
        
        const t = performance.now() * 0.001;
        const wave = 0.1 + Math.sin(t * 2) * 0.1;

        intensity.current = THREE.MathUtils.lerp(
            intensity.current,
            target + wave,
            0.05
        );
    });

    return intensity;
}