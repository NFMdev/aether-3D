import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { evolveWorlds } from "../../store/use-world-store";

/** Handles autonomous world growth and decay */
export default function WorldEvolution() {
  const timer = useRef(0);

  useFrame((_, delta) => {
    timer.current += delta;
    if (timer.current > 5) {   // every 5 seconds
      evolveWorlds();
      timer.current = 0;
    }
  });

  return null;
}
