---
title: "Analyse des données Parcoursup — Académie de Créteil"
date: 2025-06-01 10:00:00 +0100
categories: [Projets, Machine Learning]
tags: [python, pandas, numpy, scikit-learn, machine-learning, eda, acp, regression, statistiques]
description: "EDA, feature engineering, apprentissage supervisé et non supervisé sur données réelles Parcoursup."
---

## Contexte

Dans le cadre d'un module d'**analyse de données**, j'ai exploré le jeu de données Parcoursup de l'Académie de Créteil pour comprendre les facteurs influençant l'accès aux formations du supérieur.

L'objectif était d'appliquer un pipeline ML complet sur des données réelles : prétraitement, feature engineering, modélisation supervisée et non supervisée.

## Problématique

- Quels facteurs prédisent le **taux d'admission** dans une formation ?
- Existe-t-il des **profils de formations** distincts selon leurs caractéristiques ?
- Comment visualiser et expliquer ces disparités à un public non technique ?

## Pipeline mis en œuvre

```
Données brutes (CSV Parcoursup)
    │
    ├── 1. Prétraitement
    │       ├── Nettoyage (valeurs manquantes, doublons)
    │       ├── Encodage des variables catégorielles
    │       └── Normalisation (StandardScaler)
    │
    ├── 2. Feature Engineering
    │       ├── Sélection de variables (corrélation, variance)
    │       └── Création de ratios (taux de sélectivité, taux de remplissage)
    │
    ├── 3. Apprentissage supervisé
    │       └── Régression linéaire (prédiction du taux d'admission)
    │
    └── 4. Apprentissage non supervisé
            ├── ACP (réduction de dimension)
            └── Tests statistiques (χ², SciPy)
```

## Technologies utilisées

| Outil | Rôle |
|-------|------|
| Python | Langage principal |
| Pandas & NumPy | Manipulation et calcul matriciel |
| Scikit-learn | Modèles ML, preprocessing, ACP |
| SciPy | Tests statistiques (χ²) |
| Matplotlib / Seaborn | Visualisations |
| Git | Versioning |

## Résultats

### Régression linéaire supervisée

- Variables les plus corrélées au taux d'admission : capacité d'accueil, nombre de candidats, type de formation
- Score R² = **0.71** sur le jeu de test
- MSE interprété en points de pourcentage

### ACP non supervisée

- Les 2 premières composantes expliquent **68%** de la variance totale
- Identification de 3 groupes distincts de formations :
  - Très sélectives (CPGE, certaines licences)
  - Moyennement sélectives (BTS, licences professionnelles)
  - Peu sélectives (formations ouvertes)

### Tests statistiques

- Test χ² confirme l'association significative entre le type d'établissement et le taux de sélectivité (*p* < 0.001)

## Code source

Le code est disponible sur GitHub : [lamine2004sow/parcoursup-analyse](https://github.com/lamine2004sow/parcoursup-analyse)

## Ce que j'ai appris

- Travailler sur des données réelles imparfaites (valeurs manquantes, incohérences)
- Choisir et justifier les transformations de features adaptées au problème
- Interpréter les composantes d'une ACP de façon actionnable
- Articuler des résultats statistiques pour un public non spécialiste
