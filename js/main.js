import { isWebGLAvailable, isReducedMotion, isMobile } from './utils.js';
import { initSmoothScroll, scrollTo } from './smooth-scroll.js';
import { initCursor } from './cursor.js';
import { initAnimations } from './animations.js';

let heroScene = null;
let robotScene = null;
let contactScene = null;

async function init() {
  const webgl = isWebGLAvailable();
  if (!webgl) document.body.classList.add('no-webgl');

  const lenis = initSmoothScroll();
  initCursor();
  initAnimations(lenis);
  _initNavigation();
  _initContactForm();

  try {
    if (webgl) await _initScenes();
  } catch (err) {
    console.warn('Scènes 3D non initialisées:', err);
  } finally {
    _hideLoader();
  }

  // Sécurité : masquer le loader même si init bloque (ex. script en erreur)
  setTimeout(() => _hideLoader(), 5000);
}

async function _initScenes() {
  const { NeuralNetworkScene, RobotScene, ContactParticleScene } = await import('./three-scene.js');

  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) heroScene = new NeuralNetworkScene(heroCanvas);

  const robotCanvas = document.getElementById('robot-canvas');
  if (robotCanvas) robotScene = new RobotScene(robotCanvas);

  const contactCanvas = document.getElementById('contact-canvas');
  if (contactCanvas) contactScene = new ContactParticleScene(contactCanvas);
}

function _hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const minDelay = isReducedMotion() ? 200 : 1600;
  setTimeout(() => {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 600);
  }, minDelay);
}

function _initNavigation() {
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu?.querySelectorAll('.mobile-menu__link');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('active');
      mobileMenu.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks?.forEach((link) => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = anchor.getAttribute('href');
      if (target === '#') {
        scrollTo(0);
      } else {
        scrollTo(target);
      }
    });
  });
}

function _initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const action = form.getAttribute('action');
    if (!action || action.includes('YOUR_FORM_ID')) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Merci ! Message reçu ✓';
      btn.disabled = true;
      btn.style.background = 'var(--accent-dim)';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 3000);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
