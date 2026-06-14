window._dcProjects.push({
  id:    "p3",
  theme: { fr: "TAL / NLP", en: "NLP" },
  year:  "2024",
  title: { fr: "Extraction d'information sur rapports d'anomalies", en: "Information extraction from anomaly reports" },
  blurb: { fr: "Structuration automatique de rapports d'incidents techniques : entités, causes, actions correctives.", en: "Automatically structuring technical incident reports: entities, causes, corrective actions." },
  tags:  ["Transformers", "spaCy", "Python"],

  report: {
    kicker:    "TECHNICAL REPORT · NLP-2024",
    subtitle:  "Transformer-based extraction over semi-structured engineering reports",
    metaRole:  "Modeling & evaluation",
    metaYear:  "2024",
    metaStack: "Transformers · spaCy · pandas",

    abstract: "Engineering anomaly reports mix free text with implicit structure. We fine-tune a transformer encoder to tag entities (component, symptom, root cause, corrective action) and link them into structured records, enabling search and trend analysis across a corpus that was previously read manually.",

    sections: [
      {
        n: "1", heading: "Motivation",
        paras: ["Hundreds of anomaly reports accumulate over a program's life. Reading them is slow and inconsistent. A structured representation makes recurring failure modes searchable and quantifiable."],
      },
      {
        n: "2", heading: "Approach",
        paras: ["A pre-trained encoder produces contextual token representations; a tagging head assigns entity labels. The self-attention weights that mix token information are computed as:"],
        hasEq: true,
        eq:    "\\mathrm{Attention}(Q,K,V)=\\mathrm{softmax}\\!\\left(\\frac{QK^{\\top}}{\\sqrt{d_k}}\\right)V",
        eqNum: "(1)",
      },
      {
        n: "3", heading: "Evaluation",
        paras: ["On a manually annotated subset the model reaches strong entity-level F1 and surfaces the most frequent component/root-cause pairs, which were validated by domain experts."],
        hasFig: true, figNote: "co-occurrence heatmap placeholder", figCaption: "Figure 1 — Component × root-cause co-occurrence over the corpus.",
      },
    ],

    references: [
      { n: "[1]", text: "Vaswani et al. Attention Is All You Need. NeurIPS." },
      { n: "[2]", text: "Devlin et al. BERT: Pre-training of Deep Bidirectional Transformers. NAACL." },
    ],
  },
});
