import { button, useControls } from "leva";
import { useEntitiesStore } from "../store/use-entities-store";
import { useEffect, useMemo } from "react";

export default function ControlPanel() {
    const {
        entities,
        selectedId,
        addEntity,
        updateEntity,
        removeEntity,
        clearEntities,
        selectEntity

    } = useEntitiesStore();

    // Entity controls
    const { name, color, x, y, z } = useControls("Entity Controls", {
        name: { value: "New Metric" },
        color: { value: "#4f46e5" },
        x: { value: 0, min: -5, max: 5, step: 0.5 },
        y: { value: 1, min: 0, max: 5, step: 0.5 },
        z: { value: 0, min: -5, max: 5, step: 0.5 },
        Add: button(() =>
            addEntity({
                id: `ent-${Date.now()}`,
                name,
                type: "cube",
                value: 10,
                color,
                position: [x, y, z]
            })
        ),
        Clear: button(() => clearEntities())
    });

    // Entity selector
    const selectOptions = useMemo(() => {
        const opts: Record<string, string> = { None: "" };
        for (const e of entities) opts[e.name] = e.id;
        return opts;
    }, [entities]);
    useControls("Select Entity", {
        Selected: {
            options: selectOptions,
            value: selectedId ?? "",
            onChange: (v: string) => selectEntity(v || null),
        }
    });

    // Editing panel
    const selectedEntity = entities.find((e) => e.id === selectedId) || null;
    useControls("Edit Entity",
        () => ({
            Color: {
                value: selectedEntity?.color ?? "#ffffff",
                onChange: (v: string) => {
                    if (selectedEntity) updateEntity(selectedEntity.id, { color: v });
                },
                disabled: !selectedEntity
            },
            X: {
                value: selectedEntity?.position[0] ?? 0,
                min: -5,
                max: 5,
                step: 0.2,
                onChange: (v: number) => {
                    if (selectedEntity) updateEntity(selectedEntity.id, {
                        position: [selectedEntity.position[1], v, selectedEntity.position[2]]
                    });
                },
                disabled: !selectedEntity
            },
            Y: {
                value: selectedEntity?.position[1] ?? 1,
                min: 0,
                max: 5,
                step: 0.2,
                onChange: (v: number) => {
                    if (selectedEntity)
                        updateEntity(selectedEntity.id, {
                            position: [selectedEntity.position[0], v, selectedEntity.position[2]],
                        });
                },
                disabled: !selectedEntity,
            },
            Z: {
                value: selectedEntity?.position[2] ?? 0,
                min: -5,
                max: 5,
                step: 0.2,
                onChange: (v: number) => {
                    if (selectedEntity)
                        updateEntity(selectedEntity.id, {
                            position: [selectedEntity.position[0], selectedEntity.position[1], v],
                        });
                },
                disabled: !selectedEntity,
            },
            Delete: button(() => {
                if (selectedEntity) removeEntity(selectedEntity.id);
            }),
        }),
        [selectedId, selectedEntity] // re-register when selection changes
    );

    useEffect(() => {
        if (selectedEntity) console.log("Selected", selectedEntity.name);
    }, [selectedEntity]);

    return null;
}
