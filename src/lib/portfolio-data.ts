import {
  Brain,
  TrendingUp,
  Eye,
  Shield,
  Network,
  Database,
  Code2,
  GitBranch,
  type LucideIcon,
} from 'lucide-react'

export type Project = {
  name: string
  title: string
  description: string
  longDescription: string
  icon: LucideIcon
  tags: string[]
  url: string
  stars: number
  status?: 'Projet futur' | 'Prochain projet'
  category: 'Machine Learning' | 'Optimisation' | 'IA & Vision' | 'Big Data'
  accent: string
}

export const projects: Project[] = [
  {
    name: 'stock-index-return-prediction-gradient-descent',
    title: 'Stock Index Return Prediction — Gradient Descent',
    description:
      "Futur projet de prédiction des rendements d'indices boursiers à l'aide d'une régression implémentée from scratch avec descente de gradient.",
    longDescription:
      "Ce sera le premier projet à démarrer : une implémentation from scratch d'un algorithme de descente de gradient pour prédire les rendements d'un indice boursier. Le dépôt contient actuellement la documentation et la préparation du projet.",
    icon: TrendingUp,
    tags: ['Python', 'NumPy', 'Gradient Descent', 'Finance', 'Régression'],
    url: 'https://github.com/Lamine2004Sow/stock-index-return-prediction-gradient-descent',
    stars: 1,
    status: 'Prochain projet',
    category: 'Machine Learning',
    accent: 'amber',
  },
  {
    name: 'credit-risk-classification-optimization',
    title: 'Credit Risk Classification & Loan Optimization',
    description:
      "Futur système d'aide à la décision combinant Machine Learning et Recherche Opérationnelle pour classifier le risque de crédit et optimiser un portefeuille de prêts.",
    longDescription:
      "Projet futur qui classifiera les demandeurs de prêt selon leur risque de défaut, puis utilisera un modèle d'optimisation pour sélectionner un portefeuille de prêts rentable sous contraintes financières et de risque. Le dépôt contient actuellement uniquement la présentation du projet.",
    icon: Shield,
    tags: ['Python', 'Scikit-learn', 'PuLP', 'Optimisation', 'Classification'],
    url: 'https://github.com/Lamine2004Sow/credit-risk-classification-optimization',
    stars: 1,
    status: 'Projet futur',
    category: 'Machine Learning',
    accent: 'emerald',
  },
  {
    name: 'visual-product-assistant-vqa',
    title: 'Visual Product Assistant (VQA)',
    description:
      "Futur assistant visuel basé sur le Visual Question Answering pour répondre à des questions sur une image de produit.",
    longDescription:
      "Projet futur d'assistant intelligent combinant vision par ordinateur et NLP pour répondre à des questions sur des images de produits. Le dépôt contient actuellement uniquement la présentation du projet.",
    icon: Eye,
    tags: ['Python', 'PyTorch', 'VLM', 'NLP', 'Vision'],
    url: 'https://github.com/Lamine2004Sow/visual-product-assistant-vqa',
    stars: 1,
    status: 'Projet futur',
    category: 'IA & Vision',
    accent: 'emerald',
  },
  {
    name: 'ring-star',
    title: 'Ring-Star Problem — Optimisation Combinatoire',
    description:
      "Optimisation du tracé d'une ligne de métro circulaire : compromis entre coût d'infrastructure et accessibilité des usagers.",
    longDescription:
      "Projet d'optimisation combinatoire (SAÉ 2025-2026) visant à concevoir une ligne de métro circulaire en choisissant p stations parmi n pôles. Le problème combine un cycle (ring) et des liens en étoile (star) pour minimiser une fonction de coût intégrant construction et accès usagers. Problème NP-difficile résolu avec PLNE et heuristiques.",
    icon: Network,
    tags: ['Python', 'PLNE', 'Gurobi', 'Combinatoire', 'Heuristique'],
    url: 'https://github.com/Lamine2004Sow/ring-star',
    stars: 0,
    category: 'Optimisation',
    accent: 'amber',
  },
  {
    name: 'tp-bda',
    title: 'Travaux Pratiques — Big Data Analytics',
    description:
      "Ensemble de travaux pratiques sur le Big Data : traitement distribué, requêtes sur larges volumes, pipelines de données.",
    longDescription:
      "Travaux pratiques du module Big Data Analytics : manipulation de jeux de données massifs, requêtes SQL avancées, pipelines de traitement, et introduction aux frameworks distribués. Le projet couvre les fondamentaux de l'ingénierie de la donnée à l'échelle.",
    icon: Database,
    tags: ['Python', 'SQL', 'Pandas', 'Spark', 'Big Data'],
    url: 'https://github.com/Lamine2004Sow/tp-bda',
    stars: 0,
    category: 'Big Data',
    accent: 'emerald',
  },
  {
    name: 'qse',
    title: 'QSE — Qualité Sécurité Environnement',
    description:
      "Application web pour la gestion Qualité, Sécurité et Environnement : suivi des indicateurs et tableau de bord.",
    longDescription:
      "Projet web HTML/CSS/JS pour la gestion QSE (Qualité, Sécurité, Environnement) : suivi d'indicateurs, tableau de bord interactif, et reporting. Le projet met l'accent sur l'UX claire pour des utilisateurs non techniques.",
    icon: Code2,
    tags: ['HTML', 'CSS', 'JavaScript', 'Dashboard', 'UX'],
    url: 'https://github.com/Lamine2004Sow/qse',
    stars: 0,
    category: 'Optimisation',
    accent: 'amber',
  },
]

