"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { getShade, SERVICES } from "@/lib/data";
import { SceneCanvas } from "./SceneCanvas";
import { damp, useNailGeometry, useNailMaterial } from "./hooks";
import { setShade } from "./nailMaterial";

function FloatingNail({ index, activeIndex }: { index: number; activeIndex: number | null }) {
  const group = useRef<Group>(null);
  const { viewport } = useThree();
  const geometry = useNailGeometry();
  const { material, uniforms } = useNailMaterial(1);
  const service = SERVICES[index];

  useEffect(() => {
    setShade(uniforms, getShade(service.shadeId));
  }, [uniforms, service.shadeId]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const n = SERVICES.length;
    const wide = viewport.width / viewport.height > 1.5;
    // Row on wide canvases, 2×2 grid on narrow ones.
    const cols = wide ? n : 2;
    const col = index % cols;
    const row = Math.floor(index / cols);
    const rows = Math.ceil(n / cols);
    const cellW = viewport.width / cols;
    const cellH = viewport.height / rows;
    const scale = Math.min(cellW / 2.2, cellH / 3, 0.85);

    const t = state.clock.elapsedTime + index * 1.3;
    const isActive = activeIndex === index;
    const lift = isActive ? 0.25 : 0;
    const x = -viewport.width / 2 + cellW * (col + 0.5);
    const y = viewport.height / 2 - cellH * (row + 0.5) + Math.sin(t * 1.1) * 0.08 * scale;

    g.position.x = x;
    g.position.y = damp(g.position.y, y + lift * scale, 6, delta);
    const s = damp(g.scale.x, scale * (isActive ? 1.12 : 1), 6, delta);
    g.scale.setScalar(s);
    g.rotation.z = Math.sin(t * 0.7) * 0.12 + (index % 2 ? 0.22 : -0.22);
    g.rotation.y = damp(g.rotation.y, isActive ? Math.sin(t * 2) * 0.4 : Math.sin(t * 0.5) * 0.5, 4, delta);
    g.rotation.x = -0.2;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={material} />
    </group>
  );
}

export default function ServicesScene({
  active,
  activeIndex,
}: {
  active: boolean;
  activeIndex: number | null;
}) {
  return (
    <SceneCanvas active={active} fov={30}>
      {SERVICES.map((s, i) => (
        <FloatingNail key={s.id} index={i} activeIndex={activeIndex} />
      ))}
    </SceneCanvas>
  );
}
