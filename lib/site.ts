// Données du site partagées par les pages (rendu serveur) et le monde 3D (client).
// Les faits viennent de la banque de faits du CV : ne rien ajouter qui n'y soit pas.

export const PROFILE = {
  name: 'Mouhamadou Lamine SOW',
  shortName: 'Lamine',
  title: 'Élève-ingénieur informatique · Machine learning & recherche opérationnelle',
  availability: 'Stage de fin d’études · 6 mois · dès mars 2027',
  location: 'Paris, France',
  email: 'lamine.2004pro.sow@gmail.com',
  github: 'https://github.com/Lamine2004Sow',
  linkedin: 'https://www.linkedin.com/in/mouhamadou-lamine-sow-118097334',
  site: 'https://lamine-sow.me',
};

// CV général (le même que sur LinkedIn), copié depuis my_resume/LinkedIn_public_CV-AI-Engineer.
export const CV = { label: 'AI Engineer · stage de fin d’études', href: '/cv/CV_Lamine_SOW_AI-Engineer.pdf' };

export type ZoneId = 'accueil' | 'projets' | 'competences' | 'a-propos' | 'contact';

export interface Zone {
  id: ZoneId;
  href: string;
  label: string;
  title: string;
  /** Réplique du perso à l'arrivée dans la zone. */
  line: string;
}

// L'ordre est celui du chemin dans le monde : de gauche à droite, du jour au crépuscule.
export const ZONES: Zone[] = [
  { id: 'accueil', href: '/', label: 'ACCUEIL', title: 'Accueil', line: 'Ici, c’est mon coin. C’est là que j’entraîne mes modèles la plupart du temps.' },
  { id: 'projets', href: '/projets/', label: 'PROJETS', title: 'Projets', line: 'Ah, ça, ce sont les projets sur lesquels j’ai travaillé !' },
  { id: 'competences', href: '/competences/', label: 'COMPÉTENCES', title: 'Compétences', line: 'Mes outils flottent ici. Clique sur un cube, je t’en parle.' },
  { id: 'a-propos', href: '/a-propos/', label: 'À PROPOS', title: 'À propos', line: 'Assieds-toi deux minutes, je te raconte mon parcours.' },
  { id: 'contact', href: '/contact/', label: 'CONTACT', title: 'Contact', line: 'Dernière étape ! Je cherche un stage de fin d’études : on en parle ?' },
];

export function zoneFromPath(pathname: string): number {
  const first = pathname.split('/').filter(Boolean)[0];
  const i = ZONES.findIndex((z) => z.id === first);
  return i < 0 ? 0 : i;
}

/** Cubes flottants de la zone Compétences : libellé court (sur le cube) et réplique du perso. */
export const SKILL_CUBES: [string, string][] = [
  ['PYTHON', 'Python : mon langage de tous les jours, du notebook à l’API FastAPI.'],
  ['TORCH', 'PyTorch : un ResNet-18 adapté à 10 015 images de peau pour DermTriage.'],
  ['XGB', 'XGBoost : mon modèle de risque réseau chez Orange (Sonatel), PR-AUC 0,81.'],
  ['RAG', 'LangGraph, FAISS et BM25 : mon agent juridique qui vérifie ses citations.'],
  ['K8S', 'Kubernetes, MLflow, Prometheus : une plateforme MLOps qui se répare toute seule.'],
  ['GUROBI', 'Gurobi : de la PLNE pour RTE (ROADEF 2020) et pour des tournées électriques.'],
  ['C++', 'C++17 : mon solveur E-VRPTW. 1 876 exécutions, 0 solution infaisable.'],
];

export const SKILL_GROUPS: { label: string; value: string }[] = [
  { label: 'Langages & données', value: 'Python, SQL (PostgreSQL), MongoDB, C/C++ (C++17), Java, Julia, TypeScript' },
  { label: 'Machine learning', value: 'scikit-learn, XGBoost, pandas, NumPy ; classification déséquilibrée, validation croisée et temporelle, calibration, SHAP' },
  { label: 'Deep learning & vision', value: 'PyTorch, ResNet, transfer learning, OpenCV, morphologie mathématique' },
  { label: 'NLP & LLM', value: 'RAG, LangGraph, FAISS, BM25, embeddings (e5), sentence-transformers, RAGAS, LLM-as-a-judge, fine-tuning' },
  { label: 'MLOps', value: 'MLflow, FastAPI, Docker, Kubernetes, Helm, Prometheus, Grafana, Evidently, GitHub Actions, Streamlit' },
  { label: 'Recherche opérationnelle', value: 'PLNE (Gurobi, CPLEX, PuLP), recuit simulé, recherche locale itérée, algorithmes génétiques' },
  { label: 'Apprentissage par renforcement', value: 'MDP, Monte Carlo, Q-learning, SARSA, REINFORCE, gymnasium (TP de cours)' },
  { label: 'Outils', value: 'Git, Linux, pytest, Jupyter, Make, CMake' },
];

export const EXPERIENCES = [
  {
    title: 'Stage Machine Learning / Data Science',
    meta: 'Orange (Sonatel), Dakar · mai – juillet 2026',
    text: 'Modèle XGBoost de prédiction des risques sur le réseau fibre à 6 mois : 88 % de faux négatifs en moins que la règle en place (PR-AUC 0,81 contre 0,28). Historique du réseau sur 8 ans construit en binôme, prédictions calibrées et expliquées (SHAP), cartes de risque par zone.',
    href: '/projets/sonatel-ftth/',
  },
  {
    title: 'Stage d’observation · Numérique et DevOps',
    meta: 'Orange (Sonatel), Dakar · juillet – septembre 2024',
    text: 'État de l’art sur l’automatisation du DevOps par l’IA ; initiation à Angular, LoopBack et MongoDB.',
  },
];

export const EDUCATION = [
  {
    title: 'Diplôme d’ingénieur en informatique (Bac+5)',
    meta: 'Sup Galilée, Université Sorbonne Paris Nord · 2024 – 2027',
    text: 'Machine learning, deep learning, recherche opérationnelle, traitement d’images, NLP, fouille de texte, IA explicable, cryptographie.',
  },
  {
    title: 'Cycle préparatoire intégré (MPSI)',
    meta: 'ESIGELEC – ESMT, Dakar · 2022 – 2024',
    text: 'Mathématiques, physique et sciences de l’ingénieur.',
  },
];

export const LANGUAGES = 'Français (langue maternelle) · Anglais B2 (TOEIC 802)';
export const CERTIFICATION = 'IBM AI Engineering Professional Certificate (Coursera, en cours)';

export const LINES = {
  intro: 'Hey ! Bienvenue dans mon petit univers. Tu veux voir ce que je construis ?',
  introLater: 'Prends ton temps. Clique sur une plateforme quand tu veux.',
  bot: 'Lui, c’est Bip. Il relance mes entraînements quand je dors.',
  project: 'Celui-là, j’en suis plutôt fier. Tout est détaillé dans la fenêtre.',
  idle: ['Tu es toujours là ?', 'Je lance un entraînement en attendant…', 'Psst, essaie de cliquer sur moi.'],
  poke: [
    'Hé ! Ça chatouille.',
    'Oh ! Tu m’as trouvé. Le modèle avait prédit 12 % de chances.',
    'Doucement, je suis en pleine descente de gradient.',
    'Pas de panique, ce n’est pas un bug. Enfin, je crois.',
  ],
};
