export type Lang = 'fr' | 'en';

export interface CvVariant {
  lang: string;
  href: string;
}

export interface CvLink {
  label: string;
  variants: CvVariant[];
}

export interface ExperienceItem {
  title: string;
  meta: string;
  bullets: string[];
  reportLink?: boolean;
}

export interface EducationItem {
  title: string;
  meta: string;
  text: string;
}

export interface SkillItem {
  label: string;
  value: string;
}

const fr = {
  common: {
    siteName: 'Mouhamadou Lamine SOW',
    description:
      'Mouhamadou Lamine SOW — élève-ingénieur informatique, machine learning et recherche opérationnelle.',
    back: '← Retour',
    allProjects: 'Tous les projets →',
    readReport: 'Lire le rapport de stage →',
    reportLink: 'Rapport de stage →',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    codeLink: 'GitHub ↗',
    demoLink: 'Démo ↗',
    cv: 'CV',
    cvLabel: 'CV :',
    langSwitch: 'Langue',
    mainNav: 'Navigation principale',
    availability: 'Stage de fin d’études · 6 mois · dès mars 2027',
    footer: '© 2026 Mouhamadou Lamine SOW',
  },
  nav: {
    home: 'Accueil',
    projets: 'Projets',
    rapports: 'Rapport de stage',
  },
  intros: {
    projets: 'Projets de machine learning et d’optimisation.',
    rapports: 'Rapports issus de mes stages.',
  },
  jokes: {
    home: 'Il y a 10 types de recruteurs : ceux qui comprennent le binaire, et les autres. Bienvenue aux deux.',
    projets: 'J’ai demandé à Gurobi de résoudre mes problèmes. Il m’a répondu : infeasible.',
    footer: '0 ligne de JavaScript, 0 « undefined is not a function ». Coïncidence ?',
  },
  notFound: {
    title: 'Page introuvable',
    text: 'Cette adresse n’existe pas ou a été déplacée. Vous pouvez revenir à l’accueil.',
    back: 'Retour à l’accueil →',
    jokes: [
      'Le solveur a exploré toutes les branches. Cette page n’est dans aucune.',
      'Cette page a été supprimée par un rm -rf un peu trop enthousiaste.',
      'Ce n’est pas un bug, c’est une fonctionnalité non documentée.',
    ],
  },
  home: {
    subtitle: 'Élève-ingénieur informatique — Machine learning et recherche opérationnelle',
    intro:
      'Élève-ingénieur en dernière année à Sup Galilée (Université Sorbonne Paris Nord), à l’interface du machine learning et de la recherche opérationnelle : prédire avec des modèles de ML, puis décider avec la PLNE et les métaheuristiques. Mis en pratique chez Orange (Sonatel) et sur le challenge international ROADEF/EURO 2020 (problème réel de RTE).',
    availability: 'Disponible pour un stage de fin d’études de 6 mois dès mars 2027.',
    sections: {
      experience: 'Expérience',
      projects: 'Projets',
      education: 'Formation',
      skills: 'Compétences',
      languages: 'Langues & certification',
    },
    experience: [
      {
        title: 'Stage Machine Learning / Data Science',
        meta: 'Orange (Sonatel), Dakar, Sénégal — 05/2026 – 07/2026',
        bullets: [
          'Modèle XGBoost de prédiction des risques réseau à 6 mois : 88 % de cas à risque manqués en moins que la règle en place (PR-AUC 0,81 contre 0,28).',
          'Construction, en binôme, d’un historique du réseau fibre sur 8 ans (2018–2026) ; variables temporelles et géographiques, évaluation chronologique sans fuite de données.',
          'Calibration des probabilités et explication des prédictions (SHAP) ; extension à 4 horizons de 3 à 12 mois et cartographie des risques par zone pour la planification réseau.',
        ],
        reportLink: true,
      },
      {
        title: 'Stage d’observation — Numérique et DevOps',
        meta: 'Orange (Sonatel), Dakar, Sénégal — 07/2024 – 09/2024',
        bullets: [
          'Rédaction d’un état de l’art sur l’automatisation intelligente du DevOps ; initiation à Angular, LoopBack et MongoDB.',
        ],
      },
    ] as ExperienceItem[],
    education: [
      {
        title: 'Diplôme d’ingénieur en informatique (Bac+5, prévu en 2027)',
        meta: 'Sup Galilée, Université Sorbonne Paris Nord, Villetaneuse — 09/2024 – aujourd’hui',
        text: 'Cours clés : machine learning, deep learning, traitement d’images, fouille de textes, recherche opérationnelle, optimisation combinatoire, algorithmique.',
      },
      {
        title: 'Cycle préparatoire intégré (CPI) — MPSI',
        meta: 'ESIGELEC–ESMT, Dakar — 09/2022 – 05/2024',
        text: 'Mathématiques, physique et sciences de l’ingénieur.',
      },
    ] as EducationItem[],
    skills: [
      { label: 'Langages & données', value: 'Python, SQL, Julia, C/C++ ; pandas, NumPy, SciPy' },
      {
        label: 'Machine learning',
        value: 'scikit-learn, XGBoost ; classification déséquilibrée, validation croisée et temporelle, calibration, SHAP',
      },
      {
        label: 'Deep learning & vision',
        value: 'PyTorch, torchvision, OpenCV, scikit-image ; CNN, fine-tuning, morphologie mathématique',
      },
      { label: 'NLP', value: 'spaCy ; prétraitement, entités nommées, extraction de termes' },
      {
        label: 'Recherche opérationnelle',
        value: 'PLNE, optimisation combinatoire, métaheuristiques (recuit simulé), recherche locale ; Gurobi, CPLEX, CBC, PuLP',
      },
      { label: 'Outils', value: 'Git, Linux, pytest, Jupyter' },
    ] as SkillItem[],
    languages: 'Français : langue maternelle · Anglais : B2 (TOEIC 802)',
    certification: 'IBM AI Engineering Professional Certificate — IBM / Coursera, en cours (2026)',
  },
  cvLinks: [
    {
      label: 'Machine learning & recherche opérationnelle',
      variants: [
        { lang: 'FR', href: '/cv/cv-ml-ro-fr.pdf' },
        { lang: 'EN', href: '/cv/cv-ml-ro-en.pdf' },
      ],
    },
    {
      label: 'Data science & machine learning',
      variants: [
        { lang: 'FR', href: '/cv/cv-data-ml-fr.pdf' },
        { lang: 'EN', href: '/cv/cv-data-ml-en.pdf' },
      ],
    },
  ] as CvLink[],
};

