---
title: "Du voyageur de commerce au Ring-Star : allier PLNE et métaheuristiques"
description: "Comment concevoir des algorithmes efficaces pour un problème combinatoire NP-difficile associant un réseau en anneau et une desserte en étoile."
date: "2026-02"
tags: ["Recherche Opérationnelle", "PLNE", "Métaheuristiques", "Complexité"]
---

## Introduction

En optimisation des réseaux de télécommunication ou de transport, un problème récurrent consiste à concevoir une dorsale circulaire reliant des nœuds stratégiques, tout en raccordant les nœuds périphériques à cette dorsale. Ce problème porte le nom de **Ring-Star Problem (RSP)**.

Sur le plan théorique, le Ring-Star Problem est particulièrement riche car il se situe à la croisée de deux problèmes canoniques de la recherche opérationnelle :
- Le **voyageur de commerce (TSP)** : recherche du cycle le plus court reliant un sous-ensemble de points.
- Le **problème du p-médian** : sélection optimale de `p` centres et affectation au plus proche voisin.

---

## Modélisation mathématique : l'art de formuler les sous-tours

La formulation en programmation linéaire en nombres entiers (PLNE) d'un cycle exige d'éliminer les « sous-tours » (cycles disjoints ne couvrant pas l'ensemble des stations sélectionnées). Deux approches classiques existent :

1. **Les contraintes de Dantzig-Fulkerson-Johnson (DFJ)** : très serrées mais en nombre exponentiel, elles nécessitent un algorithme de séparation dynamique de coupes (branch and cut).
2. **La formulation par flot** : en injectant un flot fictif depuis une station d'origine, avec une unité consommée sur chaque station du cycle, on garantit la connexité avec un nombre polynomial de variables et de contraintes.

Le modèle utilisé dans ce projet suit la seconde approche : des variables de flot `z` éliminent les sous-tours, et le problème est résolu avec PuLP et le solveur CBC. Les solveurs CPLEX et Gurobi sont également mentionnés comme alternatives.

---

## Pourquoi les méthodes exactes capitulent-elles ?

Lorsque la taille des instances augmente, l'arbre de branch and bound peut croître très vite, et le temps de calcul devient difficile à prévoir. Le projet a donc été conçu avec une approche exacte pour les petites instances et des heuristiques pour les instances plus grandes.

Pour une application d'aide à la décision interactive, l'utilisateur a besoin d'explorer plusieurs scénarios rapidement. C'est ici qu'interviennent les **métaheuristiques**.

---

## La descente stochastique par échanges de stations

L'approche développée dans ce projet repose sur un schéma en deux temps :

```
[Ensemble de pôles]
      │
      ▼
Heuristique gloutonne (grille + complétion Maximin + plus proche voisin)
      │
      ▼  solution initiale réalisable
Descente stochastique (échanges de stations - SWAP)
      │
      ▼  solution améliorée
Solution retenue
```

### Mécanisme de l'échange (SWAP)

À chaque étape :
1. Une station active `s` est choisie aléatoirement, hors station de référence.
2. Un pôle non desservi `v` la remplace.
3. Les affectations des pôles aux stations et le cycle sur les stations sont recalculés.
4. Le coût total est recalculé.
5. L'échange n'est retenu que s'il abaisse la valeur de la fonction objectif.

Sur les instances du projet, la recherche locale réduit les coûts de **19 %** par rapport à l'approche gloutonne, en moins d'une seconde.

---

## Enseignements pour l'ingénieur

Cette étude illustre un principe clé en ingénierie décisionnelle : **le solveur exact fournit une référence et une borne inférieure pour évaluer la qualité**, mais **la métaheuristique apporte la réactivité nécessaire à une utilisation interactive**.
