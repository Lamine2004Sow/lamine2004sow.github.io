import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations(lenis) {
  if (isReducedMotion()) {
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  _heroAnimations();
  _revealAnimations();
  _navScrollEffect();
  _magneticButtons();
  _tiltCards();
  _typewriter();
  _robotBgVisibility();
}

function _heroAnimations() {
  const tl = gsap.timeline({ delay: 1.8 });

  tl.to('.hero__label', {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
  })
    .to(
      '.hero__line',
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out',
      },
      '-=0.4'
    )
    .to(
      '.hero__subtitle',
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.5'
    )
    .to(
      '.hero__cta',
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.4'
    )
    .to(
      '.hero__scroll',
      {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.2'
    );
}

function _revealAnimations() {
  const reveals = document.querySelectorAll('.reveal-up:not(.hero__label):not(.hero__line):not(.hero__cta)');

  reveals.forEach((el) => {
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        end: 'top 50%',
        toggleActions: 'play none none none',
      },
    });
  });

  document.querySelectorAll('.reveal-left').forEach((el) => {
    gsap.to(el, {
      x: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  document.querySelectorAll('.reveal-scale').forEach((el) => {
    gsap.to(el, {
      scale: 1,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  const badges = document.querySelectorAll('.about__badges .badge');
  if (badges.length) {
    gsap.to(badges, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about__badges',
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  }

  const skillCards = document.querySelectorAll('.skill-card');
  if (skillCards.length) {
    document.querySelectorAll('.skills__category').forEach((cat) => {
      const cards = cat.querySelectorAll('.skill-card');
      gsap.to(cards, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cat,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  const projectCards = document.querySelectorAll('.project-card');
  if (projectCards.length) {
    gsap.to(projectCards, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.projects__grid',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }

  const timelineItems = document.querySelectorAll('.timeline__item');
  timelineItems.forEach((item, i) => {
    gsap.to(item, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });
}

function _navScrollEffect() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  ScrollTrigger.create({
    start: 80,
    onUpdate: (self) => {
      if (self.scroll() > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    },
  });
}

function _magneticButtons() {
  const magnetics = document.querySelectorAll('.magnetic');

  magnetics.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.3;

      gsap.to(btn, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });
}

function _tiltCards() {
  const cards = document.querySelectorAll('.tilt');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotateY: x * 15,
        rotateX: -y * 15,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 600,
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    });
  });
}

function _typewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const texts = [
    'AI & ML Engineering Student',
    'Reinforcement Learning Researcher',
    'Deep Learning Enthusiast',
    'Operations Research Solver',
  ];

  let textIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pause = false;

  function type() {
    const current = texts[textIdx];

    if (pause) {
      pause = false;
      setTimeout(type, deleting ? 500 : 2000);
      return;
    }

    if (!deleting) {
      target.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        pause = true;
      }
    } else {
      target.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        textIdx = (textIdx + 1) % texts.length;
        pause = true;
      }
    }

    const speed = deleting ? 30 : 60;
    setTimeout(type, speed);
  }

  setTimeout(type, 2500);
}

function _robotBgVisibility() {
  const robotCanvas = document.querySelector('.robot-bg');
  if (!robotCanvas) return;

  ScrollTrigger.create({
    trigger: '#about',
    start: 'top 80%',
    end: 'bottom top',
    onEnter: () => robotCanvas.classList.add('visible'),
    onLeaveBack: () => robotCanvas.classList.remove('visible'),
  });
}
