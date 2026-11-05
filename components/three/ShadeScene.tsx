"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { Group } from "three";
import type { Shade } from "@/lib/data";
import { SceneCanvas } from "./SceneCanvas";
import { damp, useNailGeometry, useNailMaterial, usePointer } from "./hooks";
import { easeToShade, setShade } from "./nailMaterial";

function ShowcaseNail({ shade }: { shade: Shade }) {
  const group = useRef<Group>(null);
  const pointer = usePointer();
  const geometry = useNailGeometry();
  const { material, uniforms } = useNailMaterial(1);
  const primed = useRef(false);
  const lastShade = useRef(shade.id);
  const kick = useRef(0);

  useFrame((state, delta) => {
    if (!primed.current) {
      setShade(uniforms, shade);
      primed.current = true;
    }
    easeToShade(uniforms, shade, delta, 4);

    // A small turn each time the shade changes, so the new colour catches the light.
    if (lastShade.current !== shade.id) {
      lastShade.current = shade.id;
      kick.current += Math.PI * 0.5;
    }
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const baseY = Math.sin(t * 0.5) * 0.45 + kick.current;
    g.rotation.y = damp(g.rotation.y, baseY + pointer.current.x * 0.3, 3, delta);
    g.rotation.x = damp(g.rotation.x, -0.15 - pointer.current.y * 0.2, 3, delta);
  });

  return (
    <group ref={group} rotation={[0, 0, 0]}>
      <mesh geometry={geometry} material={material} scale={1.15} rotation={[0, 0, -0.18]} />
    </group>
  );
}

export default function ShadeScene({ active, shade }: { active: boolean; shade: Shade }) {
  return (
    <SceneCanvas active={active}>
      <ShowcaseNail shade={shade} />
      <ContactShadows position={[0, -1.6, 0]} opacity={0.3} scale={6} blur={2.6} far={3} color="#4A1F14" resolution={256} />
    </SceneCanvas>
  );
}
