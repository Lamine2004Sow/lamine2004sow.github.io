import { assign, setup } from 'xstate';
import { LAST, RUN_DISTANCE, ZONE_SPOTS } from '@/world/zones';

// Machine à états du perso. Elle ne sait rien de three.js ni du DOM :
// la boucle d'animation (Guide.tsx) lui envoie ce qu'elle observe (arrivée, saut, fin d'animation)
// et lit son état pour choisir le sprite. Les effets (bulles, fenêtres) sont des actions
// nommées, fournies par Guide.tsx avec machine.provide().

export type Anim = 'repos' | 'marche' | 'course' | 'saut' | 'parle' | 'assis' | 'interaction';

export interface GuideContext {
  /** Point de passage visé (index du chemin), ou null. */
  target: number | null;
  /** Zone à présenter à l'arrivée, ou null pour une marche libre. */
  arriveZone: number | null;
  run: boolean;
  /** Marche libre au clavier (flèches maintenues). */
  walking: boolean;
  oneShot: Anim;
  talkMs: number;
  /** Zone en cours de présentation. */
  zone: number | null;
}

export type GuideEvent =
  | { type: 'NAVIGATE'; zone: number; from: number; distance: number }
  | { type: 'PRESENT'; zone: number }
  | { type: 'WALK'; dir: 1 | -1; run: boolean }
  | { type: 'STOP' }
  | { type: 'ARRIVED' }
  | { type: 'JUMP' }
  | { type: 'LANDED' }
  | { type: 'ANIM_DONE' }
  | { type: 'POKE' }
  | { type: 'HOP' }
  | { type: 'CHEER' }
  | { type: 'TALK'; ms: number }
  | { type: 'WAKE' }
  | { type: 'LATER' };

export const INTRO_DELAY = 2300;
export const PANEL_DELAY = 650;
export const PRESENT_MS = 3600;
/** Zone où le perso s'assoit au lieu de parler debout. */
export const SIT_ZONE = 3;

