---
title: "Optimisation du Ring-Star Problem — Métro circulaire"
description: "Modélisation PLNE et métaheuristique pour la conception optimale d'une ligne de métro circulaire conciliant coût d'infrastructure et accessibilité des usagers."
date: "2026-01"
tags: ["Recherche Opérationnelle", "PLNE", "Python", "CPLEX", "Métaheuristiques"]
github: "https://github.com/Lamine2004Sow/ring-star"
---

## Contexte & Problématique

L'optimisation des réseaux de transport public constitue un défi classique et central en aménagement du territoire. Dans une agglomération, concevoir le tracé d'une ligne de métro circulaire implique d'arbitrer entre deux objectifs contradictoires :
1. **Minimiser le coût d'infrastructure et d'exploitation de la ligne** : plus le cycle comprend de stations, plus il est long et coûteux à réaliser.
2. **Minimiser la distance d'accès pour les usagers** : chaque quartier non directement desservi doit être relié à la station la plus proche (marche, bus, navette).

Le **Ring-Star Problem (RSP)** formalise exactement ce compromis : parmi $n$ pôles d'activité identifiés, on en sélectionne exactement $p$ pour y implanter une station de métro connectée en anneau (le *ring*), tandis que les $n - p$ pôles restants sont rattachés en étoile (le *star*) à leur station la plus proche.

---

## Preuve de NP-difficulté

Le problème Ring-Star est **NP-difficile**. On l'établit en montrant qu'il généralise deux problèmes d'optimisation combinatoire fondamentaux :

- **Lien avec le TSP (Voyageur de commerce)** : si $p = n$, tous les pôles sont des stations. Il n'y a plus d'affectation en étoile, et l'objectif se résume à trouver le cycle hamiltonien de coût minimal passant par tous les sommets.
- **Lien avec le problème du $p$-médian** : si $\alpha = 0$ (coût de l'anneau nul), le problème consiste à choisir $p$ centres et à affecter chaque sommet au centre le plus proche pour minimiser la somme des distances d'affectation.

Le problème Ring-Star englobant ces deux cas limites, il est NP-difficile et justifie l'exploration conjointe de méthodes exactes et de métaheuristiques.

---

## Modélisation Mathématique (PLNE)

Le modèle en Programmation Linéaire en Nombres Entiers (PLNE) a été formulé et implémenté avec **CPLEX** et **PuLP** :

### Variables de décision

- $y_{ij} \in \{0, 1\}$ : $y_{ij} = 1$ si le pôle $i$ est rattaché à la station $j$, avec $y_{jj} = 1$ si $j$ est sélectionné comme station.
- $x_{ij} \in \{0, 1\}$ : $x_{ij} = 1$ si l'arête $\{i, j\}$ fait partie du cycle circulaire (pour $i < j$).
- $z_{ij} \ge 0$ : variables de flot auxiliaires pour éliminer les sous-tours et garantir la connexité du cycle sans explosion combinatoire des contraintes.

### Fonction objectif

$$\min \quad \alpha \sum_{\{i,j\}} D_{ij} \, x_{ij} + \sum_{i,j} D_{ij} \, y_{ij}$$

où $\alpha$ contrôle le compromis entre coût du tracé et coût d'accès des usagers.

---

## Approches Algorithmiques Approchées

Face à l'explosion du temps de calcul sur des instances de grande taille ($n \ge 50$), deux algorithmes approchés ont été développés :

### 1. Heuristique Constructive (Gloutonne)
- **Partitionnement par grille spatiale** : découpage du plan pour sélectionner les stations pivots proches des barycentres locaux.
- **Complétion Maximin** : sélection séquentielle des pôles maximisant la distance minimale aux stations déjà choisies pour assurer une couverture territoriale homogène.
- **Affectation vorace & Tour TSP initial** : rattachement au plus proche voisin et construction d'un cycle par Nearest Neighbor.

### 2. Métaheuristique : Descente Stochastique par Échanges (SWAP)
- À chaque itération, une station active est échangée avec un pôle non desservi.
- Réaffectation dynamique et recalcul optimisé du cycle.
- Acceptation stricte si le coût global diminue, permettant une exploration rapide des voisinages d'instances TSPLIB (jusqu'à 70 sommets).

---

## Résultats & Performances Comparatives

Les expérimentations menées sur des instances de référence de la bibliothèque **TSPLIB** mettent en évidence des gains opérationnels majeurs :

| Métrique / Méthode | Solveur Exact (CPLEX) | Heuristique Gloutonne | Descente Stochastique |
|---|---|---|---|
| **Temps moyen d'exécution** | 108 s (jusqu'à plusieurs minutes) | **< 0,01 s** | **0,084 s** |
| **Écart moyen à l'optimum (Gap)** | 0,00 % (Optimal) | ~25 % | **4,9 %** |
| **Amélioration vs Glouton** | — | Référence | **+20,7 % à +38 %** |

> **Conclusion de l'étude** : La métaheuristique par descente stochastique permet de converger en moins d'un dixième de seconde vers des solutions à moins de 5 % de l'optimum absolu, divisant le temps de calcul par plus de **1 200** par rapport au solveur exact.
