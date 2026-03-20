---
title: "Ring-Star Problem — Optimisation du Transport Public"
date: 2026-03-15 10:00:00 +0100
categories: [Projets, Optimisation]
tags: [python, optimisation, recherche-operationnelle, heuristiques, plne, tsp, np-difficile]
description: "Résolution d'un problème NP-difficile combinant p-médian et TSP pour l'optimisation de réseaux de transport."
---

## Contexte

Dans le cadre d'un projet d'**optimisation combinatoire**, j'ai modélisé et résolu le **Ring-Star Problem (RSP)** — un problème NP-difficile issu de la conception de réseaux de transport public.

L'objectif est de sélectionner un sous-ensemble de nœuds à relier en cycle (ring) et d'affecter les nœuds restants au nœud du cycle le plus proche (star), tout en minimisant le coût total.

## Problématique

Le RSP combine deux problèmes classiques :

- **p-médian** : sélectionner *p* centres minimisant les distances d'affectation
- **TSP** : relier ces centres en un tour de coût minimal

Formellement, il s'agit de minimiser :

$$\min \sum_{(i,j) \in E} c_{ij} x_{ij} + \sum_{i \in V} \sum_{j \in V} d_{ij} y_{ij}$$

sous contraintes de cycle hamiltonien sur les nœuds sélectionnés et d'affectation unique pour les autres.

## Solution mise en œuvre

### Architecture

```
Données (TSPlib)
    │
    ├── Heuristique constructive (glouton)
    │       └── Solution initiale rapide
    │
    ├── Amélioration itérative (2-opt, réaffectation)
    │       └── Optimisation locale
    │
    └── Formulation PLNE compacte (PuLP / OR-Tools)
            └── Solution exacte sur petites instances
```

### Technologies utilisées

| Outil | Rôle |
|-------|------|
| Python | Implémentation des algorithmes |
| NumPy | Calcul matriciel des distances |
| OR-Tools / PuLP | Solveur PLNE |
| Matplotlib | Visualisation des solutions |
| TSPlib | Instances de référence réelles |

## Méthodes implémentées

### 1. Heuristique gloutonne
Construction d'une solution initiale par sélection itérative des nœuds minimisant le coût marginal d'insertion dans le cycle.

### 2. Amélioration par voisinage
- **2-opt** sur le cycle pour éliminer les croisements
- **Réaffectation** des nœuds étoile vers le centre le plus proche
- **Randomisation** pour échapper aux minima locaux

### 3. Formulation PLNE compacte
Variables binaires $x_{ij}$ (arcs du cycle) et $y_{ij}$ (affectations étoile), avec contraintes d'élimination de sous-tours (MTZ).

## Résultats

- Analyse de performance sur instances **TSPlib** (eil51, kroA100, pr107)
- Variation du paramètre *p* (nombre de nœuds dans le cycle) de 5 à 30
- Comparaison heuristique vs PLNE en qualité de solution et temps de calcul
- Visualisation des tournées (stations en anneau, arrêts affectés en étoile)

| Instance | p | Coût heuristique | Coût PLNE | Gap |
|----------|---|-----------------|-----------|-----|
| eil51    | 10 | 478 | 461 | 3.7% |
| kroA100  | 15 | 21 430 | — | — |
| pr107    | 12 | 44 820 | — | — |

*PLNE interrompu après 10 min sur les grandes instances.*

## Code source

Le code est disponible sur GitHub : [lamine2004sow/ring-star-problem](https://github.com/lamine2004sow/ring-star-problem)

## Ce que j'ai appris

- Modéliser un problème NP-difficile réel à partir de la littérature scientifique
- Concevoir des heuristiques efficaces et analyser leur qualité par rapport à l'optimal
- Utiliser un solveur PLNE (OR-Tools) et interpréter les relaxations linéaires
- L'importance du choix du paramètre *p* sur la topologie du réseau résultant
