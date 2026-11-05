"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

let webglSupport: boolean | null = null;

function detectWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    webglSupport = !!gl;
    // Free the probe context straight away.
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/**
 * True only on the client when WebGL works and the visitor has not asked for
 * reduced motion. Server render (and the first hydration pass) get `false`, so
 * the static poster is always what ships in HTML.
 */
export function useCan3D(): boolean {
  return useSyncExternalStore(
    subscribeMotion,
    () => !window.matchMedia(REDUCED_MOTION).matches && detectWebGL(),
    () => false,
  );
}

const noopSubscribe = () => () => {};

/** True on the client when WebGL cannot be created. */
export function useWebGLMissing(): boolean {
  return useSyncExternalStore(noopSubscribe, () => !detectWebGL(), () => false);
}

/**
 * Tracks whether an element is near the viewport. `entered` latches true the
 * first time, so a canvas mounts once and then just pauses when off-screen.
 */
export function useInView(ref: RefObject<Element | null>, rootMargin = "200px") {
  const [state, setState] = useState({ inView: false, entered: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setState((prev) => ({
          inView: entry.isIntersecting,
          entered: prev.entered || entry.isIntersecting,
        }));
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return state;
}
