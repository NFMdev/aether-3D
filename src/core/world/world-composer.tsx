import type { GenerateWorld } from "./types";
import ProceduralSystem from "../systems/procedural-system";
import type { JSX } from "react";

type GroupProps = JSX.IntrinsicElements["group"];

interface Props extends GroupProps {
    world: GenerateWorld;
    label?: boolean;
}

export default function WorldComposer({ world, ...rest }: Props) {
    return (
        <group name={world.name} {...rest}>
            {world.systems.map(({ system, position }) => (
                <group key={system.id} position={position}>
                    <ProceduralSystem system={system} />
                </group>
            ))}
        </group>
    )
}