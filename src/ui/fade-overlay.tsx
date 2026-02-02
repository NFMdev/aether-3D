import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useWorldStore } from "../store/use-world-store";

export default function FadeOverlay() {
    const { activeWorldId } = useWorldStore();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 600);
        return () => clearTimeout(timer);
    }, [activeWorldId]);

    const styles = useSpring({
        opacity: visible ? 1 : 0,
        config: { tension: 120, friction: 24 },
    });

    return (
        <animated.div
            style={{
                ...styles,
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "radial-gradient(circle, #000 20%, #000000dd 100%)",
                pointerEvents: "none",
                zIndex: 50,
            }}
        />
    );
}
