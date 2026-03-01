/* ═══════════════════════════════════════════════════════════════
   LAMINE SOW — PORTFOLIO  |  Main Script
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── UTILITIES ──────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const isMainPage = () => !!$('#hero');
const isProjectPage = () => document.body.classList.contains('project-page');

/* ══════════════════════════════════════════════════════════════
   1. LOADER
══════════════════════════════════════════════════════════════ */
const LOADER_LINES = [
  { text: '> INITIALIZING SYSTEM...',                  delay: 0,    ok: false },
  { text: '> LOADING NEURAL MODULES...',               delay: 380,  ok: true  },
  { text: '> CALIBRATING ML PIPELINES...',             delay: 760,  ok: true  },
  { text: '> CONNECTING TO AI FRAMEWORK...',           delay: 1100, ok: true  },
  { text: '> MOUNTING REINFORCEMENT LEARNING ENGINE...', delay: 1440, ok: true },
  { text: '> SYSTEM READY.',                           delay: 1800, ok: false },
  { text: '',                                          delay: 2000, ok: false },
  { text: '> WELCOME TO LAMINE SOW\'S PORTFOLIO',     delay: 2100, ok: false, ready: true },
];

function runLoader() {
  const terminal  = $('#loaderTerminal');
  const barFill   = $('#loaderBar');
  const pctBig    = $('#loaderPct');
  const pctLabel  = $('#loaderPctLabel');

  if (!terminal) return;

  let pct = 0;
  const targetDuration = 3000; // ms
  const step = 100 / (targetDuration / 40);

  // Percentage bar
  const barInterval = setInterval(() => {
    pct = Math.min(pct + step * (0.7 + Math.random() * 0.6), 100);
    const rounded = Math.floor(pct);
    barFill.style.width   = pct + '%';
    pctBig.textContent    = rounded + '%';
    pctLabel.textContent  = rounded + '%';
    if (pct >= 100) {
      clearInterval(barInterval);
      setTimeout(finishLoader, 400);
    }
  }, 40);

  // Terminal lines
  LOADER_LINES.forEach(({ text, delay, ok, ready }) => {
    setTimeout(() => {
      if (text === '') {
        const spacer = document.createElement('span');
        spacer.className = 'loader-line show';
        spacer.innerHTML = '&nbsp;';
        terminal.appendChild(spacer);
        return;
      }
      const line = document.createElement('span');
      line.className = 'loader-line' + (ok ? ' ok' : '') + (ready ? ' ready' : '');
      line.textContent = text;
      terminal.appendChild(line);
      requestAnimationFrame(() => requestAnimationFrame(() => line.classList.add('show')));
      terminal.scrollTop = terminal.scrollHeight;
    }, delay);
  });
}

