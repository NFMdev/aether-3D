import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useSpring } from "@react-spring/three";
import { useWorldStore } from "../../store/use-world-store";

export default function CameraTransition() {
    const { camera, gl } = useThree();
    const { activeWorldId } = useWorldStore();
    const [target, setTarget] = useState<[number, number, number]>([0, 80, 120]);
    const [lookAt, setLookAt] = useState<[number, number, number]>([0, 0, 0]);
    const isDragging = useRef(false);
    const lastPointer = useRef({ x: 0, y: 0 });
    const spherical = useRef(new THREE.Spherical());
    const keys = useRef({
        forward: false,
        back: false,
        left: false,
        right: false,
        up: false,
        down: false,
    });
    const targetRef = useRef(new THREE.Vector3(...target));
    const lookAtRef = useRef(new THREE.Vector3(...lookAt));
    const moveDir = useRef(new THREE.Vector3());
    const forward = useRef(new THREE.Vector3());
    const right = useRef(new THREE.Vector3());
    const up = useRef(new THREE.Vector3(0, 1, 0));

    // Update target based on world selection
    useEffect(() => {
        if (activeWorldId) {
            setTarget([20, 12, 20]);      // world-level position
            setLookAt([0, 4, 0]);
        } else {
            setTarget([0, 80, 120]);      // galaxy overview
            setLookAt([0, 0, 0]);
        }
    }, [activeWorldId]);

    const { pos } = useSpring({
        pos: target,
        config: { tension: 60, friction: 18 },
    });

    const current = useRef(new THREE.Vector3());
    const look = useRef(new THREE.Vector3());

    useEffect(() => {
        targetRef.current.set(...target);
    }, [target]);

    useEffect(() => {
        lookAtRef.current.set(...lookAt);
    }, [lookAt]);

    useEffect(() => {
        const element = gl.domElement as HTMLElement | undefined;
        if (!element) return;

        const onPointerDown = (e: PointerEvent) => {
            if (e.button !== 0) return;
            isDragging.current = true;
            lastPointer.current = { x: e.clientX, y: e.clientY };
            const center = new THREE.Vector3(...lookAt);
            spherical.current.setFromVector3(camera.position.clone().sub(center));
            element.setPointerCapture?.(e.pointerId);
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!isDragging.current) return;
            e.preventDefault();
            const dx = e.clientX - lastPointer.current.x;
            const dy = e.clientY - lastPointer.current.y;
            lastPointer.current = { x: e.clientX, y: e.clientY };

            const rotateSpeed = 0.005;
            spherical.current.theta -= dx * rotateSpeed;
            spherical.current.phi -= dy * rotateSpeed;
            const minPhi = 0.1;
            const maxPhi = Math.PI - 0.1;
            spherical.current.phi = Math.max(minPhi, Math.min(maxPhi, spherical.current.phi));

            const center = new THREE.Vector3(...lookAt);
            const newPos = new THREE.Vector3().setFromSpherical(spherical.current).add(center);
            setTarget([newPos.x, newPos.y, newPos.z]);
        };

        const onPointerUp = (e: PointerEvent) => {
            if (!isDragging.current) return;
            isDragging.current = false;
            element.releasePointerCapture?.(e.pointerId);
        };

        element.addEventListener("pointerdown", onPointerDown);
        element.addEventListener("pointermove", onPointerMove, { passive: false });
        element.addEventListener("pointerup", onPointerUp);
        element.addEventListener("pointercancel", onPointerUp);

        return () => {
            element.removeEventListener("pointerdown", onPointerDown);
            element.removeEventListener("pointermove", onPointerMove);
            element.removeEventListener("pointerup", onPointerUp);
            element.removeEventListener("pointercancel", onPointerUp);
        };
    }, [camera, gl, lookAt]);

    useEffect(() => {
        const isEditableTarget = (target: EventTarget | null) => {
            if (!(target instanceof HTMLElement)) return false;
            const tag = target.tagName.toLowerCase();
            return tag === "input" || tag === "textarea" || target.isContentEditable;
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (isEditableTarget(e.target)) return;
            switch (e.code) {
                case "KeyW":
                case "ArrowUp":
                    keys.current.forward = true;
                    e.preventDefault();
                    break;
                case "KeyS":
                case "ArrowDown":
                    keys.current.back = true;
                    e.preventDefault();
                    break;
                case "KeyA":
                case "ArrowLeft":
                    keys.current.left = true;
                    e.preventDefault();
                    break;
                case "KeyD":
                case "ArrowRight":
                    keys.current.right = true;
                    e.preventDefault();
                    break;
                case "KeyQ":
                    keys.current.down = true;
                    e.preventDefault();
                    break;
                case "KeyE":
                    keys.current.up = true;
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        };

        const onKeyUp = (e: KeyboardEvent) => {
            switch (e.code) {
                case "KeyW":
                case "ArrowUp":
                    keys.current.forward = false;
                    break;
                case "KeyS":
                case "ArrowDown":
                    keys.current.back = false;
                    break;
                case "KeyA":
                case "ArrowLeft":
                    keys.current.left = false;
                    break;
                case "KeyD":
                case "ArrowRight":
                    keys.current.right = false;
                    break;
                case "KeyQ":
                    keys.current.down = false;
                    break;
                case "KeyE":
                    keys.current.up = false;
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, []);

    useFrame((_, delta) => {
        const moveSpeed = activeWorldId ? 8 : 20;
        const shouldMove =
            keys.current.forward ||
            keys.current.back ||
            keys.current.left ||
            keys.current.right ||
            keys.current.up ||
            keys.current.down;

        if (shouldMove) {
            forward.current.set(0, 0, -1).applyQuaternion(camera.quaternion);
            forward.current.y = 0;
            forward.current.normalize();
            right.current.crossVectors(forward.current, up.current).normalize();

            moveDir.current.set(0, 0, 0);
            if (keys.current.forward) moveDir.current.add(forward.current);
            if (keys.current.back) moveDir.current.sub(forward.current);
            if (keys.current.right) moveDir.current.add(right.current);
            if (keys.current.left) moveDir.current.sub(right.current);
            if (keys.current.up) moveDir.current.add(up.current);
            if (keys.current.down) moveDir.current.sub(up.current);

            if (moveDir.current.lengthSq() > 0) {
                moveDir.current.normalize().multiplyScalar(moveSpeed * delta);
                lookAtRef.current.add(moveDir.current);
                targetRef.current.add(moveDir.current);
                setLookAt([lookAtRef.current.x, lookAtRef.current.y, lookAtRef.current.z]);
                setTarget([targetRef.current.x, targetRef.current.y, targetRef.current.z]);
            }
        }

        const p = pos.get() as number[];
        current.current.lerp(new THREE.Vector3(...p), 0.05);
        camera.position.copy(current.current);

        // interpolate lookAt for smooth orientation
        look.current.lerp(new THREE.Vector3(...lookAt), 0.05);
        camera.lookAt(look.current);
    });

    return null;
}