export type SkillCategory = {
  title: string
  icon: LucideIcon
  skills: { name: string; level: number }[]
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Machine Learning & IA',
    icon: Brain,
    skills: [
      { name: 'Scikit-learn', level: 88 },
      { name: 'PyTorch', level: 75 },
      { name: 'Classification', level: 85 },
      { name: 'Régression', level: 85 },
      { name: 'Vision par Ordinateur', level: 72 },
      { name: 'NLP / VLM', level: 70 },
    ],
  },
  {
    title: 'Optimisation & Recherche Opérationnelle',
    icon: Network,
    skills: [
      { name: 'PLNE (PuLP / Gurobi)', level: 80 },
      { name: 'Optimisation Combinatoire', level: 78 },
      { name: 'Descente de Gradient', level: 82 },
      { name: 'Heuristiques', level: 72 },
      { name: 'Analyse de complexité', level: 75 },
    ],
  },
  {
    title: 'Programmation & Data',
    icon: Code2,
    skills: [
      { name: 'Python', level: 92 },
      { name: 'SQL', level: 80 },
      { name: 'Pandas / NumPy', level: 88 },
      { name: 'Spark / Big Data', level: 65 },
      { name: 'Git / GitHub', level: 85 },
      { name: 'HTML / CSS / JS', level: 78 },
    ],
  },
  {
    title: 'Outils & Méthodologie',
    icon: GitBranch,
    skills: [
      { name: 'Jupyter / Notebooks', level: 90 },
      { name: 'Matplotlib / Seaborn', level: 85 },
      { name: "Analyse de données", level: 88 },
      { name: 'Visualisation', level: 80 },
      { name: 'Rédaction scientifique', level: 82 },
    ],
  },
]

export const githubStats = {
  publicRepos: 8,
  followers: 2,
  following: 5,
  stars: 3,
  joinedYear: 2025,
}

export const timeline = [
  {
    year: '2025 — Présent',
    title: 'Université Sorbonne Paris Nord — Sup Galilée',
    subtitle: 'Étudiant Ingénieur en IA/ML · Optimisation',
    description:
      "Formation en ingénierie avec spécialisation en IA et Machine Learning. Cours couvrant le Machine Learning, la Recherche Opérationnelle, le Big Data et la vision par ordinateur. Projets appliqués en finance, classification de risque et optimisation combinatoire.",
    tags: ['IA/ML', 'Optimisation', 'Big Data'],
  },
  {
    year: '2026',
    title: 'SAÉ Optimisation — Problème Ring-Star',
    subtitle: 'Projet académique',
    description:
      "Conception d'une ligne de métro circulaire (problème NP-difficile) : modélisation PLNE, heuristiques, compromis coût d'infrastructure vs accessibilité. Rédaction d'un rapport scientifique complet.",
    tags: ['PLNE', 'Combinatoire', 'Gurobi'],
  },
  {
    year: '2025 — 2026',
    title: 'Projets ML appliqués à la finance',
    subtitle: 'Travaux personnels',
    description:
      "Prédiction de rendements boursiers par descente de gradient (from scratch), classification de risque de crédit couplée à un modèle d'optimisation de portefeuille de prêts.",
    tags: ['Finance', 'Gradient Descent', 'PuLP'],
  },
  {
    year: 'Avril 2025',
    title: 'Début du parcours GitHub',
    subtitle: 'Open source & projets personnels',
    description:
      "Création du compte GitHub et publication progressive de projets académiques et personnels autour de l'IA/ML, et du développement web.",
    tags: ['GitHub', 'Open Source'],
  },
]
