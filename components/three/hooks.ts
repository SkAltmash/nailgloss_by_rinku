"use client";

import { useEffect, useMemo, useRef } from "react";
import { createNailGeometry } from "./geometry";
import { createNailMaterial } from "./nailMaterial";
import { useQuality } from "./SceneCanvas";

/**
 * Window-level pointer, normalised to -1..1. Canvases ignore pointer events
 * (so touch scrolling is never blocked); scenes read this instead.
 */
export function usePointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
}

export function useNailGeometry() {
  const quality = useQuality();
  const geometry = useMemo(() => createNailGeometry(quality), [quality]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

export function useNailMaterial(initialProgress = 1) {
  const nail = useMemo(() => createNailMaterial(initialProgress), [initialProgress]);
  useEffect(() => () => nail.material.dispose(), [nail]);
  return nail;
}

/** Frame-rate independent exponential smoothing. */
export function damp(current: number, target: number, lambda: number, delta: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * delta));
}
