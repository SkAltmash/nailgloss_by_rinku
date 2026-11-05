import { Color, DoubleSide, MeshPhysicalMaterial, type IUniform } from "three";
import { NAIL_LENGTH } from "./geometry";
import type { Shade } from "@/lib/data";

export interface NailUniforms {
  [key: string]: IUniform;
  uProgress: IUniform<number>;
  uBaseColor: IUniform<Color>;
  uPaintColor: IUniform<Color>;
  uPaintMetal: IUniform<number>;
  uPaintRough: IUniform<number>;
  uMinY: IUniform<number>;
  uMaxY: IUniform<number>;
}

const BARE_NAIL = "#E6B4A8";

/**
 * Glossy physical material whose colour fills the nail from cuticle (bottom)
 * to tip as `uProgress` goes 0 → 1. The fill edge is slightly wavy, like a
 * real brush stroke, and the painted area takes the shade's metalness and
 * roughness (chrome = metalness 1).
 */
export function createNailMaterial(initialProgress = 1) {
  const uniforms: NailUniforms = {
    uProgress: { value: initialProgress },
    uBaseColor: { value: new Color(BARE_NAIL) },
    uPaintColor: { value: new Color("#A3122A") },
    uPaintMetal: { value: 0 },
    uPaintRough: { value: 0.1 },
    uMinY: { value: -NAIL_LENGTH / 2 },
    uMaxY: { value: NAIL_LENGTH / 2 },
  };

  const material = new MeshPhysicalMaterial({
    color: "#ffffff",
    roughness: 0.1,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.1,
    side: DoubleSide,
  });

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uMinY;
        uniform float uMaxY;
        varying float vNailY;
        varying float vNailX;`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vNailY = (position.y - uMinY) / (uMaxY - uMinY);
        vNailX = position.x;`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uProgress;
        uniform vec3 uBaseColor;
        uniform vec3 uPaintColor;
        uniform float uPaintMetal;
        uniform float uPaintRough;
        varying float vNailY;
        varying float vNailX;`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        // Stretch progress slightly so 0 is fully bare and 1 fully painted.
        float fillLine = uProgress * 1.08 - 0.04;
        float edge = vNailY + sin(vNailX * 17.0) * 0.012 + sin(vNailX * 6.0 + 1.3) * 0.01;
        float paintMask = 1.0 - smoothstep(fillLine - 0.012, fillLine + 0.012, edge);
        diffuseColor.rgb = mix(uBaseColor, uPaintColor, paintMask);
        // A faint wet bead along the stroke edge while painting.
        float bead = (1.0 - smoothstep(0.0, 0.03, abs(edge - fillLine)))
          * step(0.01, uProgress) * (1.0 - step(0.99, uProgress));
        diffuseColor.rgb += bead * 0.06;`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        roughnessFactor = mix(0.42, uPaintRough, paintMask);`,
      )
      .replace(
        "#include <metalnessmap_fragment>",
        `#include <metalnessmap_fragment>
        metalnessFactor = uPaintMetal * paintMask;`,
      );
  };
  material.customProgramCacheKey = () => "nail-paint-v1";
  // Chrome needs brighter reflections to read as silver; scale with metalness.
  material.onBeforeRender = () => {
    material.envMapIntensity = 1.1 + uniforms.uPaintMetal.value * 1.6;
  };

  return { material, uniforms };
}

const tmp = new Color();

/** Ease the paint uniforms toward a shade. Call every frame. */
export function easeToShade(uniforms: NailUniforms, shade: Shade, delta: number, speed = 5) {
  const k = 1 - Math.exp(-delta * speed);
  uniforms.uPaintColor.value.lerp(tmp.set(shade.hex), k);
  uniforms.uPaintMetal.value += (shade.metalness - uniforms.uPaintMetal.value) * k;
  uniforms.uPaintRough.value += (shade.roughness - uniforms.uPaintRough.value) * k;
}

/** Snap uniforms to a shade immediately (first frame). */
export function setShade(uniforms: NailUniforms, shade: Shade) {
  uniforms.uPaintColor.value.set(shade.hex);
  uniforms.uPaintMetal.value = shade.metalness;
  uniforms.uPaintRough.value = shade.roughness;
}