export const guideMachine = setup({
  types: {} as { context: GuideContext; events: GuideEvent },
  actions: {
    sayIntro: () => {},
    sayZone: (_, _params: { zone: number | null }) => {},
    sayIdle: (_, _params: { i: number }) => {},
    sayPoke: () => {},
    sayProject: () => {},
    openPanel: (_, _params: { zone: number | null }) => {},
    closePanel: () => {},
    hush: () => {},
  },
  delays: {
    intro: INTRO_DELAY,
    talk: ({ context }) => context.talkMs,
  },
  guards: {
    sitsHere: ({ context }) => context.zone === SIT_ZONE,
    hasZone: ({ context }) => context.arriveZone != null,
    stillWalking: ({ context }) => context.walking,
    hasTarget: ({ context }) => context.target != null,
  },
}).createMachine({
  id: 'guide',
  initial: 'intro',
  context: { target: null, arriveZone: null, run: false, walking: false, oneShot: 'interaction', talkMs: 2800, zone: null },
  on: {
    NAVIGATE: {
      target: '.navigating',
      actions: [
        'hush',
        'closePanel',
        assign(({ event }) => ({
          target: ZONE_SPOTS[event.zone],
          arriveZone: event.zone,
          run: event.distance > RUN_DISTANCE,
          walking: false,
          zone: null,
        })),
      ],
    },
    PRESENT: {
      target: '.presenting',
      actions: assign(({ event }) => ({ target: null, arriveZone: null, walking: false, zone: event.zone })),
    },
    WALK: {
      target: '.walking',
      actions: [
        'hush',
        'closePanel',
        assign(({ event }) => ({ target: event.dir > 0 ? LAST : 0, arriveZone: null, run: event.run, walking: true, zone: null })),
      ],
    },
  },
  states: {
    intro: {
      initial: 'seated',
      on: {
        WAKE: '#guide.idle',
        POKE: '#guide.idle',
      },
      states: {
        seated: { after: { intro: 'greeting' } },
        greeting: {
          entry: assign({ oneShot: 'interaction' }),
          on: { ANIM_DONE: 'waiting' },
        },
        waiting: { entry: 'sayIntro', on: { WAKE: undefined, POKE: undefined, LATER: '#guide.idle' } },
      },
    },
    idle: {
      initial: 'fresh',
      states: {
        fresh: { after: { 14000: 'bored' } },
        bored: { entry: { type: 'sayIdle', params: { i: 0 } }, after: { 10000: '#guide.resting' } },
      },
      on: {
        POKE: { target: '#guide.oneshot', actions: ['sayPoke', assign({ oneShot: 'interaction' })] },
        HOP: { target: 'oneshot', actions: assign({ oneShot: 'saut' }) },
        CHEER: { target: 'oneshot', actions: ['sayProject', assign({ oneShot: 'interaction' })] },
        TALK: { target: 'talking', actions: assign(({ event }) => ({ talkMs: event.ms })) },
      },
    },
    resting: {
      initial: 'bored',
      states: {
        bored: { entry: { type: 'sayIdle', params: { i: 1 } }, after: { 21000: 'later' } },
        settled: { after: { 30000: 'later' } },
        later: { entry: { type: 'sayIdle', params: { i: 2 } } },
      },
      on: {
        POKE: { target: '#guide.oneshot', actions: ['sayPoke', assign({ oneShot: 'interaction' })] },
        CHEER: { target: 'oneshot', actions: ['sayProject', assign({ oneShot: 'interaction' })] },
        TALK: { target: 'talking', actions: assign(({ event }) => ({ talkMs: event.ms })) },
      },
    },
    presenting: {
      entry: [{ type: 'sayZone', params: ({ context }) => ({ zone: context.zone }) }],
      after: {
        [PANEL_DELAY]: { actions: { type: 'openPanel', params: ({ context }) => ({ zone: context.zone }) } },
        [PRESENT_MS]: [{ guard: 'sitsHere', target: 'resting.settled' }, { target: 'idle' }],
      },
      on: {
        POKE: { target: '#guide.oneshot', actions: ['sayPoke', assign({ oneShot: 'interaction' })] },
        CHEER: { target: 'oneshot', actions: ['sayProject', assign({ oneShot: 'interaction' })] },
        TALK: { target: 'talking', actions: assign(({ event }) => ({ talkMs: event.ms })) },
      },
    },
    talking: {
      after: { talk: 'idle' },
      on: {
        POKE: { target: '#guide.oneshot', actions: ['sayPoke', assign({ oneShot: 'interaction' })] },
        TALK: { target: 'talking', reenter: true, actions: assign(({ event }) => ({ talkMs: event.ms })) },
      },
    },
    oneshot: {
      on: { ANIM_DONE: { target: 'idle', actions: assign({ oneShot: 'interaction' }) } },
    },
    navigating: {
      on: {
        JUMP: 'jumping',
        ARRIVED: [
          {
            guard: 'hasZone',
            target: 'presenting',
            actions: assign(({ context }) => ({ zone: context.arriveZone, arriveZone: null, target: null })),
          },
          { target: 'idle', actions: assign({ target: null }) },
        ],
      },
    },
    walking: {
      on: {
        JUMP: 'jumping',
        STOP: { target: 'idle', actions: assign({ target: null, walking: false }) },
        ARRIVED: { target: 'idle', actions: assign({ target: null, walking: false }) },
      },
    },
    jumping: {
      on: {
        // Pendant un saut, un nouvel ordre ne fait que changer la destination : il reprend à la réception.
        NAVIGATE: {
          actions: assign(({ event }) => ({
            target: ZONE_SPOTS[event.zone],
            arriveZone: event.zone,
            run: event.distance > RUN_DISTANCE,
            walking: false,
          })),
        },
        WALK: { actions: assign(({ event }) => ({ target: event.dir > 0 ? LAST : 0, arriveZone: null, run: event.run, walking: true })) },
        STOP: { actions: assign({ walking: false, target: null }) },
        LANDED: [
          { guard: 'stillWalking', target: 'walking' },
          { guard: 'hasTarget', target: 'navigating' },
          { target: 'idle' },
        ],
      },
    },
  },
});

/** Animation à jouer pour un état donné. */
export function animFor(value: unknown, ctx: GuideContext): Anim {
  const top = typeof value === 'string' ? value : Object.keys(value as object)[0];
  const sub = typeof value === 'object' && value ? Object.values(value as object)[0] : null;
  switch (top) {
    case 'intro':
      return sub === 'seated' ? 'assis' : sub === 'greeting' ? 'interaction' : 'parle';
    case 'resting':
      return 'assis';
    case 'presenting':
      return ctx.zone === SIT_ZONE ? 'assis' : 'parle';
    case 'talking':
      return 'parle';
    case 'oneshot':
      return ctx.oneShot;
    case 'navigating':
    case 'walking':
      return ctx.run ? 'course' : 'marche';
    case 'jumping':
      return 'saut';
    default:
      return 'repos';
  }
}

/** États où l'animation courante ne boucle pas et doit signaler sa fin. */
export function isOneShot(value: unknown): boolean {
  const top = typeof value === 'string' ? value : Object.keys(value as object)[0];
  if (top === 'oneshot') return true;
  return top === 'intro' && (value as Record<string, string>).intro === 'greeting';
}
