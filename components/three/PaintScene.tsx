"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Euler, MeshPhysicalMaterial, Vector3, type Group } from "three";
import type { Shade } from "@/lib/data";
import { SceneCanvas, useQuality } from "./SceneCanvas";
import { createBottleGeometries, createBrushGeometries, NAIL_LENGTH, nailSurfaceZ } from "./geometry";
import { damp, useNailGeometry, useNailMaterial, usePointer } from "./hooks";
import { easeToShade, setShade, type NailUniforms } from "./nailMaterial";

/** Values driven by the GSAP ScrollTrigger timeline (all 0–1). */
export interface PaintProgress {
  bottle: number; // bottle rises into frame
  lift: number; // brush lifts out of the bottle
  travel: number; // brush travels to the cuticle
  fill: number; // colour fills cuticle → tip (uProgress)
  ret: number; // brush returns and caps the bottle
  spin: number; // finished nail turns to catch the light
}

const NAIL_SCALE = 1;
const BOTTLE_SCALE = 0.72;
const LIFT_HEIGHT = 1.25; // in bottle units, clears the neck

const seat = new Vector3();
const lifted = new Vector3();
const painting = new Vector3();
const pose = new Vector3();
const euler = new Euler();
const PAINT_ROT = new Euler(0.55, 0, -0.6);
const ZERO_ROT = new Euler(0, 0, 0);

