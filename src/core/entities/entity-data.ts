export interface EntityData {
    id: string;
    name: string;
    type: "cube" | "sphere";
    value: number;
    color: string;
    position: [number, number, number];
}