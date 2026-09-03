---
title: "Anticipation de la saturation du réseau FTTH par Machine Learning"
description: "Rapport de stage technicien (INFO2) chez Sonatel : conception d'une preuve de concept d'aide à la décision pour la planification des extensions de réseau fibre optique."
date: "2026-07"
entreprise: "Sonatel / Orange (Dakar, Sénégal)"
duree: "2 mois (Mai — Juillet 2026)"
---

## Synthèse du Projet

Ce rapport synthétise les travaux réalisés au cours de mon stage technicien de fin de 2ᵉ année du cycle d'ingénieur en informatique à **Sup Galilée (Université Sorbonne Paris Nord)**, au sein de la Direction des Réseaux du groupe **Sonatel** (filiale du groupe Orange).

La mission portait sur la **prédiction anticipée de la saturation des Points de Branchement Optique (PBO)** du réseau FTTH (Fiber To The Home).

---

## Problématique Métier

Dans l'exploitation d'un réseau FTTH, l'approche historique de planification des extensions reposait sur :
- L'observation du taux d'occupation statique instantané.
- Des ratios empiriques sans prise en compte de la dynamique temporelle ou des disparités territoriales.

Cette gestion réactive provoquait des blocages commerciaux lors de l'arrivée de nouveaux abonnés et compliquait l'ordonnancement des chantiers d'extension de réseau. L'objectif fixé était de concevoir une **preuve de concept (PoC)** prédictive capable d'anticiper la saturation à différents horizons pour guider l'allocation des budgets et la priorisation des travaux.

---

## Démarche Méthodologique & Modélisation

Le travail a été structuré autour de plusieurs étapes clés :

### 1. Constitution et assainissement des données
- Analyse de **559 609 observations historiques** issues de **74 267 équipements** déployés sur **954 plaques réseau**.
- Création de variables métier (dérivées d'occupation, variations trimestrielles, indicateurs d'accélération).
- Enrichissement par des données contextuelles géographiques et démographiques (recensement officiel ANSD) pour capturer les dynamiques d'urbanisation.

### 2. Contrôle de la rigueur scientifique (Anti-Leakage)
Afin d'éviter tout phénomène de *data leakage* (fuite temporelle d'information), une stratégie d'évaluation stricte avec un **embargo temporel de 6 mois** a été mise en place entre les données d'apprentissage et les données d'évaluation, garantissant une simulation réaliste des conditions opérationnelles futures.

### 3. Modélisation XGBoost multi-horizon
- Entraînement d'algorithmes de Gradient Boosting (**XGBoost**) pour modéliser les probabilités de saturation à **3, 6, 9 et 12 mois**.
- Traitement spécifique de la zone d'incertitude (équipements à taux d'occupation intermédiaire entre 30 % et 60 %) via un sous-modèle spécialisé permettant d'améliorer le PR-AUC de **+18,7 %** sur ce segment critique.

### 4. Calibration et Explicabilité
- **Calibration isotonique** appliquée sur les probabilités brutes pour corriger les biais aux valeurs extrêmes (réduction du score de Brier de **63 %**).
- Analyse de l'importance des variables et explicabilité locale via **SHAP**, assurant une adoption sereine par les équipes opérationnelles non spécialistes de l'IA.

---

## Principaux Résultats Obtenus

| Métrique | Règle Métier Antérieure | Modèle XGBoost Calibré | Bénéfice Opérationnel |
|---|---|---|---|
| **PR-AUC (6 mois)** | 0,283 | **0,812** | Performance multipliée par **2,9** |
| **ROC-AUC (6 mois)** | — | **0,943** | Très forte capacité discriminante |
| **Taux de rappel** | 23,4 % | **91,0 %** | Détection de 9 saturations sur 10 en amont |
| **Faux négatifs** | Référence | **-88 %** | Réduction drastique des saturations imprévues |
| **Score de Brier** | 0,142 | **0,052** | Fiabilisation des probabilités pour le dimensionnement budgétaire |

---

## Bilan & Lien avec mon Projet Professionnel

Ce stage en conditions industrielles a renforcé mes compétences transversales :
- **Traduction d'un besoin métier non formalisé** en une chaîne de traitement Machine Learning rigoureuse.
- **Gestion autonome d'un projet de bout en bout** sur une durée courte de 2 mois, avec des points de synchronisation réguliers.
- **Rigueur méthodologique** dans la sélection des métriques adaptées aux classes déséquilibrées (privilégiant le rappel et la PR-AUC plutôt que la simple accuracy).

Cette expérience confirme ma volonté de poursuivre vers le métier d'**AI Engineer / Data Scientist** avec une forte composante en **Recherche Opérationnelle**, à l'intersection entre modélisation prédictive et optimisation des décisions industrielles.