function lerpEuler(a: Euler, b: Euler, t: number, out: Euler) {
  out.set(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
  return out;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Drive uProgress and keep the bottle liquid + bristles in the nail's colour. */
function syncPaint(
  uniforms: NailUniforms,
  mats: { liquid: MeshPhysicalMaterial; bristles: MeshPhysicalMaterial },
  fill: number,
) {
  uniforms.uProgress.value = fill;
  for (const m of [mats.liquid, mats.bristles]) {
    m.color.copy(uniforms.uPaintColor.value);
    m.metalness = uniforms.uPaintMetal.value;
  }
}

function PaintRig({ progress, shade }: { progress: RefObject<PaintProgress>; shade: Shade }) {
  const { viewport } = useThree();
  const layoutScale = Math.min(1, viewport.height / 3.8, viewport.width / 2.7);
  const quality = useQuality();
  const pointer = usePointer();

  const nailGeometry = useNailGeometry();
  const { material: nailMaterial, uniforms } = useNailMaterial(0);

  const bottleGeo = useMemo(() => createBottleGeometries(quality === "high" ? 48 : 24), [quality]);
  const brushGeo = useMemo(() => createBrushGeometries(quality === "high" ? 32 : 16), [quality]);
  const mats = useMemo(
    () => ({
      glass: new MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.04,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        transparent: true,
        opacity: 0.32,
        envMapIntensity: 1.6,
        depthWrite: false,
      }),
      liquid: new MeshPhysicalMaterial({ color: shade.hex, roughness: 0.15, clearcoat: 1 }),
      bristles: new MeshPhysicalMaterial({ color: shade.hex, roughness: 0.2, clearcoat: 1 }),
      stem: new MeshPhysicalMaterial({ color: "#D5D9DE", metalness: 1, roughness: 0.2 }),
      cap: new MeshPhysicalMaterial({
        color: "#4A1F14",
        roughness: 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
      }),
    }),
    // Initial colour only; easing happens per frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(
    () => () => {
      Object.values(bottleGeo).forEach((g) => g.dispose());
      Object.values(brushGeo).forEach((g) => g.dispose());
    },
    [bottleGeo, brushGeo],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);

  const nail = useRef<Group>(null);
  const nailTilt = useRef<Group>(null);
  const bottle = useRef<Group>(null);
  const brush = useRef<Group>(null);
  const primed = useRef(false);

  useFrame((state, delta) => {
    const p = progress.current;
    if (!p || !nail.current || !bottle.current || !brush.current || !nailTilt.current) return;

    if (!primed.current) {
      setShade(uniforms, shade);
      primed.current = true;
    }
    easeToShade(uniforms, shade, delta);
    syncPaint(uniforms, mats, p.fill);

    // Responsive composition: nail on the right, bottle low on the left.
    const s = layoutScale;
    const nailX = 0.72 * s;
    const nailY = -0.25 * s;
    const bottleX = nailX - 1.32 * s;
    const bottleY = -1.35 * s;
    const t = state.clock.elapsedTime;

    nail.current.position.set(nailX, nailY, 0);
    nail.current.scale.setScalar(NAIL_SCALE * s);
    nail.current.rotation.set(-0.12, -0.18 + smooth(p.spin) * Math.PI * 2, 0);
    nailTilt.current.rotation.x = damp(nailTilt.current.rotation.x, -pointer.current.y * 0.12, 3, delta);
    nailTilt.current.rotation.y = damp(nailTilt.current.rotation.y, pointer.current.x * 0.18, 3, delta);

    const bScale = BOTTLE_SCALE * s;
    const enter = smooth(p.bottle);
    bottle.current.position.set(bottleX, bottleY - (1 - enter) * 3.2 * s, 0.2);
    bottle.current.rotation.set(0, (1 - enter) * -1.6 + Math.sin(t * 0.6) * 0.05, (1 - enter) * 0.3);
    bottle.current.scale.setScalar(bScale);
    bottle.current.updateMatrixWorld();
    nail.current.updateMatrixWorld();

    // Brush poses (world space). Origin of the brush is the bristle tip.
    bottle.current.localToWorld(seat.set(0, 0, 0));
    bottle.current.localToWorld(lifted.set(0, LIFT_HEIGHT, 0));
    const fillV = Math.min(0.97, Math.max(0.03, p.fill));
    const sway = Math.sin(p.fill * Math.PI * 7) * 0.16 * (1 - Math.abs(fillV * 2 - 1));
    const localY = -NAIL_LENGTH / 2 + fillV * NAIL_LENGTH;
    nail.current.localToWorld(painting.set(sway, localY, nailSurfaceZ(sway, fillV) + 0.04));

    let rot = ZERO_ROT;
    let rotT = 0;
    if (p.ret > 0) {
      const a = smooth(Math.min(1, p.ret * 2));
      const b = smooth(Math.max(0, p.ret * 2 - 1));
      nail.current.localToWorld(painting.set(0, NAIL_LENGTH / 2 - 0.05, nailSurfaceZ(0, 0.97) + 0.04));
      pose.lerpVectors(painting, lifted, a).lerp(seat, b);
      pose.y += Math.sin(a * Math.PI) * 0.5 * s;
      rot = PAINT_ROT;
      rotT = 1 - a;
    } else if (p.travel > 0) {
      const a = smooth(p.travel);
      pose.lerpVectors(lifted, painting, a);
      pose.y += Math.sin(a * Math.PI) * 0.55 * s;
      rot = PAINT_ROT;
      rotT = a;
    } else {
      pose.lerpVectors(seat, lifted, smooth(p.lift));
    }
    brush.current.position.copy(pose);
    brush.current.rotation.copy(lerpEuler(ZERO_ROT, rot, rotT, euler));
    brush.current.rotation.y += bottle.current.rotation.y * (1 - rotT);
    brush.current.scale.setScalar(bScale);
    // Hide the brush until the bottle is in frame.
    brush.current.visible = p.bottle > 0.02;
  });

  return (
    <>
      <group ref={nailTilt}>
        <group ref={nail}>
          <mesh geometry={nailGeometry} material={nailMaterial} />
        </group>
      </group>

      <group ref={bottle}>
        <mesh geometry={bottleGeo.liquid} material={mats.liquid} />
        <mesh geometry={bottleGeo.glass} material={mats.glass} renderOrder={2} />
      </group>

      <group ref={brush}>
        <mesh geometry={brushGeo.bristles} material={mats.bristles} />
        <mesh geometry={brushGeo.stem} material={mats.stem} />
        <mesh geometry={brushGeo.cap} material={mats.cap} />
      </group>

      <ContactShadows
        position={[0, -1.36 * layoutScale, 0]}
        opacity={0.35}
        scale={8}
        blur={2.4}
        far={3}
        color="#4A1F14"
        resolution={quality === "high" ? 512 : 256}
        frames={quality === "high" ? Infinity : 1}
      />
    </>
  );
}

export default function PaintScene({
  active,
  progress,
  shade,
}: {
  active: boolean;
  progress: RefObject<PaintProgress>;
  shade: Shade;
}) {
  return (
    <SceneCanvas active={active}>
      <PaintRig progress={progress} shade={shade} />
    </SceneCanvas>
  );
}
