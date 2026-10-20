---
title: "Ring-Star — Optimisation d’une ligne de métro circulaire"
description: "Modélisation PLNE et heuristiques pour concevoir le tracé d’une ligne de métro circulaire, en arbitrant le coût de la boucle et la distance d’accès des usagers."
result: "Coût réduit de 19 % par rapport à l’approche gloutonne, en moins d’une seconde."
joke: "Le ring-star : un problème NP-difficile, et moi qui pensais que mon trajet du matin était compliqué."
date: "2026-01"
tags: ["Recherche opérationnelle", "PLNE", "Métaheuristiques", "Python"]
github: "https://github.com/Lamine2004Sow/ring-star"
---

Projet de SAÉ en optimisation (Université Sorbonne Paris Nord, Sup Galilée, 2025-2026) sur le **Ring-Star Problem** : concevoir une ligne de métro circulaire qui couvre un territoire à moindre coût.

## Problème

Parmi `n` pôles d’activité, il faut en choisir exactement `p` comme stations :

- les stations sont reliées par **une seule ligne circulaire** (l’anneau) ;
- chaque pôle non desservi est rattaché par un **lien en étoile** (marche, navette) à la station la plus proche.

L’objectif combine deux coûts : le coût de construction et d’exploitation de la boucle, et le coût d’accès des usagers depuis leur pôle jusqu’à leur station. Le compromis est central : plus de stations allonge le cycle, mais réduit les trajets d’accès.

Le problème est NP-difficile : il généralise le problème du voyageur de commerce (cas `p = n`, sans étoile) et le problème du p-médian (cas où le coût de l’anneau est nul).

## Modélisation (PLNE)

Le modèle en programmation linéaire en nombres entiers utilise trois familles de variables :

- `y[i][j]` binaire : vaut 1 si le pôle `i` est rattaché à la station `j` ; `y[j][j]` vaut 1 si `j` est station ;
- `x[i][j]` binaire : vaut 1 si l’arête `{i, j}` appartient au cycle (pour `i < j`) ;
- `z[i][j]` continue positive : variables de flot qui éliminent les sous-tours et assurent la connexité du cycle.

Fonction objectif, avec `D` la matrice des distances et `alpha` le poids du cycle :

```
min  alpha * somme(D[i][j] * x[i][j])  +  somme(D[i][j] * y[i][j])
```

Contraintes principales : exactement `p` stations ; affectation unique de chaque pôle ; `y[i][j] <= y[j][j]` ; station de référence fixée ; degré 2 dans le cycle pour chaque station ; connexité par le flot (`z[i][j] + z[j][i] <= (p - 1) * x[i][j]`).

Le modèle est résolu avec PuLP et les solveurs CBC, CPLEX et Gurobi.

## Heuristiques

Pour les instances plus grandes, deux méthodes approchées sont implémentées.

**1. Heuristique gloutonne.** En quatre phases :

1. partitionnement par grille : une cellule non vide fournit le pôle le plus proche de son centre ;
2. complétion Maximin : tant que le nombre de stations est inférieur à `p`, ajout du pôle dont la distance minimale aux stations déjà choisies est maximale ;
3. affectation de chaque pôle à la station la plus proche ;
4. construction du cycle sur les stations par l’algorithme du plus proche voisin, à partir de la station de référence.

**2. Descente stochastique par échanges (SWAP).** Un mouvement retire une station (hors station de référence), la remplace par un pôle non station, puis recalcule affectations, cycle et coût. Le mouvement n’est accepté que s’il diminue le coût. Cette approche n’assure pas l’optimum global, mais améliore en pratique la solution gloutonne.

## Résultats

Dans le CV, les résultats sont résumés ainsi : les heuristiques et la recherche locale réduisent les coûts de **19 %** par rapport à l’approche gloutonne, en moins d’une seconde.

## Stack

Python. Modélisation PLNE avec PuLP, résolution avec CBC, CPLEX ou Gurobi. Heuristiques et recherche locale implémentées en Python.
