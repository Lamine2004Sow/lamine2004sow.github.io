'use client';

import { useEffect, useMemo, useRef } from 'react';
import { CanvasTexture, Mesh, MeshBasicMaterial, NearestFilter, PlaneGeometry, RepeatWrapping, SRGBColorSpace, Texture, TextureLoader, Vector3 } from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { createActor } from 'xstate';
import { LINES, ZONES } from '@/lib/site';
import { useStore } from '@/store';
import { rt } from '@/world/runtime';
import { PATH, RUN_SPEED, WALK_SPEED, ZONE_SPOTS, pathDist, posAt, step } from '@/world/zones';
import { type Anim, animFor, guideMachine, isOneShot } from './machine';
import sprites from './sprites.json';

type Sheet = { frames: number; durations: number[]; lift: number[] };
const SHEETS = sprites as unknown as Record<Anim, Sheet> & { _info: { frameWidth: number; frameHeight: number; groundY: number } };
const NAMES: Anim[] = ['repos', 'marche', 'course', 'saut', 'parle', 'assis', 'interaction'];
const { frameWidth: FW, frameHeight: FH, groundY: GROUND } = SHEETS._info;
/** Hauteur du perso en unités du monde. */
const PH = 1.6;
const PW = (PH * FW) / FH;

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(40,30,70,.45)');
  gr.addColorStop(1, 'rgba(40,30,70,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

export function Guide() {
  const loaded = useLoader(TextureLoader, NAMES.map((n) => `/sprites/${n}.png`));
  const textures = useMemo(() => {
    const out = {} as Record<Anim, Texture>;
    NAMES.forEach((n, i) => {
      const t = loaded[i];
      t.magFilter = NearestFilter;
      t.minFilter = NearestFilter;
      t.generateMipmaps = false;
      t.colorSpace = SRGBColorSpace;
      t.wrapS = RepeatWrapping;
      out[n] = t;
    });
    return out;
  }, [loaded]);

  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const hero = useRef<Mesh>(null);
  const shadow = useRef<Mesh>(null);
  const geo = useMemo(() => {
    const g = new PlaneGeometry(PW, PH);
    g.translate(0, PH / 2 - ((FH - GROUND - 1) * PH) / FH, 0);
    return g;
  }, []);
  const mat = useMemo(() => new MeshBasicMaterial({ map: textures.repos, alphaTest: 0.5, fog: false, toneMapped: false }), [textures]);
  const shadowMat = useMemo(() => new MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }), []);

  // État de la boucle (position sur le chemin, image courante, saut en cours).
  const g = useRef({ s: 0.25, anim: 'repos' as Anim, frame: 0, acc: 0, doneSent: false, jump: null as null | { from: number; to: number; el: number } });

  const actor = useMemo(() => {
    const st = useStore.getState;
    return createActor(
      guideMachine.provide({
        actions: {
          sayIntro: () =>
            st().say(LINES.intro, 0, [
              { label: 'EXPLORER →', primary: true, run: () => (st().hush(), rt.go(1)) },
              { label: 'JE REGARDE D’ABORD', run: () => (st().say(LINES.introLater, 3000), rt.send({ type: 'LATER' })) },
            ]),
          sayZone: (_, { zone }) => zone != null && st().say(ZONES[zone].line, zone === 3 ? 4200 : 3600),
          sayIdle: (_, { i }) => st().say(LINES.idle[i], 2800),
          sayPoke: () => st().say(pick(LINES.poke), 2400),
          sayProject: () => st().say(LINES.project, 2800),
          openPanel: (_, { zone }) => zone != null && st().openPanel(zone),
          closePanel: () => st().closePanel(),
          hush: () => st().hush(),
        },
      }),
    );
  }, []);

  useEffect(() => {
    actor.start();
    rt.send = (e) => actor.send(e);
    const st = useStore.getState();

    // Arrivée directe sur une zone (lien partagé, retour du mode classique) : pas de trajet.
    if (st.zone > 0 || rt.introDone) {
      g.current.s = ZONE_SPOTS[st.zone];
      actor.send({ type: 'PRESENT', zone: st.zone });
    }
    st.setWorldOn(true);

    const unsub = useStore.subscribe((now, prev) => {
      if (now.zone !== prev.zone) {
        actor.send({ type: 'NAVIGATE', zone: now.zone, from: g.current.s, distance: pathDist(g.current.s, ZONE_SPOTS[now.zone]) });
      } else if (now.project && now.project !== prev.project) {
        actor.send({ type: 'CHEER' });
      }
    });
    return () => {
      unsub();
      actor.stop();
      rt.send = () => {};
      useStore.getState().setWorldOn(false);
      useStore.getState().hush();
      useStore.getState().closePanel();
    };
  }, [actor]);

  // Clavier : flèches pour marcher (Maj pour courir), Espace pour sauter.
  useEffect(() => {
    const keys = { left: false, right: false, run: false };
    let held = 0;
    const update = () => {
      const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
      if (dir !== held) {
        held = dir;
        if (dir) actor.send({ type: 'WALK', dir: dir as 1 | -1, run: keys.run });
        else actor.send({ type: 'STOP' });
      }
    };
    const down = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest?.('input, textarea, select, [contenteditable]')) return;
      const onControl = !!el?.closest?.('button, a');
      const k = e.code;
      if (k === 'ArrowLeft' || k === 'ArrowRight') e.preventDefault();
      if (k === 'ArrowLeft' || k === 'KeyA') keys.left = true;
      if (k === 'ArrowRight' || k === 'KeyD') keys.right = true;
      if (k === 'ShiftLeft' || k === 'ShiftRight') keys.run = true;
      if (k === 'Space' && !onControl) {
        e.preventDefault();
        if (!e.repeat) actor.send({ type: 'HOP' });
      }
      if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'Space'].includes(k)) actor.send({ type: 'WAKE' });
      update();
    };
    const up = (e: KeyboardEvent) => {
      const k = e.code;
      if (k === 'ArrowLeft' || k === 'KeyA') keys.left = false;
      if (k === 'ArrowRight' || k === 'KeyD') keys.right = false;
      if (k === 'ShiftLeft' || k === 'ShiftRight') keys.run = false;
      update();
    };
    const blur = () => {
      keys.left = keys.right = keys.run = false;
      update();
    };
    addEventListener('keydown', down);
    addEventListener('keyup', up);
    addEventListener('blur', blur);
    return () => {
      removeEventListener('keydown', down);
      removeEventListener('keyup', up);
      removeEventListener('blur', blur);
    };
  }, [actor]);

  const head = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    const dt = Math.min(0.05, delta);
    const G = g.current;
    const snap = actor.getSnapshot();
    const value = snap.value;
    const ctx = snap.context;
    const top = typeof value === 'string' ? value : Object.keys(value)[0];
    rt.intro = top === 'intro';
    if (!rt.intro) rt.introDone = true;

    // Saut interrompu (ex. arrivée directe sur une zone) : on pose le perso à l'arrivée.
    // À faire avant le déplacement, sinon un saut qui démarre à cette image serait annulé.
    if (top !== 'jumping' && G.jump) {
      G.s = G.jump.to;
      G.jump = null;
    }

    // ---- déplacement le long du chemin
    if ((top === 'navigating' || top === 'walking') && ctx.target != null) {
      const r = step(G.s, ctx.target, ctx.run ? RUN_SPEED : WALK_SPEED, dt, rt.face);
      rt.face = r.face;
      if (r.kind === 'jump') {
        G.jump = { from: r.from, to: r.to, el: 0 };
        actor.send({ type: 'JUMP' });
      } else {
        G.s = r.s;
        if (r.arrived) actor.send({ type: 'ARRIVED' });
      }
    }

    // ---- sprite et horloge des images (durées par image du manifest)
    const anim = animFor(actor.getSnapshot().value, actor.getSnapshot().context);
    if (anim !== G.anim) {
      G.anim = anim;
      G.frame = 0;
      G.acc = 0;
      G.doneSent = false;
      mat.map = textures[anim];
      mat.needsUpdate = true;
    }
    const sheet = SHEETS[anim];
    G.acc += dt * 1000;
    while (G.acc >= sheet.durations[G.frame]) {
      G.acc -= sheet.durations[G.frame];
      G.frame++;
      if (G.frame >= sheet.frames) {
        if (anim === 'saut' && top === 'jumping') {
          G.frame = sheet.frames - 1;
          break;
        }
        if (isOneShot(actor.getSnapshot().value)) {
          G.frame = sheet.frames - 1;
          if (!G.doneSent) {
            G.doneSent = true;
            actor.send({ type: 'ANIM_DONE' });
          }
          break;
        }
        G.frame = 0;
      }
    }

    // ---- saut entre plateformes : les images en l'air portent le corps au-dessus du vide
    const pos = rt.heroPos;
    let overGap = false;
    if (top === 'jumping') {
      const J = G.jump;
      if (!J) {
        actor.send({ type: 'LANDED' });
        const p = posAt(G.s);
        pos.set(p[0], p[1], p[2]);
      } else {
        const d = sheet.durations;
        J.el += dt * 1000;
        const pre = d[0] + d[1];
        const air = d.slice(2, 8).reduce((a, b) => a + b, 0);
        const total = d.reduce((a, b) => a + b, 0);
        const u = Math.min(1, Math.max(0, (J.el - pre) / air));
        const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        const a = PATH[J.from].p;
        const b = PATH[J.to].p;
        pos.set(a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e + Math.sin(Math.PI * u) * 0.9, a[2] + (b[2] - a[2]) * e);
        overGap = u > 0.15 && u < 0.85;
        if (shadow.current) shadow.current.position.y = (u < 0.5 ? a[1] : b[1]) + 0.012;
        if (J.el >= total) {
          G.s = J.to;
          G.jump = null;
          actor.send({ type: 'LANDED' });
        }
      }
    } else {
      const p = posAt(G.s);
      pos.set(p[0], p[1], p[2]);
    }

    // ---- au repos, il regarde ce que survole le curseur
    const st = useStore.getState();
    if (top === 'idle' && st.hoverX != null) {
      if (st.hoverX > pos.x + 0.3) rt.face = 1;
      else if (st.hoverX < pos.x - 0.3) rt.face = -1;
    }
    if (top === 'presenting' || top === 'intro') rt.face = 1;

    // ---- billboard : le plan tourne sur l'axe vertical pour faire face à la caméra
    const h = hero.current;
    if (h) {
      h.position.copy(pos);
      h.rotation.y = Math.atan2(camera.position.x - pos.x, camera.position.z - pos.z);
      const map = mat.map!;
      map.repeat.set(rt.face / sheet.frames, 1);
      map.offset.x = rt.face > 0 ? G.frame / sheet.frames : (G.frame + 1) / sheet.frames;
    }
    rt.lift = (Math.max(0, sheet.lift[G.frame] || 0) * PH) / FH;
    const sh = shadow.current;
    if (sh) {
      sh.visible = !overGap;
      sh.position.x = pos.x + (anim === 'assis' ? -0.1 * rt.face : 0);
      sh.position.z = pos.z;
      if (top !== 'jumping') sh.position.y = pos.y + 0.012;
      sh.scale.setScalar(Math.max(0.4, 1 - rt.lift * 1.2));
    }

    // ---- la bulle suit la tête (élément DOM positionné à la main, sans rendu React)
    const bubble = st.bubble;
    if (bubble && performance.now() > bubble.until) st.hush();
    const el = document.getElementById('bubble');
    if (el && bubble) {
      head.set(pos.x, pos.y + 1.72 + rt.lift, pos.z).project(camera);
      const bx = (head.x * 0.5 + 0.5) * size.width;
      const by = (-head.y * 0.5 + 0.5) * size.height;
      const bw = el.offsetWidth;
      const headerBottom = (document.querySelector('header.bar')?.getBoundingClientRect().bottom ?? 0) + 22;
      el.style.left = `${Math.min(Math.max(bx, bw / 2 + 12), size.width - bw / 2 - 12)}px`;
      el.style.top = `${Math.max(by, el.offsetHeight + headerBottom)}px`;
    }
  });

  return (
    <>
      <mesh
        ref={hero}
        geometry={geo}
        material={mat}
        renderOrder={2}
        onClick={(e) => {
          e.stopPropagation();
          actor.send({ type: 'POKE' });
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          useStore.getState().setHovered({ kind: 'hero' }, e.point.x);
        }}
        onPointerOut={() => useStore.getState().setHovered(null)}
      />
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} material={shadowMat}>
        <planeGeometry args={[1.2, 0.55]} />
      </mesh>
    </>
  );
}
