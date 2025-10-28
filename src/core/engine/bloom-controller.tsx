import { Bloom } from "@react-three/postprocessing";
import useDynamicBloom from "./use-dynamic-bloom";

export default function BloomController() {
    const bloomIntensity = useDynamicBloom();

    return (
        <Bloom
            intensity={bloomIntensity.current}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.6}
        />
    )
}