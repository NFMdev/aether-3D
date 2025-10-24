import { useEntitiesStore } from "../../store/use-entities-store";
import CubeEntity from "./cube-entity";

export default function EntityManager() {
    const entities = useEntitiesStore((s) => s.entities);

    return (
        <>
            {entities.map((e) => (
                <CubeEntity key={e.id} data={e} />
            ))}
        </>
    );
}