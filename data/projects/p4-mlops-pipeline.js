window._dcProjects.push({
  id:    "p4",
  theme: { fr: "OPS & TEST", en: "OPS & TEST" },
  year:  "2024",
  title: { fr: "Pipeline MLOps & tests pour modèles embarqués", en: "MLOps & testing pipeline for embedded models" },
  blurb: { fr: "Reproductibilité, versionnage des données et tests automatisés pour des modèles destinés au bord.", en: "Reproducibility, data versioning and automated testing for edge-deployed models." },
  tags:  ["DVC", "MLflow", "pytest", "Docker"],

  report: {
    kicker:    "TECHNICAL REPORT · OPS-2024",
    subtitle:  "From notebook to verified, reproducible model artifacts",
    metaRole:  "Tooling & reliability",
    metaYear:  "2024",
    metaStack: "DVC · MLflow · pytest · CI",

    abstract: "We describe a pipeline that turns exploratory model code into reproducible, tested artifacts. Data and experiments are versioned, training is containerized, and a layered test suite (unit, data-validation, behavioral) gates deployment. We model expected reliability of the gating process to size the test budget.",

    sections: [
      {
        n: "1", heading: "Goals",
        paras: ["Models that ship to constrained targets must be reproducible and trustworthy. We separate data versioning, experiment tracking and a test gate so that any artifact can be rebuilt and audited."],
      },
      {
        n: "2", heading: "Reliability model",
        paras: ["Assuming independent test failures arrive at rate λ, the probability that a faulty build survives the gate up to time t decays exponentially, motivating how much test coverage is worth adding:"],
        hasEq: true,
        eq:    "R(t)=e^{-\\lambda t},\\qquad \\lambda=\\sum_{k} c_k\\,p_k",
        eqNum: "(1)",
      },
      {
        n: "3", heading: "Outcome",
        paras: ["The pipeline cut the time to reproduce a result from hours to minutes and caught regressions before deployment via behavioral tests on curated edge cases."],
        hasTable: true,
        table: {
          head: ["Stage", "Gate", "Cost"],
          rows: [["Unit", "logic", "low"], ["Data-validation", "schema / drift", "low"], ["Behavioral", "edge cases", "medium"]],
        },
        tableCaption: "Table 1 — Layered test gates before deployment.",
      },
    ],

    references: [
      { n: "[1]", text: "Sculley et al. Hidden Technical Debt in Machine Learning Systems. NeurIPS." },
      { n: "[2]", text: "Internal handbook — reproducible ML pipelines and test gates, 2024." },
    ],
  },
});
