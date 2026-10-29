---
title: "Agent RAG juridique avec évaluation automatique"
short: "RAG JURIDIQUE"
description: "Un agent LangGraph qui répond à des questions de droit à partir du Code civil et du Code de la consommation, cite ses sources et refuse quand il ne sait pas."
result: "Article attendu retrouvé dans 90 % des cas, 92,3 % de citations exactes, 100 % de refus corrects et 0 % de réponses à tort sur 60 questions de test."
date: "2026-10"
tags: ["LLM", "RAG", "LangGraph", "FAISS", "Évaluation"]
github: "https://github.com/Lamine2004Sow/legal-rag-agent"
order: 3
---

Agent de questions-réponses juridiques sur environ 5 100 articles du Code civil et du Code de la consommation. L’objectif n’est pas seulement de répondre, mais de **répondre juste ou se taire**, et de le prouver par une évaluation automatique.

## Architecture

- **Graphe LangGraph à enchaînement fixe** : garde-fou, reformulation, recherche, génération, vérification. Plus fiable, testable et évaluable qu’un agent qui choisit ses outils.
- **Recherche hybride** : FAISS (embeddings multilingual-e5) + BM25, fusion RRF, accès direct par numéro d’article, 8 extraits.
- **Citations vérifiées de façon déterministe** : une nouvelle tentative si une citation est invalide, puis refus. Cinq statuts de refus distincts.
- **Sécurité** : le garde-fou traite la question comme une donnée et résiste aux « ignore tes instructions ».
- **Sorties structurées** par tool calling (DeepSeek refuse le mode `json_schema`).

## Évaluation

Un banc de 60 questions étiquetées, en langage courant, avec métriques déterministes, juge LLM et RAGAS. Une suite de non-régression échoue si un prompt change sans que l’évaluation soit rejouée.

| Métrique | Résultat |
|---|---:|
| Article attendu retrouvé | 90 % (36/40) |
| Taux de réponse | 97,5 % |
| Précision des citations | 92,3 % |
| Refus corrects | 100 % (20/20) |
| Réponses à tort | 0 % |
| Détection hors-sujet / injection | 100 % |

La recherche est passée de 80 % à 90 % et le taux de réponse de 90 % à 97,5 %, sans perdre un seul refus correct. Les 8 échecs du premier run sont analysés un par un dans le dépôt.

## Stack

Python, LangGraph, FAISS, BM25, multilingual-e5, DeepSeek, RAGAS, Streamlit, pytest, Docker.
