import GenericEntity from "../entities/generic-entity";
import type { GeneratedSystem } from "./system-generator";

interface Props {
    system: GeneratedSystem;
}

export default function ProceduralSystem({ system }: Props) {
    return (
        <group name={system.name}>
            {system.positions.map((pos, i) => (
                <GenericEntity
                    key={`${system.id}-${i}`}
                    type={system.entityType}
                    value={Math.random() * 100}
                    position={pos}
                />
            ))}
        </group>
    );
}