import { useEffect } from "react";
import { useEntitiesStore } from "../../store/use-entities-store"

export default function useMockDataStream() {
    const updateValue = useEntitiesStore((s) => s.updateEntityValue);

    useEffect(() => {
        const interval = setInterval(() => {
            // Update random entity values every 500ms
            const entities = useEntitiesStore.getState().entities;
            entities.forEach((e) => {
                const newValue = Math.abs(Math.sin(Date.now() / 10000 + Math.random())) * 100;
                updateValue(e.id, newValue);
            });
        }, 10000);

        return () => clearInterval(interval);
    }, [updateValue]);
}