import { lerp } from './utils.js';

export function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let cursor = document.querySelector('.cursor');
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<div class="cursor__dot"></div><div class="cursor__outline"></div>';
    document.body.appendChild(cursor);
  }

  const dot = cursor.querySelector('.cursor__dot');
  const outline = cursor.querySelector('.cursor__outline');
  const interactives = 'a, button, .magnetic, .skill-card, .project-card, input, textarea, .nav__burger';

  let mouseX = -100;
  let mouseY = -100;
  let outlineX = -100;
  let outlineY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  }, true);

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  }, true);

  document.querySelectorAll(interactives).forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  function animate() {
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

    outlineX = lerp(outlineX, mouseX, 0.12);
    outlineY = lerp(outlineY, mouseY, 0.12);
    outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animate);
  }

  animate();
}
