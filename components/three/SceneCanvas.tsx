"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { createContext, useContext, useState, type ReactNode } from "react";

const QualityContext = createContext<"high" | "low">("high");
export const useQuality = () => useContext(QualityContext);

function startsLow(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
}

/** Soft studio reflections built from light panels — no HDR download. */
function Studio({ quality }: { quality: "high" | "low" }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <directionalLight position={[-4, -1, 2]} intensity={0.35} color="#F7DFDC" />
      <Environment resolution={quality === "high" ? 256 : 64} frames={1}>
        <color attach="background" args={["#7a7c82"]} />
        <Lightformer form="rect" intensity={4} position={[0, 4, 3]} rotation-x={Math.PI / 2.4} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2.2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[1.4, 6, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#F7DFDC" position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[1.4, 6, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#D5D9DE" position={[0, 0, 6]} scale={3} />
        <Lightformer form="rect" intensity={1.2} position={[0, -4, 1]} rotation-x={-Math.PI / 2} scale={[8, 2, 1]} />
      </Environment>
    </>
  );
}

export function SceneCanvas({
  active,
  children,
  fov = 35,
}: {
  active: boolean;
  children: ReactNode;
  fov?: number;
}) {
  const [quality, setQuality] = useState<"high" | "low">(() => (startsLow() ? "low" : "high"));
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      dpr={[1, quality === "low" ? 1 : dpr]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 6], fov }}
      gl={{ antialias: quality === "high", alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none", touchAction: "pan-y" }}
    >
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => {
          setDpr(1);
          setQuality("low");
        }}
        onIncline={() => setDpr(1.5)}
        onFallback={() => {
          setDpr(1);
          setQuality("low");
        }}
      >
        <QualityContext value={quality}>
          <Studio quality={quality} />
          {children}
        </QualityContext>
      </PerformanceMonitor>
    </Canvas>
  );
}
