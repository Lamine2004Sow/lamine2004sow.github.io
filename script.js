// ============================================
// Loader + Hero reveal (style melboucierayane)
// ============================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const heroReveal = document.querySelector('.hero-reveal');
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
            if (heroReveal) heroReveal.classList.add('started');
        }, 500);
    }, 1200);
});

// ============================================
// Navigation
// ============================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll effect on nav
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Typewriter Effect
// ============================================
const typewriterElement = document.getElementById('typewriter');
const phrases = [
    'AI Engineer',
    'RL Researcher',
    'Optimization Specialist'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeWriter() {
    if (!typewriterElement) return;

    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause before deleting
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500; // Pause before typing next phrase
    }

    setTimeout(typeWriter, typingSpeed);
}

// Start typewriter after hero subtitle is revealed (~3s)
setTimeout(() => {
    if (typewriterElement) {
        typeWriter();
    }
}, 3000);

// ============================================
// Scroll Animations (reveal + stagger style melboucierayane)
// ============================================
const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
};

const observerReveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

function getStaggerSiblings(el) {
    const parent = el.closest('.about-quick') || el.closest('.timeline') || el.closest('.projects-grid') ||
        el.closest('.about-content') || el.closest('.skills-grid') || el.closest('.soft-skills-grid') || el.closest('.stats-grid');
    if (!parent) return [el];
    let sel = '.stat-item';
    if (el.classList.contains('about-card')) sel = '.about-card';
    else if (el.classList.contains('about-text')) sel = '.about-text';
    else if (el.classList.contains('timeline-item')) sel = '.timeline-item';
    else if (el.classList.contains('project-card')) sel = '.project-card';
    else if (el.classList.contains('skills-category')) sel = '.skills-category';
    else if (el.classList.contains('soft-skill-item')) sel = '.soft-skill-item';
    return Array.from(parent.querySelectorAll(sel));
}

const observerStagger = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const list = getStaggerSiblings(el);
        const index = list.indexOf(el);
        const delay = index * 0.1;
        el.style.transitionDelay = `${delay}s`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        observerStagger.unobserve(el);
    });
}, observerOptions);

// Section titles: reveal + underline
document.querySelectorAll('.section-title.scroll-reveal').forEach(el => {
    observerReveal.observe(el);
});

// Staggered content (same list as before, but delay by sibling index)
document.addEventListener('DOMContentLoaded', () => {
    const staggerSelectors = [
        '.project-card', '.stat-item', '.about-text', '.about-card',
        '.timeline-item', '.skills-category', '.soft-skill-item'
    ];
    staggerSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(32px)';
            el.style.transition = 'opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1), transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
            observerStagger.observe(el);
        });
    });
});

// Counter animation (stats)
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10) || 0;
        const suffix = el.dataset.suffix || '';
        const duration = 1200;
        const start = performance.now();
        function update(now) {
            const t = Math.min((now - start) / duration, 1);
            const easeOut = 1 - Math.pow(1 - t, 3);
            const value = Math.round(easeOut * target);
            el.textContent = value + suffix;
            if (t < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
    });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-counter').forEach(el => counterObserver.observe(el));

// ============================================
// Parallax Effect (optional)
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual && scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ============================================
// Form Handling (if needed in future)
// ============================================
// Placeholder for future contact form functionality

// ============================================
// Console Message
// ============================================
console.log('%c👋 Bienvenue sur mon portfolio!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cVous pouvez me contacter via les liens dans la section Contact.', 'color: #a0a0a0; font-size: 12px;');
