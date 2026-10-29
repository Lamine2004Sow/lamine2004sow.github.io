---
title: "Tournées de véhicules électriques — E-VRPTW"
short: "E-VRPTW"
description: "Un solveur C++17 pour organiser des tournées de véhicules électriques avec fenêtres horaires, autonomie de batterie et arrêts de recharge."
result: "Flotte optimale connue retrouvée sur 54/56 grandes instances (+0,17 % de distance) et 18 solutions meilleures que la référence publiée de 2014."
date: "2026-10"
tags: ["Recherche opérationnelle", "C++17", "Gurobi", "Métaheuristiques"]
github: "https://github.com/Lamine2004Sow/evrptw-solver"
order: 5
---

L’**E-VRPTW** (Electric Vehicle Routing Problem with Time Windows) consiste à servir des clients avec une flotte de véhicules électriques : chaque client a une fenêtre horaire, la batterie est limitée et il faut planifier les arrêts de recharge.

## Méthodes

- **Recherche locale itérée (ILS)** et **algorithme génétique mémétique**, écrits en C++17.
- **Modèle MILP sous Gurobi** pour prouver l’optimalité sur les petites instances.
- **Vérificateur indépendant** qui recontrôle chaque solution, plus une CI GitHub Actions et des tests `ctest`.

## Résultats

Sur les 92 instances de Schneider et al. (2014) :

- Flotte optimale connue retrouvée sur **54 des 56 grandes instances**, à +0,17 % de distance en moyenne.
- **18 instances sous la référence publiée**, jusqu’à −2,2 %.
- MILP Gurobi : **20 optimums prouvés sur 36**.
- **1 876 exécutions, 0 solution infaisable.**

## Stack

C++17, CMake, Gurobi, Python (matplotlib), GitHub Actions, ctest.
