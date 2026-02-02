import { useEffect, useState } from "react";
import { useWorldStore } from "./use-world-store";

export function useWorldActivity() {
    const { worlds } = useWorldStore();
    const [activityMap, setActivityMap] = useState<Record<string, number>>({});

    useEffect(() => {
        const interval = setInterval(() => {
            const newMap: Record<string, number> = {};
            worlds.forEach((w) => {
                const entityCount = w.systems.reduce(
                    (acc, s) => acc + (s.system.positions?.length ?? 0),
                    0
                );
                // Simulate activity for now, later replace with real metrics
                const activity = Math.sin(Date.now() / 1000 + entityCount) * 50 + 50;
                newMap[w.id] = activity;
            });
            setActivityMap(newMap);
        }, 500);
        return () => clearInterval(interval);
    }, [worlds]);

    return activityMap;
}