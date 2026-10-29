// Géométrie du monde : une plateforme par zone et le chemin de points de passage qui les relie.
// Module pur (pas de three.js) pour pouvoir le tester sans navigateur.

export interface Platform {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
}

export const PLATFORMS: Platform[] = [
  { x: 0, y: 0, z: 0, w: 6.4, d: 4.2 },
  { x: 9.6, y: 0.9, z: -2.2, w: 6.0, d: 4.0 },
  { x: 18.6, y: 0.3, z: 0.2, w: 6.2, d: 4.4 },
  { x: 27.4, y: 1.5, z: -2.4, w: 5.6, d: 4.0 },
  { x: 36, y: 0.6, z: -0.2, w: 5.8, d: 4.2 },
];

export type Vec3 = [number, number, number];

export interface Waypoint {
  p: Vec3;
  /** Le segment qui part de ce point est un saut. */
  jump: boolean;
}

function buildPath() {
  const path: Waypoint[] = [];
  const spots: number[] = [];
  const wp = (x: number, y: number, z: number, jump = false) => path.push({ p: [x, y, z], jump });
  const p0 = PLATFORMS[0];
  wp(p0.x - 1.6, p0.y, p0.z + 0.4);
  spots[0] = 0;
  wp(p0.x + 2.7, p0.y, p0.z + 0.2, true);
  for (let i = 1; i < PLATFORMS.length; i++) {
    const p = PLATFORMS[i];
    wp(p.x - p.w / 2 + 0.4, p.y, p.z + 0.5);
    wp(p.x - 0.8, p.y, p.z + 0.6);
    spots[i] = path.length - 1;
    if (i < PLATFORMS.length - 1) wp(p.x + p.w / 2 - 0.4, p.y, p.z + 0.4, true);
  }
  return { path, spots };
}

const built = buildPath();
export const PATH = built.path;
/** Index du point de passage où le perso se tient dans chaque zone. */
export const ZONE_SPOTS = built.spots;
export const LAST = PATH.length - 1;

const dist = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
export const segLen = (i: number) => dist(PATH[i].p, PATH[i + 1].p);

/** Position sur le chemin pour une abscisse curviligne s (partie entière = segment). */
export function posAt(s: number): Vec3 {
  const i = Math.min(Math.max(Math.floor(s), 0), LAST - 1);
  const t = s - i;
  const a = PATH[i].p;
  const b = PATH[i + 1].p;
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** Longueur parcourue entre deux abscisses. */
export function pathDist(a: number, b: number): number {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  let d = 0;
  let s = lo;
  while (s < hi - 1e-6) {
    const i = Math.floor(s + 1e-6);
    const e = Math.min(hi, i + 1);
    d += (e - s) * segLen(i);
    s = e;
  }
  return d;
}

export const WALK_SPEED = 1.35;
export const RUN_SPEED = 3.1;
/** Au-delà de cette distance, le perso court au lieu de marcher. */
export const RUN_DISTANCE = 9;

export type Step =
  | { kind: 'move'; s: number; face: number; arrived: boolean }
  | { kind: 'jump'; from: number; to: number; face: number };

/**
 * Fait avancer le perso de s vers target pendant dt secondes.
 * S'arrête à chaque point de passage pour pouvoir y démarrer un saut.
 */
export function step(s: number, target: number, speed: number, dt: number, face: number): Step {
  const dir = Math.sign(target - s);
  if (dir === 0) return { kind: 'move', s, face, arrived: true };
  const seg = dir > 0 ? Math.floor(s + 1e-6) : Math.ceil(s - 1e-6) - 1;
  const atNode = Math.abs(s - Math.round(s)) < 1e-6;
  if (seg < 0 || seg >= LAST) return { kind: 'move', s, face, arrived: true };
  const dx = PATH[seg + 1].p[0] - PATH[seg].p[0];
  const nface = Math.abs(dx) > 0.05 ? Math.sign(dx) * dir : face;
  if (PATH[seg].jump && atNode) {
    const from = Math.round(s);
    return { kind: 'jump', from, to: from + dir, face: Math.sign(PATH[from + dir].p[0] - PATH[from].p[0]) || face };
  }
  let ns = s + (dir * speed * dt) / segLen(seg);
  const bound = dir > 0 ? seg + 1 : seg;
  if ((dir > 0 && ns >= bound) || (dir < 0 && ns <= bound)) ns = bound;
  if ((dir > 0 && ns >= target) || (dir < 0 && ns <= target)) ns = target;
  return { kind: 'move', s: ns, face: nface, arrived: Math.abs(ns - target) < 1e-6 };
}
