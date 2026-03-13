# Lamine Sow — Portfolio Interactif 3D

Portfolio personnel avec scènes Three.js, animations GSAP ScrollTrigger, et smooth scroll Lenis.

## Stack

- **Three.js** — Scène 3D neural network (hero), modèle robot GLB, particules
- **GSAP + ScrollTrigger** — Animations scroll-driven, text reveal, magnetic buttons
- **Lenis** — Smooth scrolling
- **Vite** — Bundler de développement

## Installation

```bash
npm install
npm run dev
```

Le site sera accessible sur `http://localhost:3000`.

## Build production

```bash
npm run build
npm run preview
```

## Structure

```
├── index.html          # Page principale (toutes les sections)
├── css/
│   ├── style.css       # Styles principaux + variables
│   ├── animations.css  # Keyframes et classes d'animation
│   └── responsive.css  # Media queries (mobile, tablet, desktop)
├── js/
│   ├── main.js         # Point d'entrée, initialisation
│   ├── three-scene.js  # Scènes Three.js (hero, robot, contact)
│   ├── animations.js   # Animations GSAP + ScrollTrigger
│   ├── smooth-scroll.js# Configuration Lenis
│   ├── cursor.js       # Curseur custom
│   └── utils.js        # Utilitaires (WebGL detect, lerp, etc.)
├── assets/
│   └── robot-3d/       # Modèle 3D robot (.glb)
├── package.json
└── vite.config.js
```

## Personnalisation

1. **Infos personnelles** : modifier les textes dans `index.html`
2. **Projets** : ajouter/modifier les `<article class="project-card">` dans la section projets
3. **Couleurs** : changer les variables CSS dans `:root` de `css/style.css`
4. **Formulaire contact** : remplacer `YOUR_FORM_ID` par ton ID Formspree dans `index.html`

## Déploiement sur Vercel

1. Push le code sur GitHub
2. Va sur [vercel.com](https://vercel.com) → "Import Project"
3. Sélectionne ton repo → Framework preset : **Vite**
4. Deploy

## Déploiement sur GitHub Pages

1. Ajoute dans `vite.config.js` :
   ```js
   base: '/lamine2004sow.github.io/',
   ```
2. `npm run build`
3. Push le dossier `dist/` ou configure GitHub Actions

## Accessibilité

- Support `prefers-reduced-motion`
- Navigation au clavier
- Alt text / aria-labels
- Fallback si WebGL non supporté
