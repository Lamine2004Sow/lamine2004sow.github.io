import { BoxGeometry, MeshStandardMaterial } from 'three';

export const mats = {
  stone: new MeshStandardMaterial({ color: '#fffcf6', roughness: 0.92 }),
  stone2: new MeshStandardMaterial({ color: '#f3ede3', roughness: 0.95 }),
  moss: new MeshStandardMaterial({ color: '#6d9a5a', roughness: 1 }),
  moss2: new MeshStandardMaterial({ color: '#8fb56e', roughness: 1 }),
  lav: new MeshStandardMaterial({ color: '#a493f2', roughness: 0.7 }),
  dark: new MeshStandardMaterial({ color: '#2a2638', roughness: 0.5 }),
};

export const unitBox = new BoxGeometry(1, 1, 1);

/** Générateur pseudo-aléatoire déterministe : le monde est identique à chaque visite. */
export function rng(seed: number) {
  return () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
}

/** Police réelle derrière une variable CSS de next/font (pour dessiner dans un canvas). */
export function cssFont(variable: string, fallback: string) {
  if (typeof document === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return v ? `${v}, ${fallback}` : fallback;
}
