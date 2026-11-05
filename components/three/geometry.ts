import {
  BufferGeometry,
  Float32BufferAttribute,
  LatheGeometry,
  SplineCurve,
  Vector2,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/* ------------------------------------------------------------------ */
/*  Procedural almond nail                                             */
/* ------------------------------------------------------------------ */

export const NAIL_LENGTH = 2.2;
export const NAIL_WIDTH = 1.2;
const NAIL_THICKNESS = 0.05;
const WAIST = 0.36; // fraction of length where the nail is widest
const C_CURVE = 0.34; // side-to-side curvature
const ARCH = 0.1; // gentle lengthwise arch

/** Half-width (0–1) of the almond outline at v (0 = cuticle, 1 = tip). */
function halfWidth(v: number): number {
  if (v <= WAIST) {
    // Rounded cuticle: quarter ellipse.
    const t = 1 - v / WAIST;
    return Math.sqrt(Math.max(0, 1 - t * t));
  }
  // Tapers to a soft almond point.
  const t = (v - WAIST) / (1 - WAIST);
  return Math.pow(Math.cos((t * Math.PI) / 2), 0.82);
}

/** Height of the top surface at local x, normalised length v. */
export function nailSurfaceZ(x: number, v: number): number {
  const nx = x / (NAIL_WIDTH / 2);
  const along = 2 * v - 1;
  return C_CURVE * (1 - nx * nx) + ARCH * (1 - along * along);
}

function nailPoint(u: number, v: number, zOffset: number): [number, number, number] {
  const x = u * halfWidth(v) * (NAIL_WIDTH / 2);
  const y = v * NAIL_LENGTH - NAIL_LENGTH / 2;
  return [x, y, nailSurfaceZ(x, v) + zOffset];
}

function surface(segU: number, segV: number, zOffset: number, flip: boolean) {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= segV; i++) {
    const v = i / segV;
    for (let j = 0; j <= segU; j++) {
      const u = (j / segU) * 2 - 1;
      pos.push(...nailPoint(u, v, zOffset));
      uv.push(j / segU, v);
    }
  }
  const row = segU + 1;
  for (let i = 0; i < segV; i++) {
    for (let j = 0; j < segU; j++) {
      const a = i * row + j;
      const b = a + 1;
      const c = a + row;
      const d = c + 1;
      if (flip) idx.push(a, d, b, a, c, d);
      else idx.push(a, b, d, a, d, c);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Thin wall joining the top and bottom surfaces around the outline. */
function rim(segV: number) {
  const loop: Array<[number, number]> = [];
  for (let i = 0; i <= segV; i++) loop.push([-1, i / segV]);
  for (let i = segV; i >= 0; i--) loop.push([1, i / segV]);

  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  loop.forEach(([u, v], k) => {
    pos.push(...nailPoint(u, v, 0), ...nailPoint(u, v, -NAIL_THICKNESS));
    uv.push(k / loop.length, 1, k / loop.length, 0);
  });
  for (let k = 0; k < loop.length - 1; k++) {
    const p0 = k * 2;
    const q0 = p0 + 1;
    const p1 = p0 + 2;
    const q1 = p0 + 3;
    idx.push(p0, p1, q0, p1, q1, q0);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function createNailGeometry(detail: "high" | "low" = "high"): BufferGeometry {
  const segU = detail === "high" ? 40 : 20;
  const segV = detail === "high" ? 90 : 44;
  const parts = [
    surface(segU, segV, 0, false),
    surface(segU, segV, -NAIL_THICKNESS, true),
    rim(segV),
  ];
  const merged = mergeGeometries(parts, false)!;
  parts.forEach((p) => p.dispose());
  merged.computeBoundingBox();
  return merged;
}

/* ------------------------------------------------------------------ */
/*  Polish bottle + brush (LatheGeometry)                              */
/* ------------------------------------------------------------------ */

function lathe(points: Array<[number, number]>, smooth = 64, radial = 48) {
  const curve = new SplineCurve(points.map(([x, y]) => new Vector2(x, y)));
  const pts = curve.getPoints(smooth).map((p) => new Vector2(Math.max(0, p.x), p.y));
  return new LatheGeometry(pts, radial);
}

/** Glass bottle, ~1.08 tall. Neck top at y = 1.08. */
export const BOTTLE_NECK_TOP = 1.08;
export const BOTTLE_CAP_SEAT = 0.9;

export function createBottleGeometries(radial = 48) {
  const glass = lathe(
    [
      [0, 0],
      [0.4, 0],
      [0.52, 0.06],
      [0.55, 0.3],
      [0.54, 0.6],
      [0.46, 0.78],
      [0.28, 0.88],
      [0.2, 0.94],
      [0.2, BOTTLE_NECK_TOP],
      [0, BOTTLE_NECK_TOP],
    ],
    64,
    radial,
  );
  const liquid = lathe(
    [
      [0, 0.05],
      [0.38, 0.05],
      [0.47, 0.1],
      [0.5, 0.3],
      [0.49, 0.58],
      [0.42, 0.68],
      [0, 0.68],
    ],
    48,
    radial,
  );
  return { glass, liquid };
}

/**
 * Brush assembly with its origin at the bristle tip, so it can be placed
 * exactly on the nail. Cap sits on the bottle when origin is at bottle y = 0.
 */
export function createBrushGeometries(radial = 32) {
  const bristles = lathe(
    [
      [0, 0],
      [0.05, 0.02],
      [0.075, 0.12],
      [0.06, 0.26],
      [0.025, 0.3],
    ],
    24,
    radial,
  );
  const stem = lathe(
    [
      [0.022, 0.26],
      [0.022, BOTTLE_CAP_SEAT + 0.02],
    ],
    2,
    16,
  );
  const cap = lathe(
    [
      [0, BOTTLE_CAP_SEAT],
      [0.23, BOTTLE_CAP_SEAT],
      [0.25, BOTTLE_CAP_SEAT + 0.05],
      [0.25, BOTTLE_CAP_SEAT + 0.6],
      [0.2, BOTTLE_CAP_SEAT + 0.66],
      [0, BOTTLE_CAP_SEAT + 0.67],
    ],
    32,
    radial,
  );
  return { bristles, stem, cap };
}