function finishLoader() {
  const loader = $('#loader');
  if (!loader) return;

  // Glitch-out effect
  gsap.to(loader, {
    duration: 0.08, opacity: 0, x: 6,
    ease: 'none', repeat: 6, yoyo: true,
    onComplete() {
      gsap.to(loader, {
        duration: 0.25, opacity: 0, y: -10,
        onComplete() {
          loader.style.display = 'none';
          initSite();
        }
      });
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   2. SITE INIT (called after loader)
══════════════════════════════════════════════════════════════ */
function initSite() {
  initLenis();
  initCursor();
  initCoordTracker();
  initClock();
  initNavbar();
  initMobileMenu();
  initGSAP();

  if (isMainPage()) {
    initHeroAnimations();
    initTypewriter();
    initCounters();
    initMagneticButtons();
  }
}

/* ══════════════════════════════════════════════════════════════
   3. LENIS SMOOTH SCROLL
══════════════════════════════════════════════════════════════ */
let lenis;
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  // Use ONLY gsap.ticker — do NOT add a separate requestAnimationFrame loop
  // (double RAF would update Lenis twice per frame and break ScrollTrigger sync)
  if (typeof gsap !== 'undefined') {
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback if GSAP not loaded
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
  }
}

/* ══════════════════════════════════════════════════════════════
   4. CUSTOM CURSOR
══════════════════════════════════════════════════════════════ */
function initCursor() {
  const dot  = $('#cursorDot');
  const ring = $('#cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Smooth ring follow
  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // Hide on leave
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

/* ══════════════════════════════════════════════════════════════
   5. COORDINATE TRACKER
══════════════════════════════════════════════════════════════ */
function initCoordTracker() {
  const cX = $('#cX');
  const cY = $('#cY');
  const hcX = $('#hcX');
  const hcY = $('#hcY');

  document.addEventListener('mousemove', e => {
    const x = String(e.clientX).padStart(4, '0');
    const y = String(e.clientY).padStart(4, '0');
    if (cX) cX.textContent = x;
    if (cY) cY.textContent = y;
    if (hcX) hcX.textContent = x;
    if (hcY) hcY.textContent = y;
  });
}

/* ══════════════════════════════════════════════════════════════
   6. REAL-TIME CLOCK
══════════════════════════════════════════════════════════════ */
function initClock() {
  const clockEl = $('#footerClock');
  if (!clockEl) return;

  function tick() {
    const now    = new Date();
    const h      = String(now.getHours()).padStart(2, '0');
    const m      = String(now.getMinutes()).padStart(2, '0');
    const s      = String(now.getSeconds()).padStart(2, '0');
    const offset = -now.getTimezoneOffset() / 60;
    const tz     = offset >= 0 ? `GMT+${offset}` : `GMT${offset}`;
    clockEl.textContent = `${h}:${m}:${s} (${tz})`;
  }
  tick();
  setInterval(tick, 1000);
}

/* ══════════════════════════════════════════════════════════════
   7. NAVBAR
══════════════════════════════════════════════════════════════ */
function initNavbar() {
  const nav = $('#navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════════
   8. MOBILE MENU
══════════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const burger = $('#navBurger');
  const menu   = $('#mobileMenu');
  const close  = $('#mobileClose');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });

  if (close) {
    close.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  }
}

/* ══════════════════════════════════════════════════════════════
   9. GSAP + SCROLL TRIGGER ANIMATIONS
══════════════════════════════════════════════════════════════ */
/* Helper: is element already visible in viewport? */
function inViewport(el, threshold = 0.95) {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight * threshold && r.bottom > 0;
}

/* Helper: animate now OR on scroll depending on position */
function revealEl(el, fromVars, toVars, delayImmediate = 0) {
  if (inViewport(el)) {
    // Already visible — animate immediately (no ScrollTrigger needed)
    gsap.fromTo(el, fromVars, { ...toVars, delay: delayImmediate, scrollTrigger: null });
  } else {
    gsap.fromTo(el, fromVars, {
      ...toVars,
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        toggleActions: 'play none none none',
      },
    });
  }
}

function initGSAP() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // .reveal — fade up
  $$('.reveal').forEach((el, i) => {
    revealEl(
      el,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      Math.min(i * 0.06, 0.35)
    );
  });

  // .reveal-left — fade right
  $$('.reveal-left').forEach((el, i) => {
    revealEl(
      el,
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
      i * 0.08
    );
  });

  // .stagger-reveal grids
  $$('.stagger-reveal').forEach(container => {
    const children = [...container.children];
    if (inViewport(container)) {
      gsap.fromTo(children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }
      );
    } else {
      gsap.fromTo(children,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: container, start: 'top 88%', toggleActions: 'play none none none' },
        }
      );
    }
  });

  // .sec-marker — slide from left
  $$('.sec-marker').forEach((el, i) => {
    revealEl(
      el,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
      i * 0.05
    );
  });

  // Refresh once after setup for any edge cases
  setTimeout(() => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }, 150);
}

