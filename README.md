# Portfolio - lamine2004sow.github.io

Portfolio personnel moderne et élégant avec animations fluides et design épuré.

## 🚀 Caractéristiques

- ✨ Loader animé au chargement
- 🎨 Design moderne avec mode sombre
- 📱 Responsive design (mobile-first)
- ⚡ Animations fluides et transitions
- 🎯 Navigation smooth scroll
- ⌨️ Effet typewriter sur le titre
- 🎭 Animations au scroll (Intersection Observer)

## 📁 Structure

```
lamine2004sow.github.io/
├── index.html      # Page principale
├── styles.css      # Styles et animations
├── script.js       # Interactions et animations JavaScript
└── README.md       # Documentation
```

## 🎨 Sections

1. **Hero** - Section d'accueil avec titre animé et effet typewriter
2. **À propos** - Présentation personnelle avec statistiques
3. **Projets** - Grille de projets avec cartes interactives
4. **Contact** - Liens vers réseaux sociaux et contact

## 🛠️ Technologies

- HTML5
- CSS3 (Variables CSS, Grid, Flexbox, Animations)
- JavaScript (Vanilla JS, Intersection Observer API)

## 📝 Personnalisation

### Couleurs

Modifiez les variables CSS dans `styles.css` :

```css
:root {
    --accent: #6366f1;        /* Couleur principale */
    --accent-hover: #818cf8; /* Couleur au survol */
    --bg-primary: #0a0a0a;    /* Fond principal */
    --text-primary: #ffffff;  /* Texte principal */
}
```

### Contenu

Modifiez le contenu directement dans `index.html` :
- Titre et sous-titre dans la section `.hero`
- Texte à propos dans la section `.about`
- Projets dans la section `.projects`
- Liens de contact dans la section `.contact`

### Phrases Typewriter

Modifiez le tableau `phrases` dans `script.js` :

```javascript
const phrases = [
    'AI Engineer',
    'RL Researcher',
    'Optimization Specialist'
];
```

## 🚢 Déploiement sur GitHub Pages

1. Poussez le code sur votre repository GitHub
2. Allez dans Settings → Pages
3. Sélectionnez la branche `main` comme source
4. Le site sera accessible sur `https://lamine2004sow.github.io`

## 📱 Responsive

Le site est entièrement responsive et s'adapte à :
- Mobile (< 480px)
- Tablette (< 768px)
- Desktop (> 768px)

## 🎯 Performance

- CSS optimisé avec variables CSS
- JavaScript vanilla (pas de dépendances)
- Animations CSS hardware-accelerated
- Lazy loading des animations au scroll

## 📄 Licence

Ce projet est personnel et libre d'utilisation.