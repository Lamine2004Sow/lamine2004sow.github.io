import { create } from 'zustand';

// Le store ne contient que des faits. La machine du perso décide comment y réagir,
// le monde dessine le résultat, les pages lisent l'URL.

export interface BubbleAction {
  label: string;
  primary?: boolean;
  run: () => void;
}

export interface Bubble {
  id: number;
  text: string;
  actions: BubbleAction[];
  /** Horodatage (performance.now) de fin d'affichage ; Infinity tant qu'il y a des choix. */
  until: number;
}

export type Hovered =
  | { kind: 'zone'; zone: number }
  | { kind: 'skill'; index: number }
  | { kind: 'hero' }
  | { kind: 'bot' }
  | null;

interface State {
  /** Zone donnée par l'URL. */
  zone: number;
  /** Slug du projet ouvert (/projets/[slug]), sinon null. */
  project: string | null;
  /** Zone dont la fenêtre est ouverte dans le monde (le perso y est arrivé). */
  panelZone: number | null;
  /** Mode classique choisi par le visiteur. */
  classic: boolean;
  /** Le monde est chargé et affiché. */
  worldOn: boolean;
  /** Pourquoi le monde ne s'affiche pas (null si tout va bien) ; retry = on peut réessayer. */
  worldIssue: { reason: string; retry: boolean } | null;
  /** Numéro de tentative : l'incrémenter remonte le monde. */
  worldAttempt: number;
  hovered: Hovered;
  /** Point survolé dans le monde (pour que le perso regarde dans cette direction). */
  hoverX: number | null;
  bubble: Bubble | null;
  setRoute: (zone: number, project: string | null) => void;
  openPanel: (zone: number) => void;
  closePanel: () => void;
  setClassic: (on: boolean) => void;
  setWorldOn: (on: boolean) => void;
  setWorldIssue: (issue: { reason: string; retry: boolean } | null) => void;
  retryWorld: () => void;
  setHovered: (h: Hovered, x?: number | null) => void;
  say: (text: string, ms?: number, actions?: BubbleAction[]) => void;
  hush: () => void;
}

let bubbleId = 0;

export const useStore = create<State>((set) => ({
  zone: 0,
  project: null,
  panelZone: null,
  classic: false,
  worldOn: false,
  worldIssue: null,
  worldAttempt: 0,
  hovered: null,
  hoverX: null,
  bubble: null,
  setRoute: (zone, project) => set({ zone, project }),
  openPanel: (zone) => set({ panelZone: zone }),
  closePanel: () => set({ panelZone: null }),
  setClassic: (classic) => {
    try {
      localStorage.setItem('classic', classic ? '1' : '0');
    } catch {}
    set({ classic });
  },
  setWorldOn: (worldOn) => set(worldOn ? { worldOn, worldIssue: null } : { worldOn }),
  setWorldIssue: (worldIssue) => set({ worldIssue }),
  retryWorld: () => set((s) => ({ worldIssue: null, classic: false, worldAttempt: s.worldAttempt + 1 })),
  setHovered: (hovered, x = null) => set({ hovered, hoverX: x }),
  say: (text, ms = 3200, actions = []) =>
    set({
      bubble: { id: ++bubbleId, text, actions, until: actions.length ? Infinity : performance.now() + ms },
    }),
  hush: () => set({ bubble: null }),
}));
