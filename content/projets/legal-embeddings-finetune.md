---
title: "Fine-tuning d’embeddings juridiques"
short: "EMBEDDINGS"
description: "Spécialiser un modèle d’embeddings (multilingual-e5-base) sur le droit français à partir de questions générées par LLM, avec un protocole d’évaluation fixé avant l’entraînement."
result: "11 088 paires question/article générées puis filtrées, jeu de test de 125 questions figé avant l’entraînement. Résultats finaux en cours."
date: "2026-10"
status: "en cours"
tags: ["NLP", "Embeddings", "sentence-transformers", "PyTorch", "MLflow"]
github: "https://github.com/Lamine2004Sow/legal-embeddings-finetune"
order: 4
---

Suite directe de l’agent RAG juridique : améliorer la brique de recherche en spécialisant le modèle d’embeddings sur le vocabulaire du droit.

## Données synthétiques

- **11 088 paires** question/article générées par LLM, filtrées sur 12 849 : règles (pas de numéro d’article, recouvrement lexical ≤ 0,6) puis juge LLM séparé.
- **Trois styles de questions** : situation vécue, tiers, requête courte.
- **Held-out par chapitres entiers** (10 %), et non article par article, pour éviter la fuite de vocabulaire.
- **Jeu de test de 125 questions** rédigé par un autre LLM et figé avant la génération des données d’entraînement.

## Entraînement

Fine-tuning complet sur CPU avec `CachedMultipleNegativesRankingLoss` et `NoDuplicatesBatchSampler`, sans hard negatives (en droit, ce sont souvent de faux négatifs). Le checkpoint est choisi sur le jeu de développement, jamais sur le test. Suivi MLflow.

## Évaluation prévue

Recall@k et MRR, intervalles de confiance bootstrap à 95 %, test de McNemar exact apparié, comparaison avec bge-m3, e5-small et BM25.

Projet en cours : les résultats seront publiés quand l’évaluation sera terminée.