export type Strings = typeof fr;

const en: Strings = {
  common: {
    siteName: 'Mouhamadou Lamine SOW',
    description:
      'Mouhamadou Lamine SOW — computer science engineering student, machine learning and operations research.',
    back: '← Back',
    allProjects: 'All projects →',
    readReport: 'Read the internship report →',
    reportLink: 'Internship report →',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    codeLink: 'GitHub ↗',
    demoLink: 'Demo ↗',
    cv: 'CV',
    cvLabel: 'CV:',
    langSwitch: 'Language',
    mainNav: 'Main navigation',
    availability: 'Final-year internship · 6 months · from March 2027',
    footer: '© 2026 Mouhamadou Lamine SOW',
  },
  nav: {
    home: 'Home',
    projets: 'Projects',
    rapports: 'Internship report',
  },
  intros: {
    projets: 'Machine learning and optimization projects.',
    rapports: 'Reports from my internships.',
  },
  jokes: {
    home: 'There are 10 types of recruiters: those who understand binary, and those who don’t. Both are welcome.',
    projets: 'I asked Gurobi to solve my problems. It replied: infeasible.',
    footer: '0 lines of JavaScript, 0 “undefined is not a function”. Coincidence?',
  },
  notFound: {
    title: 'Page not found',
    text: 'This address does not exist or has been moved. You can return to the home page.',
    back: 'Back to the home page →',
    jokes: [
      'The solver explored every branch. This page wasn’t in any of them.',
      'This page was removed by an overly enthusiastic rm -rf.',
      'It’s not a bug, it’s an undocumented feature.',
    ],
  },
  home: {
    subtitle: 'Computer Science Engineering Student — Machine Learning and Operations Research',
    intro:
      'Final-year engineering student at Sup Galilée, working at the intersection of machine learning and operations research: predict with ML models, then decide with MILP and metaheuristics. Applied at Orange (Sonatel) and on the international ROADEF/EURO 2020 challenge (a real RTE problem).',
    availability: 'Available for a six-month final-year internship from March 2027.',
    sections: {
      experience: 'Experience',
      projects: 'Projects',
      education: 'Education',
      skills: 'Skills',
      languages: 'Languages & certification',
    },
    experience: [
      {
        title: 'Machine Learning / Data Science Intern',
        meta: 'Orange (Sonatel), Dakar, Senegal — May 2026 – Jul 2026',
        bullets: [
          'Designed an XGBoost model predicting network risks 6 months ahead: 88 % fewer missed at-risk cases than the existing business rule (PR-AUC 0.81 vs. 0.28).',
          'Built, with a teammate, an 8-year fiber network history (2018–2026); engineered temporal and geographic features with leakage-free chronological evaluation.',
          'Calibrated probabilities and explained predictions (SHAP); extended to 4 horizons from 3 to 12 months and mapped risk by area to support network planning.',
        ],
        reportLink: true,
      },
      {
        title: 'Job-Shadowing Internship — Digital Technology and DevOps',
        meta: 'Orange (Sonatel), Dakar, Senegal — Jul 2024 – Sep 2024',
        bullets: [
          'Wrote a literature review on intelligent DevOps automation; introduction to Angular, LoopBack and MongoDB.',
        ],
      },
    ] as ExperienceItem[],
    education: [
      {
        title: 'Engineering Degree in Computer Science — Master’s level, expected 2027',
        meta: 'Sup Galilée — Université Sorbonne Paris Nord, Villetaneuse, France — Sep 2024 – Present',
        text: 'Key coursework: machine learning, deep learning, image processing, text mining, operations research, combinatorial optimization, algorithms.',
      },
      {
        title: 'Integrated Preparatory Program (CPI) — MPSI',
        meta: 'ESIGELEC–ESMT, Dakar, Senegal — Sep 2022 – May 2024',
        text: 'Mathematics, physics and engineering sciences.',
      },
    ] as EducationItem[],
    skills: [
      { label: 'Programming & Data', value: 'Python, SQL, Julia, C/C++; pandas, NumPy, SciPy' },
      {
        label: 'Machine Learning',
        value: 'scikit-learn, XGBoost; imbalanced classification, cross- and time-based validation, calibration, SHAP',
      },
      {
        label: 'Deep Learning & Vision',
        value: 'PyTorch, torchvision, OpenCV, scikit-image; CNNs, fine-tuning, mathematical morphology',
      },
      { label: 'NLP', value: 'spaCy; preprocessing, named entity recognition, term extraction' },
      {
        label: 'Operations Research',
        value: 'MILP, combinatorial optimization, metaheuristics (simulated annealing), local search; Gurobi, CPLEX, CBC, PuLP',
      },
      { label: 'Tools', value: 'Git, Linux, pytest, Jupyter' },
    ] as SkillItem[],
    languages: 'French: native · English: B2 (TOEIC 802)',
    certification: 'IBM AI Engineering Professional Certificate — IBM / Coursera, in progress (2026)',
  },
  cvLinks: [
    {
      label: 'Machine learning & operations research',
      variants: [{ lang: 'EN', href: '/cv/cv-ml-ro-en.pdf' }],
    },
    {
      label: 'Data science & machine learning',
      variants: [{ lang: 'EN', href: '/cv/cv-data-ml-en.pdf' }],
    },
  ] as CvLink[],
};

export const ui: Record<Lang, Strings> = { fr, en };
