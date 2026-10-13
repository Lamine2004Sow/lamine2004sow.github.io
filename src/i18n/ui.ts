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
    allWriting: 'Toutes les rédactions →',
    readReport: 'Lire le rapport de stage →',
    reportLink: 'Rapport de stage →',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    codeLink: 'GitHub ↗',
    demoLink: 'Démo ↗',
    cv: 'CV',
    cvLabel: 'CV :',
    menu: 'Menu',
    themeToggle: 'Basculer entre thème clair et sombre',
    langSwitch: 'Langue',
    mainNav: 'Navigation principale',
    availability: 'Stage de fin d’études · 6 mois · dès mars 2027',
    footer: '© 2026 Mouhamadou Lamine SOW',
  },
  nav: {
    home: 'Accueil',
    projets: 'Projets',
    redactions: 'Rédactions',
    rapports: 'Rapport de stage',
  },
  intros: {
    projets: 'Projets de machine learning et d’optimisation.',
    redactions: 'Articles et notes techniques.',
    rapports: 'Rapports issus de mes stages.',
  },
  home: {
    subtitle: 'Élève-ingénieur informatique — Machine learning et recherche opérationnelle',
    intro:
      'Élève-ingénieur en dernière année à Sup Galilée (Université Sorbonne Paris Nord), à l’interface du machine learning et de la recherche opérationnelle. Expérience en data science chez Sonatel (groupe Orange) et projets en vision par ordinateur et en optimisation, menés avec une évaluation rigoureuse et un code reproductible.',
    availability: 'Disponible pour un stage de fin d’études de 6 mois dès mars 2027.',
    sections: {
      experience: 'Expérience',
      projects: 'Projets',
      education: 'Formation',
      skills: 'Compétences',
      languages: 'Langues & certification',
      writing: 'Écrits',
    },
    experience: [
      {
        title: 'Stage Machine Learning / Data Science',
        meta: 'Sonatel (groupe Orange), Dakar, Sénégal — 05/2026 – 07/2026',
        bullets: [
          'Modèle XGBoost de prédiction des risques de saturation à 6 mois : 88 % de faux négatifs en moins que la règle métier en place (PR-AUC 0,81 contre 0,28).',
          'Construction, en binôme, d’un historique du réseau fibre sur 8 ans (2018–2026) ; variables temporelles et géographiques, évaluation chronologique sans fuite de données.',
          'Calibration des probabilités et explication des prédictions (SHAP) ; extension à 4 horizons de 3 à 12 mois et cartographie des risques par zone pour la planification réseau.',
        ],
        reportLink: true,
      },
      {
        title: 'Stage d’observation — Numérique et DevOps',
        meta: 'Sonatel (groupe Orange), Dakar — 07/2024 – 09/2024',
        bullets: [
          'État de l’art sur l’automatisation intelligente du DevOps ; initiation à Angular, LoopBack et MongoDB.',
        ],
      },
    ] as ExperienceItem[],
    education: [
      {
        title: 'Diplôme d’ingénieur en informatique (Bac+5, prévu en 2027)',
        meta: 'Sup Galilée, Université Sorbonne Paris Nord, Villetaneuse — 09/2024 – aujourd’hui',
        text: 'Cours clés : machine learning, deep learning, NLP et Transformers, recherche opérationnelle, optimisation combinatoire, génie logiciel.',
      },
      {
        title: 'Cycle préparatoire intégré (CPI) — MPSI',
        meta: 'ESIGELEC–ESMT, Dakar — 09/2022 – 05/2024',
        text: 'Mathématiques, physique et sciences de l’ingénieur.',
      },
    ] as EducationItem[],
    skills: [
      { label: 'Langages', value: 'Python, SQL, C/C++, Julia' },
      {
        label: 'Machine learning',
        value: 'PyTorch, scikit-learn, XGBoost, pandas, NumPy ; vision par ordinateur, NLP, classification déséquilibrée',
      },
      { label: 'Optimisation', value: 'PLNE, Gurobi, CPLEX, CBC, PuLP ; métaheuristiques, recherche locale' },
      { label: 'Évaluation', value: 'validation croisée et temporelle, calibration, interprétabilité (SHAP)' },
      { label: 'Outils', value: 'Git, Linux, pytest, Jupyter' },
    ] as SkillItem[],
    languages: 'Français : langue maternelle · Anglais : B2 (TOEIC 802)',
    certification: 'IBM AI Engineering Professional Certificate — IBM / Coursera, en cours (2026)',
  },
  cvLinks: [
    {
      label: 'Machine learning',
      variants: [
        { lang: 'FR', href: '/cv/cv-ml-fr.pdf' },
        { lang: 'EN', href: '/cv/cv-ml-en.pdf' },
      ],
    },
    {
      label: 'Recherche opérationnelle',
      variants: [
        { lang: 'FR', href: '/cv/cv-ro-fr.pdf' },
        { lang: 'EN', href: '/cv/cv-ro-en.pdf' },
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
    allWriting: 'All writing →',
    readReport: 'Read the internship report →',
    reportLink: 'Internship report →',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    codeLink: 'GitHub ↗',
    demoLink: 'Demo ↗',
    cv: 'CV',
    cvLabel: 'CV:',
    menu: 'Menu',
    themeToggle: 'Switch between light and dark theme',
    langSwitch: 'Language',
    mainNav: 'Main navigation',
    availability: 'Final-year internship · 6 months · from March 2027',
    footer: '© 2026 Mouhamadou Lamine SOW',
  },
  nav: {
    home: 'Home',
    projets: 'Projects',
    redactions: 'Writing',
    rapports: 'Internship report',
  },
  intros: {
    projets: 'Machine learning and optimization projects.',
    redactions: 'Articles and technical notes.',
    rapports: 'Reports from my internships.',
  },
  home: {
    subtitle: 'Computer Science Engineering Student — Machine Learning and Operations Research',
    intro:
      'Final-year engineering student at Sup Galilée, working at the intersection of machine learning and operations research. Data science experience at Sonatel (Orange Group) and projects in computer vision and optimization, built with rigorous evaluation and reproducible code.',
    availability: 'Available for a six-month final-year internship from March 2027.',
    sections: {
      experience: 'Experience',
      projects: 'Projects',
      education: 'Education',
      skills: 'Skills',
      languages: 'Languages & certification',
      writing: 'Writing',
    },
    experience: [
      {
        title: 'Machine Learning / Data Science Intern',
        meta: 'Sonatel (Orange Group), Dakar, Senegal — May 2026 – Jul 2026',
        bullets: [
          'Designed an XGBoost model predicting network risks 6 months ahead: 88 % fewer false negatives than the existing business rule (PR-AUC 0.81 vs. 0.28).',
          'Built, with a teammate, an 8-year fiber network history (2018–2026); engineered temporal and geographic features with leakage-free chronological evaluation.',
          'Calibrated probabilities and explained predictions (SHAP); extended to 4 horizons from 3 to 12 months and mapped risk by area to support network planning.',
        ],
        reportLink: true,
      },
      {
        title: 'Job-Shadowing Internship — Digital Technology and DevOps',
        meta: 'Sonatel (Orange Group), Dakar, Senegal — Jul 2024 – Sep 2024',
        bullets: [
          'Wrote a literature review on intelligent DevOps automation; introduction to Angular, LoopBack and MongoDB.',
        ],
      },
    ] as ExperienceItem[],
    education: [
      {
        title: 'Engineering Degree in Computer Science — Master’s level, expected 2027',
        meta: 'Sup Galilée — Université Sorbonne Paris Nord, Villetaneuse, France — Sep 2024 – Present',
        text: 'Key coursework: machine learning, deep learning, NLP and Transformers, operations research, combinatorial optimization, software engineering.',
      },
      {
        title: 'Integrated Preparatory Program (CPI) — MPSI',
        meta: 'ESIGELEC–ESMT, Dakar, Senegal — Sep 2022 – May 2024',
        text: 'Mathematics, physics and engineering sciences.',
      },
    ] as EducationItem[],
    skills: [
      { label: 'Programming', value: 'Python, SQL, C/C++, Julia' },
      {
        label: 'Machine Learning',
        value: 'PyTorch, scikit-learn, XGBoost, pandas, NumPy; computer vision, NLP, imbalanced classification',
      },
      { label: 'Optimization', value: 'MILP, Gurobi, CPLEX, CBC, PuLP; metaheuristics, local search' },
      { label: 'Evaluation', value: 'Cross- and time-based validation, calibration, interpretability (SHAP)' },
      { label: 'Tools', value: 'Git, Linux, pytest, Jupyter' },
    ] as SkillItem[],
    languages: 'French: native · English: B2 (TOEIC 802)',
    certification: 'IBM AI Engineering Professional Certificate — IBM / Coursera, in progress (2026)',
  },
  cvLinks: [
    {
      label: 'Machine learning',
      variants: [{ lang: 'EN', href: '/cv/cv-ml-en.pdf' }],
    },
    {
      label: 'Operations research',
      variants: [{ lang: 'EN', href: '/cv/cv-ro-en.pdf' }],
    },
  ] as CvLink[],
};

export const ui: Record<Lang, Strings> = { fr, en };
