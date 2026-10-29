import { Vector3 } from 'three';
import type { GuideEvent } from '@/guide/machine';

// État mutable partagé entre les composants du monde, lu et écrit à chaque image.
// Il ne passe pas par le store pour ne déclencher aucun rendu React.
export const rt = {
  heroPos: new Vector3(),
  face: 1,
  /** Hauteur de la tête au-dessus des pieds (saut dessiné dans les sprites). */
  lift: 0,
  /** 0 = jour, 1 = crépuscule, selon la position du perso. */
  dusk: 0,
  intro: true,
  /** L'intro a déjà été jouée : on ne la rejoue pas en revenant du mode classique. */
  introDone: false,
  reduced: false,
  touch: false,
  /** Envoie un évènement à la machine du perso (branché par Guide.tsx). */
  send: (_e: GuideEvent) => {},
  /** Va vers une zone : change l'URL, ou relance la présentation si on y est déjà. */
  go: (_zone: number) => {},
  /** Petit coup donné à un cube de compétence (index -> intensité). */
  kicks: new Map<number, number>(),
};
