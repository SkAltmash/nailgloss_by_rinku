"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { Group } from "three";
import type { Shade } from "@/lib/data";
import { SceneCanvas, useQuality } from "./SceneCanvas";
import { damp, useNailGeometry, useNailMaterial, usePointer } from "./hooks";
import { easeToShade, setShade } from "./nailMaterial";

function HeroNail({ shade }: { shade: Shade }) {
  const spin = useRef<Group>(null);
  const tilt = useRef<Group>(null);
  const pointer = usePointer();
  const geometry = useNailGeometry();
  const { material, uniforms } = useNailMaterial(1);
  const primed = useRef(false);

  useFrame((state, delta) => {
    if (!primed.current) {
      setShade(uniforms, shade);
      primed.current = true;
    }
    easeToShade(uniforms, shade, delta);

    const t = state.clock.elapsedTime;
    if (spin.current) {
      // Full turns that linger face-on and pass quickly through edge-on.
      const theta = t * 0.4;
      spin.current.rotation.y = theta - 0.5 * Math.sin(2 * theta);
      spin.current.position.y = Math.sin(t * 0.9) * 0.06;
    }
    if (tilt.current) {
      tilt.current.rotation.x = damp(tilt.current.rotation.x, -pointer.current.y * 0.3, 4, delta);
      tilt.current.rotation.y = damp(tilt.current.rotation.y, pointer.current.x * 0.4, 4, delta);
    }
  });

  return (
    <group ref={tilt}>
      <group rotation={[-0.25, 0, -0.32]}>
        <group ref={spin}>
          <mesh geometry={geometry} material={material} scale={1.25} />
        </group>
      </group>
    </group>
  );
}

function Shadows() {
  const quality = useQuality();
  return (
    <ContactShadows
      position={[0, -1.85, 0]}
      opacity={0.55}
      scale={6}
      blur={2.8}
      far={3}
      color="#120402"
      resolution={quality === "high" ? 512 : 256}
      frames={quality === "high" ? Infinity : 1}
    />
  );
}

export default function HeroScene({ active, shade }: { active: boolean; shade: Shade }) {
  return (
    <SceneCanvas active={active}>
      <HeroNail shade={shade} />
      <Shadows />
    </SceneCanvas>
  );
}
