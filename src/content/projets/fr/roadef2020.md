---
title: "ROADEF/EURO 2020 — Planification de la maintenance RTE"
description: "Planification des interventions de maintenance du réseau électrique de RTE sous risque incertain : glouton, recuit simulé et PLNE avec Gurobi, évalués sur les instances du challenge."
result: "Solutions à 0,52 % en moyenne de la meilleure solution connue (contre 2,83 % pour le glouton) ; optimalité prouvée sur 8 instances sur 15."
joke: "Glouton : 2,83 %. Recuit simulé : 0,52 %. Morale : ne jamais faire confiance à un algo qui a faim."
date: "2026-10"
tags: ["Recherche opérationnelle", "PLNE", "Gurobi", "Recuit simulé"]
github: "https://github.com/Lamine2004Sow/roadef2020"
---

Projet de recherche opérationnelle sur le challenge ROADEF/EURO 2020, proposé par RTE. Il s’agit de planifier les interventions de maintenance du réseau de transport d’électricité, en minimisant un risque décrit par des scénarios.

## Problème

Pour chaque intervention, il faut choisir une date de début :

- les **ressources** sont limitées par des bornes minimales et maximales par période ;
- certaines **exclusions saisonnières** interdisent des dates ;
- le **risque** est incertain et décrit par des scénarios. Le coût combine la moyenne du risque et l’excès du quantile τ sur cette moyenne.

L’objectif est de minimiser ce coût sous contraintes.

## Méthodes

