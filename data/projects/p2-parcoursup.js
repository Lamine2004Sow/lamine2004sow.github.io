window._dcProjects.push({
  id:    "p2",
  theme: { fr: "MACHINE LEARNING", en: "MACHINE LEARNING" },
  year:  "2025",
  title: { fr: "Analyse des données Parcoursup — Académie de Créteil", en: "Parcoursup Data Analysis — Créteil Academy" },
  blurb: { fr: "Exploration et modélisation prédictive des voeux et admissions via apprentissage supervisé et non supervisé.", en: "Exploration and predictive modeling of applications and admissions via supervised and unsupervised learning." },
  tags:  ["Python", "Pandas", "Scikit-learn", "Analyse Statistique"],

  report: {
    kicker:   "TECHNICAL REPORT · ML-2025",
    subtitle: "Predictive Modeling and Statistical Analysis of Educational Data",
    metaRole: "Data Analyst / ML Engineer",
    metaYear: "2025",
    metaStack: "Python · Pandas · Scikit-learn",

    abstract: "Ce projet porte sur l'analyse multidimensionnelle des données de la plateforme Parcoursup pour l'Académie de Créteil. L'objectif était d'identifier les facteurs déterminants dans les processus d'admission et de construire un modèle capable de prédire les taux d'acceptation. Nous avons utilisé une combinaison de techniques de feature engineering, de réduction de dimension (ACP) et de régression linéaire, complétées par des tests de significativité statistique.",

    sections: [
      {
        n: "1", heading: "Analyse Exploratoire",
        paras: [
          "La première phase a consisté à nettoyer et structurer un dataset complexe comportant des variables hétérogènes (géographie, type de baccalauréat, critères sociaux). L'analyse de composantes principales (ACP) a permis de mettre en évidence les corrélations majeures entre l'attractivité des formations et leur sélectivité.",
          "Des tests du $\\chi^2$ ont été réalisés pour valider l'influence de certaines variables catégorielles sur l'issue des candidatures.",
        ],
      },
      {
        n: "2", heading: "Modélisation Prédictive",
        paras: [
          "Nous avons entraîné un modèle de régression linéaire pour estimer le taux d'admission. La performance a été évaluée par le coefficient de détermination $R^2$ :",
        ],
        hasEq: true,
        eq:    "R^2 = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}",
        eqNum: "(1)",
      },
      {
        n: "3", heading: "Discussion des Résultats",
        paras: [
          "Le modèle a atteint un $R^2$ de 0.82 sur l'ensemble de test, indiquant une forte capacité prédictive. L'analyse des résidus a toutefois montré des biais sur certaines formations spécifiques, soulignant l'importance de critères non quantifiés dans les données publiques.",
        ],
        hasFig: true, figNote: "Projection des individus sur le premier plan factoriel (ACP)", figCaption: "Figure 1 — Segmentation des formations par profil de recrutement.",
        hasTable: true,
        table: {
          head: ["Modèle", "MSE", "R²"],
          rows: [["Régression Linéaire", "0.045", "0.82"], ["Forêt Aléatoire (test)", "0.038", "0.85"]],
        },
        tableCaption: "Table 1 — Comparaison des performances de régression.",
      },
    ],

    references: [
      { n: "[1]", text: "Open Data Parcoursup — Ministère de l'Enseignement supérieur et de la Recherche." },
      { n: "[2]", text: "James, G., et al. An Introduction to Statistical Learning. Springer." },
      { n: "[3]", text: "Rapport de projet — Analyse de données et Statistique, 2025." },
    ],
  },
});