/* ══════════════════════════════════════════════════════════════
   10. HERO ANIMATIONS (main page only)
══════════════════════════════════════════════════════════════ */
function initHeroAnimations() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ delay: 0.1 });

  // Hero name glitch-in
  const heroName = $('.hero-name');
  if (heroName) {
    const glitches = $$('.glitch', heroName);
    tl.from(heroName, { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' });

    // Activate glitch briefly
    glitches.forEach(g => g.classList.add('active'));
    setTimeout(() => glitches.forEach(g => g.classList.remove('active')), 800);
  }

  // Hero eyebrow
  const eyebrow = $('.hero-eyebrow');
  if (eyebrow) {
    tl.from(eyebrow, { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out' }, '-=0.3');
  }

  // Decorative elements
  tl.from('.scroll-cue', { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out' }, '+=0.3');
}

/* ══════════════════════════════════════════════════════════════
   11. TYPEWRITER EFFECT
══════════════════════════════════════════════════════════════ */
const TYPEWRITER_PHRASES = [
  'AI Engineer',
  'Machine Learning',
  'Reinforcement Learning',
  'MLOps',
  'Recherche Opérationnelle',
];

function initTypewriter() {
  const target = $('#typewriterTarget');
  if (!target) return;

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function type() {
    if (paused) return;

    const phrase = TYPEWRITER_PHRASES[phraseIdx];

    if (!deleting) {
      // Typing
      charIdx++;
      target.textContent = phrase.slice(0, charIdx);
      if (charIdx === phrase.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; type(); }, 2200);
        return;
      }
      setTimeout(type, 80 + Math.random() * 30);
    } else {
      // Deleting
      charIdx--;
      target.textContent = phrase.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % TYPEWRITER_PHRASES.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 45);
    }
  }

  setTimeout(type, 800);
}

/* ══════════════════════════════════════════════════════════════
   12. COUNTER ANIMATIONS
══════════════════════════════════════════════════════════════ */
function initCounters() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  $$('[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const obj    = { val: 0 };

    gsap.to(obj, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      val: target,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate() {
        el.textContent = Math.floor(obj.val) + (el.nextElementSibling?.textContent.includes('K') ? '' : '');
      },
      onComplete() {
        el.textContent = target + (el.parentElement.querySelector('.stat-lbl')?.textContent.includes('K') ? '' : '');
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   13. MAGNETIC BUTTONS
══════════════════════════════════════════════════════════════ */
function initMagneticButtons() {
  $$('.btn, .proj-card, .nav-links a').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect   = btn.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.18;
      const dy     = (e.clientY - cy) * 0.18;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
      } else {
        btn.style.transform = '';
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   14. PROJECT PAGE INIT (called directly, no loader)
══════════════════════════════════════════════════════════════ */
function initProjectPage() {
  initCursor();
  initCoordTracker();
  initClock();
  initNavbar();
  initMobileMenu();
  initLenis();

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Page hero animation
    const tl = gsap.timeline();
    tl.from('.page-back',     { opacity: 0, x: -20,  duration: 0.5, ease: 'power2.out' })
      .from('.sec-marker',    { opacity: 0, x: -20,  duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .from('.sec-title',     { opacity: 0, y: 20,   duration: 0.6, ease: 'power3.out' }, '-=0.2')
      .from('.page-hero-tag', { opacity: 0, y: 10,   duration: 0.4, ease: 'power2.out' }, '-=0.2');

    // Project items stagger on scroll
    $$('.proj-item').forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, y: 40 },
        {
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          delay: i * 0.05,
        }
      );
    });

    // Reveal elements
    $$('.reveal').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          scrollTrigger: { trigger: el, start: 'top 90%' },
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
        }
      );
    });

    setTimeout(() => ScrollTrigger.refresh(), 100);
  }
}

/* ══════════════════════════════════════════════════════════════
   15. ENTRY POINT
══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  if (isProjectPage()) {
    // Project pages skip loader
    initProjectPage();
    return;
  }

  // Main page: run loader first
  if ($('#loader')) {
    runLoader();
    // Fallback: if loader hasn't finished in 6s, force init
    setTimeout(() => {
      const loader = $('#loader');
      if (loader && loader.style.display !== 'none') {
        loader.style.display = 'none';
        initSite();
      }
    }, 6000);
  } else {
    initSite();
  }
});
