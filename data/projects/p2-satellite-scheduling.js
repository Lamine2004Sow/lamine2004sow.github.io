window._dcProjects.push({
  id:    "p2",
  theme: { fr: "RECHERCHE OPÉRATIONNELLE", en: "OPERATIONS RESEARCH" },
  year:  "2025",
  title: { fr: "Optimisation de la planification d'observations satellites", en: "Satellite observation scheduling optimization" },
  blurb: { fr: "Sélection et ordonnancement d'observations sous contraintes de fenêtres, d'énergie et de mémoire de bord.", en: "Selecting and scheduling observations under visibility, energy and onboard-memory constraints." },
  tags:  ["MILP", "Gurobi", "Python", "OR-Tools"],

  report: {
    kicker:    "TECHNICAL REPORT · OR-2025",
    subtitle:  "An integer-programming approach to agile Earth-observation scheduling",
    metaRole:  "Optimization & modeling",
    metaYear:  "2025",
    metaStack: "Gurobi · Python · OR-Tools",

    abstract: "We formulate the selection and ordering of imaging requests for an agile observation satellite as a mixed-integer linear program. Each candidate acquisition has a value, a visibility window and a slewing cost between consecutive targets; onboard memory and energy impose global constraints. We compare an exact solver against a greedy and a metaheuristic baseline, and report the value/time frontier.",

    sections: [
      {
        n: "1", heading: "Problem",
        paras: ["A satellite passes over many candidate targets but can only image a subset because of attitude-slewing time, energy and memory. We choose binary variables y indexed by target and time slot, maximizing total acquired value while respecting the operational constraints."],
      },
      {
        n: "2", heading: "Model",
        paras: ["Let v be the value of acquiring target s. The objective maximizes the total value of selected acquisitions subject to window, transition and resource constraints:"],
        hasEq: true,
        eq:    "\\max \\sum_{s\\in S}\\sum_{t\\in T} v_{s}\\,y_{s,t}\\quad\\text{s.t.}\\;\\sum_{t} y_{s,t}\\le 1,\\;\\; \\sum_{s} m_{s}\\,y_{s,t}\\le M",
        eqNum: "(1)",
      },
      {
        n: "3", heading: "Results",
        paras: ["The exact MILP closes the gap on medium instances within seconds and provides certified optimality; the metaheuristic reaches near-optimal value an order of magnitude faster on large instances, which matters for onboard replanning."],
        hasTable: true,
        table: {
          head: ["Method", "Value (rel.)", "Time"],
          rows: [["Greedy", "0.78", "<0.1 s"], ["Metaheuristic", "0.96", "1.2 s"], ["Exact (MILP)", "1.00", "8.4 s"]],
        },
        tableCaption: "Table 1 — Value relative to optimum vs. runtime (medium instance).",
      },
    ],

    references: [
      { n: "[1]", text: "Wolsey. Integer Programming. Wiley-Interscience." },
      { n: "[2]", text: "Lemaître et al. Selecting and scheduling observations of agile satellites. Aerospace Science and Technology." },
      { n: "[3]", text: "Project report — agile EO scheduling, engineering research project, 2025." },
    ],
  },
});
