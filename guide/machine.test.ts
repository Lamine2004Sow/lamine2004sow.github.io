import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createActor } from 'xstate';
import { INTRO_DELAY, PANEL_DELAY, PRESENT_MS, SIT_ZONE, animFor, guideMachine } from './machine';

function start() {
  const said: string[] = [];
  const panels: (number | null)[] = [];
  const actor = createActor(
    guideMachine.provide({
      actions: {
        sayIntro: () => void said.push('intro'),
        sayZone: (_, p) => void said.push(`zone:${p.zone}`),
        sayIdle: (_, p) => void said.push(`idle:${p.i}`),
        sayPoke: () => void said.push('poke'),
        openPanel: (_, p) => void panels.push(p.zone),
        closePanel: () => void panels.push(null),
      },
    }),
  ).start();
  const anim = () => animFor(actor.getSnapshot().value, actor.getSnapshot().context);
  return { actor, said, panels, anim };
}

describe('machine du perso', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('commence assis, salue puis propose la visite', () => {
    const { actor, said, anim } = start();
    expect(anim()).toBe('assis');
    vi.advanceTimersByTime(INTRO_DELAY);
    expect(anim()).toBe('interaction');
    actor.send({ type: 'ANIM_DONE' });
    expect(anim()).toBe('parle');
    expect(said).toEqual(['intro']);
  });

  it('marche vers une zone proche, court vers une zone lointaine', () => {
    const { actor, anim } = start();
    actor.send({ type: 'NAVIGATE', zone: 1, from: 0, distance: 5 });
    expect(anim()).toBe('marche');
    actor.send({ type: 'NAVIGATE', zone: 4, from: 0, distance: 30 });
    expect(anim()).toBe('course');
  });

  it('présente la zone à l’arrivée et ouvre la fenêtre après un court délai', () => {
    const { actor, said, panels, anim } = start();
    actor.send({ type: 'NAVIGATE', zone: 2, from: 0, distance: 5 });
    actor.send({ type: 'ARRIVED' });
    expect(said).toContain('zone:2');
    expect(anim()).toBe('parle');
    vi.advanceTimersByTime(PANEL_DELAY);
    expect(panels.at(-1)).toBe(2);
    vi.advanceTimersByTime(PRESENT_MS);
    expect(anim()).toBe('repos');
  });

  it('s’assoit dans la zone À propos', () => {
    const { actor, anim } = start();
    actor.send({ type: 'PRESENT', zone: SIT_ZONE });
    expect(anim()).toBe('assis');
    vi.advanceTimersByTime(PRESENT_MS);
    expect(anim()).toBe('assis');
  });

  it('garde la nouvelle destination pendant un saut et repart à la réception', () => {
    const { actor, anim } = start();
    actor.send({ type: 'NAVIGATE', zone: 1, from: 0, distance: 5 });
    actor.send({ type: 'JUMP' });
    actor.send({ type: 'NAVIGATE', zone: 3, from: 0, distance: 5 });
    expect(anim()).toBe('saut');
    expect(actor.getSnapshot().context.arriveZone).toBe(3);
    actor.send({ type: 'LANDED' });
    expect(anim()).toBe('marche');
  });

  it('s’ennuie puis s’assoit sans action', () => {
    const { actor, said, anim } = start();
    actor.send({ type: 'WAKE' });
    vi.advanceTimersByTime(14000);
    expect(said).toContain('idle:0');
    vi.advanceTimersByTime(10000);
    expect(anim()).toBe('assis');
    expect(said).toContain('idle:1');
  });

  it('réagit quand on le touche', () => {
    const { actor, said, anim } = start();
    actor.send({ type: 'WAKE' });
    actor.send({ type: 'POKE' });
    expect(anim()).toBe('interaction');
    expect(said).toContain('poke');
    actor.send({ type: 'ANIM_DONE' });
    expect(anim()).toBe('repos');
  });

  it('marche librement au clavier et s’arrête au relâchement', () => {
    const { actor, anim } = start();
    actor.send({ type: 'WALK', dir: 1, run: false });
    expect(anim()).toBe('marche');
    actor.send({ type: 'STOP' });
    expect(anim()).toBe('repos');
  });
});
