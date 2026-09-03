---
title: "Du voyageur de commerce au Ring-Star : allier PLNE et métaheuristiques"
description: "Comment concevoir des algorithmes efficaces pour un problème combinatoire NP-difficile associant un réseau en anneau et une desserte en étoile."
date: "2026-02"
tags: ["Recherche Opérationnelle", "PLNE", "Métaheuristiques", "Complexité"]
---

## Introduction

En optimisation des réseaux de télécommunication ou de transport, un problème récurrent consiste à concevoir une dorsale circulaire reliant des nœuds stratégiques, tout en raccordant les nœuds périphériques à cette dorsale. Ce problème porte le nom de **Ring-Star Problem (RSP)**.

Sur le plan théorique, le Ring-Star Problem est particulièrement riche car il se situe à la croisée de deux problèmes canoniques de la recherche opérationnelle :
- Le **Voyageur de commerce (TSP)** : recherche du cycle le plus court reliant un sous-ensemble de points.
- Le **Problème du $p$-médian** : sélection optimale de $p$ centres et affectation au plus proche voisin.

---

## Modélisation mathématique : l'art de formuler les sous-tours

La formulation en Programmation Linéaire en Nombres Entiers (PLNE) d'un cycle exige d'éliminer les "sous-tours" (cycles disjoints ne couvrant pas l'ensemble des stations sélectionnées). Deux approches classiques existent :

1. **Les contraintes de Dantzig-Fulkerson-Johnson (DFJ)** : très serrées mais en nombre exponentiel ($O(2^p)$), nécessitant un algorithme de séparation dynamique de coupes (Branch & Cut).
2. **La formulation par multiflots ou flots simples** : en injectant une unité de flot fictif par une station d'origine et en consommant une unité sur chaque station du cycle, on garantit la connexité avec un nombre polynomial de variables et de contraintes ($O(n^2)$).

Pour des instances de taille modérée (jusqu'à 50 sommets), l'approche par flot se résout très efficacement à l'aide de solveurs tels que CPLEX ou Gurobi.

---

## Pourquoi les méthodes exactes capitulent-elles ?

Lorsque le nombre de sommets $n$ dépasse une centaine et que le paramètre $p$ se situe dans la zone de difficulté maximale ($p \approx n/2$), l'arbre de Branch & Bound explose. Le temps de calcul peut passer de quelques secondes à plusieurs dizaines de minutes, voire plusieurs heures.

Pour une application d'aide à la décision interactive, l'utilisateur a besoin d'explorer plusieurs scénarios en temps réel. C'est ici qu'interviennent les **métaheuristiques**.

---

## La descente stochastique par échanges de stations

L'approche développée dans mes travaux repose sur un schéma en deux temps :

```
[Nuage de points] 
      │
      ▼
Heuristique Constructive (Partitionnement grille + Maximin)
      │
      ▼ (Solution initiale réalisable en < 10 ms)
Descente Stochastique (Échanges de stations - SWAP)
      │
      ▼ (Convergence en ~80 ms)
Solution quasi-optimale (Gap < 5 %)
```

### Mécanisme de l'échange (SWAP)
À chaque étape :
1. Une station active $s \in S$ est choisie aléatoirement (en dehors de la station de référence).
2. Un pôle non desservi $v \notin S$ la remplace.
3. Les réaffectations étoiles sont recalculées de façon vectorisée en $O(n)$.
4. Le cycle TSP sur les $p$ stations est réévalué par heuristique locale (Nearest Neighbor ou 2-opt).
5. L'échange n'est validé que s'il abaisse la valeur de la fonction objectif.

En pratique, cette stratégie permet de s'approcher à **moins de 5 % de la solution optimale prouvée par CPLEX**, tout en réduisant le temps d'exécution de 108 secondes à **0,084 seconde**.

---

## Enseignements pour l'ingénieur

Cette étude illustre un principe clé en ingénierie décisionnelle : **le solveur exact fournit la vérité terrain et la borne inférieure pour évaluer la qualité**, mais **la métaheuristique fournit la réactivité et la scalabilité nécessaires au déploiement opérationnel**.
