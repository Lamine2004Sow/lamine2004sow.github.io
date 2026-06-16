window._dcProjects.push({
  id:    "p1",
  theme: { fr: "OPTIMISATION & ML", en: "OPTIMIZATION & ML" },
  year:  "2026",
  title: { fr: "Ring-Star Problem : Optimisation du Transport Public", en: "Ring-Star Problem: Public Transport Optimization" },
  blurb: { fr: "Modélisation et résolution d'un problème NP-difficile combinant p-médian et TSP pour la planification de réseaux.", en: "Modeling and solving an NP-hard problem combining p-median and TSP for network planning." },
  tags:  ["Python", "Métaheuristiques", "PLNE", "TSPlib"],

  report: {
    kicker:   "TECHNICAL REPORT · OR-2026",
    subtitle: "Solving the Ring-Star Problem via Metaheuristics and ILP",
    metaRole: "Lead Developer",
    metaYear: "2026",
    metaStack: "Python · Gurobi · Matplotlib",

    abstract: "Le problème Ring-Star (RSP) consiste à localiser un cycle (le ring) passant par un dépôt et un sous-ensemble de sommets, tout en affectant les sommets restants (les stars) à des sommets du cycle. L'objectif est de minimiser le coût total de construction du cycle et d'affectation des sommets. Ce rapport présente une formulation PLNE compacte et plusieurs approches algorithmiques allant de l'heuristique gloutonne aux métaheuristiques d'amélioration locale, évaluées sur des instances réelles de la TSPlib.",

    sections: [
      {
        n: "1", heading: "Introduction",
        paras: [
          "Le Ring-Star Problem est une structure fondamentale dans la conception de réseaux de transport et de télécommunications. Il combine deux difficultés majeures : le choix des stations à inclure dans le réseau principal (problème de localisation) et l'ordonnancement de ces stations (problème de tournées), tout en garantissant une couverture optimale du territoire.",
          "Nous avons implémenté une solution complète permettant de comparer l'efficacité des méthodes exactes (solveur PLNE) face aux approches approchées pour des instances de grande taille.",
        ],
      },
      {
        n: "2", heading: "Modélisation Mathématique",
        paras: ["La formulation PLNE repose sur des variables binaires $x_{ij}$ pour le cycle et $y_{ij}$ pour les affectations. L'objectif est de minimiser :"],
        hasEq: true,
        eq:    "\\min \\sum_{i,j \\in E} c_{ij} x_{ij} + \\sum_{i \\in V, j \\in V_{ring}} d_{ij} y_{ij}",
        eqNum: "(1)",
      },
      {
        n: "3", heading: "Résultats & Analyse",
        paras: ["Les tests sur les instances TSPlib (ex: eil51, berlin52) montrent que nos métaheuristiques randomisées atteignent des solutions à moins de 2% de l'optimalité en une fraction du temps requis par le solveur exact pour $p > 10$."],
        hasFig: true, figNote: "Visualisation d'une solution optimale sur l'instance berlin52", figCaption: "Figure 1 — Cycle optimal (bleu) et affectations (pointillés rouges) pour p=5.",
        hasTable: true,
        table: {
          head: ["Instance", "Sol. Exacte", "Heuristique", "Gap (%)"],
          rows: [["eil51", "426.3", "431.2", "1.15%"], ["berlin52", "7541.0", "7610.5", "0.92%"], ["att48", "10622.0", "10654.2", "0.30%"]],
        },
        tableCaption: "Table 1 — Performance comparée sur instances de référence.",
      },
    ],

    references: [
      { n: "[1]", text: "Labbé, M., Laporte, G., & Rodríguez-Martín, I. The ring star problem: Polyhedral analysis and exact algorithm. Networks." },
      { n: "[2]", text: "TSPlib — Library of sample instances for the TSP and related problems from various sources." },
      { n: "[3]", text: "Rapport de projet — Optimisation combinatoire, Sup Galilée 2026." },
    ],
  },
});