1. **Glouton + réparation.** Les interventions sont triées de la plus difficile à la plus facile (tension sur les ressources, exclusions, regret). Chacune est placée à la date qui augmente le moins le coût, puis les violations de contraintes sont réparées.
2. **Recuit simulé + descente.** Part de la solution gloutonne. Les mouvements sont des déplacements locaux (±5 périodes) ou globaux, et des échanges de dates. La température est calibrée sur l’objectif, et le refroidissement est ajusté au temps limite.
3. **PLNE (Gurobi).** Modèle exact : le quantile est linéarisé par big-M, et la résolution démarre depuis la meilleure solution du recuit. L’option `--coupes` ajoute les inégalités de sous-ensemble de Gouvine (inégalité (20) de [arXiv:2111.01047](https://arxiv.org/abs/2111.01047)), séparées itérativement sur une relaxation sans variables binaires, puis à chaque nœud de l’arbre. Elles renforcent fortement la borne inférieure.

## Protocole

- 15 instances A, avec le temps du challenge (15 min par instance).
- Recuit : 5 graines par instance.
- Réglage des paramètres du recuit sur trois instances (A_06, A_09, A_13), présentées à part. Les conclusions portent sur les 12 autres.
- Écarts mesurés par rapport à la meilleure valeur connue du challenge. Toutes les solutions sont validées par le checker officiel.
- PLNE : 15 min, départ depuis la meilleure des 5 graines. Sa solution ne correspond donc pas au budget du challenge, mais sa borne, si.

Machine : Intel Core i7-1185G7 (4 cœurs, 8 fils), 15 Go de RAM, Python 3.12, Gurobi 13.0.

## Résultats

| Écart moyen à la référence | Glouton | Recuit (moyenne) | Recuit (meilleure graine) | PLNE | Gap certifié moyen |
|---|---:|---:|---:|---:|---:|
| **12 instances hors réglage** | 2,83 % | **0,52 %** | 0,39 % | 0,31 % | 2,69 % |
| 3 instances de réglage | 4,83 % | 0,63 % | 0,23 % | 0,002 % | 0,007 % |

Points principaux :

- **Recuit.** Il divise par plus de cinq l’écart du glouton (0,52 % contre 2,83 % sur les instances hors réglage). Sur les 75 exécutions (15 instances × 5 graines), les 75 solutions sont réalisables. La meilleure graine atteint la référence sur 6 instances et reste à moins de 0,1 % sur 5 autres.
- **Séparation réglage / hors réglage.** Les écarts sont du même ordre sur les deux ensembles (0,63 % et 0,52 %). La séparation évite de juger le recuit sur les instances qui ont servi à le régler ; elle ne mesure pas un biais.
- **PLNE.** Elle prouve l’optimum de 8 instances (A_01, A_03, A_04, A_06, A_07, A_09, A_10, A_12), toutes égales à la référence. Elle améliore le meilleur recuit jusqu’à l’optimum sur A_01, A_04 et A_06, et ramène A_14 de 2,14 % à 1,64 % de la référence.
- **Inégalités de sous-ensemble.** Sur les 7 instances limitées par le temps, elles réduisent le gap certifié partout où il n’était pas déjà quasi nul :

| Gap certifié (15 min) | A_02 | A_05 | A_08 | A_11 | A_13 | A_14 | A_15 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Modèle seul | 55,94 % | 6,59 % | 5,94 % | 7,00 % | 0,02 % | 10,05 % | 10,53 % |
| Avec inégalités | 1,32 % | 4,91 % | 1,47 % | 6,28 % | 0,02 % | 8,32 % | 9,97 % |

À titre indicatif, Gouvine (1 h, CPLEX) obtient 2,41 / 2,77 / 8,63 / 9,07 / 12,10 % avec les mêmes inégalités sur le modèle complet (A_02, A_08, A_11, A_14, A_15). Cette comparaison porte sur un protocole différent et n’est pas directement équivalente.

<details>
<summary>Détail par instance</summary>

Écart à la référence (0 : référence atteinte). σ : écart-type de l’objectif sur les 5 graines. † : valeur obtenue avec `--coupes`.

**Instances hors réglage**

| Instance | Référence | Glouton | Recuit, moyenne | σ | Recuit, meilleure | PLNE | Gap certifié |
|---|---:|---:|---:|---:|---:|---:|---:|
| A_01 | 1767,82 | 2,26 % | 0,11 % | 0,73 | 0,08 % | 0 | optimal |
| A_02 | 4671,38 | 0,29 % | 0,05 % | 1,09 | 0,02 % | 0,01 % | 1,32 % † |
| A_03 | 848,18 | 0,31 % | 0,18 % | 1,32 | 0 | 0 | optimal |
| A_04 | 2085,88 | 4,21 % | 0,84 % | 6,20 | 0,36 % | 0 | optimal |
| A_05 | 635,22 | 0,73 % | 0,12 % | 0,53 | 0,02 % | 0,02 % | 4,91 % † |
| A_07 | 2272,78 | 0 | 0 | 0 | 0 | 0 | optimal |
| A_08 | 744,29 | 0,21 % | 0 | 0 | 0 | 0 | 1,47 % † |
| A_10 | 2994,85 | 0,08 % | 0,004 % | 0,16 | 0 | 0 | optimal |
| A_11 | 495,26 | 1,29 % | 0,04 % | 0,20 | 0,003 % | 0,002 % | 6,28 % † |
| A_12 | 789,63 | 0,30 % | 0,01 % | 0,18 | 0 | 0 | optimal |
| A_14 | 2264,12 | 12,06 % | 2,54 % | 9,13 | 2,14 % | 1,64 % † | 8,32 % † |
| A_15 | 2268,57 | 12,28 % | 2,41 % | 17,03 | 2,04 % | 2,04 % | 9,97 % † |

**Instances de réglage**

| Instance | Référence | Glouton | Recuit, moyenne | σ | Recuit, meilleure | PLNE | Gap certifié |
|---|---:|---:|---:|---:|---:|---:|---:|
| A_06 | 590,62 | 8,55 % | 1,80 % | 7,31 | 0,69 % | 0 | optimal |
| A_09 | 1507,28 | 5,23 % | 0 | 0 | 0 | 0 | optimal |
| A_13 | 1998,66 | 0,70 % | 0,09 % | 1,35 | 0,02 % | 0,007 % † | 0,02 % |

Temps : glouton inférieur à 10 s (sauf A_04 : 85 s). PLNE optimale en moins de 3 s sur les petites instances, 112 s sur A_04, temps limite (900 s) à partir de 12 scénarios.

</details>

## Structure du dépôt

- `src/reader.py` : lecture d’une instance JSON ; `writer.py` : écriture d’une solution.
- `src/evaluation.py` : coût incrémental (objectif et pénalité des contraintes violées), identique au checker.
- `src/heuristique.py` : glouton et réparation ; `src/meta_heuristique.py` : recuit simulé et descente.
- `src/Plne.py` : PLNE complète avec Gurobi, option `--coupes`.
- `src/campagne.py` : campagnes de réglage, finale (plusieurs graines) et PLNE ; `src/tableau.py` et `src/graphes.py` produisent tableaux et figures.
- `RTE_ChallengeROADEF2020_checker.py` : checker officiel.

## Reproduire

```bash
make install
make heuristique     INSTANCE=A_set/A_01.json
make metaheuristique INSTANCE=A_set/A_01.json TEMPS=60
make plne            INSTANCE=A_set/A_01.json
make check INSTANCE=A_set/A_01.json SOLUTION=solutions/A_01_plne.txt
```

La PLNE avec Gurobi nécessite une licence complète : la licence fournie avec `pip install gurobipy` est limitée à 2 000 variables. Le glouton et le recuit fonctionnent sans Gurobi. Les instances ne sont pas versionnées (environ 10 Go décompressées) ; elles sont disponibles sur le site du challenge.

## Références

- Sujet, instances et checker : [rte-france/challenge-roadef-2020](https://github.com/rte-france/challenge-roadef-2020).
- G. Gouvine, *Mixed-Integer Programming decomposition for stochastic programming with quantiles*, [arXiv:2111.01047](https://arxiv.org/abs/2111.01047) : inégalités de sous-ensemble et comparaison de la PLNE.
- S. Kirkpatrick, C. D. Gelatt, M. P. Vecchi, *Optimization by Simulated Annealing*, Science, 1983.
