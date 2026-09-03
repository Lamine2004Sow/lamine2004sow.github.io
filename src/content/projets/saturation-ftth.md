---
title: "Anticipation de la saturation FTTH par Machine Learning"
description: "Développement d'un système prédictif multi-horizon (3, 6, 9, 12 mois) pour anticiper la saturation des boîtiers d'extrémité FTTH chez Sonatel."
date: "2026-07"
tags: ["Machine Learning", "XGBoost", "Python", "SHAP", "Calibration"]
---

## Contexte & Enjeux Industriels

Dans le déploiement des réseaux d'accès très haut débit en fibre optique (**FTTH**), les Points de Branchement Optique (**PBO**) constituent les équipements terminaux où sont raccordés les abonnés. L'approche traditionnelle de gestion de capacité repose sur des seuils statiques et des taux d'occupation instantanés. Cette méthode réactive engendre :
- Des saturations imprévues bloquant les raccordements commerciaux de nouveaux clients.
- Des investissements d'extension non priorisés dans le temps et l'espace.

L'objectif de ce travail a été de concevoir une **preuve de concept de Machine Learning** capable d'anticiper la saturation à différents horizons temporels pour transformer une gestion réactive en une planification proactive des investissements.

---

## Données & Préparation

Le jeu de données comprenait **559 609 observations historiques** couvrant **74 267 équipements FTTH** répartis sur **954 plaques réseau**.

### Ingénierie des variables (Feature Engineering)
- **Dynamique temporelle** : vitesse de raccordement récente (dérivée du taux d'occupation sur 30, 60 et 90 jours), variations d'accélération.
- **Contexte géographique & territorial** : densité d'équipements par plaque, indicateurs démographiques communaux (recensement officiel ANSD).
- **Caractéristiques physiques** : capacité nominale du boîtier (6, 8 ou 12 ports), topologie amont côté commutateur optique (OLT).

---

## Méthodologie & Modélisation

### 1. Prévention de la fuite temporelle (Data Leakage)
Pour refléter fidèlement les conditions réelles de production, une stratégie stricte de découpage temporel a été mise en œuvre avec un **embargo temporel de 6 mois** entre le jeu d'entraînement et le jeu de test. Cette précaution élimine tout risque de surapprentissage lié à la persistance temporelle des états de saturation.

### 2. Modèle XGBoost multi-horizon
Un ensemble de modèles à base d'arbres de décision boostés (**XGBoost**) a été entraîné pour prédire la probabilité de saturation à quatre horizons : **3 mois, 6 mois, 9 mois et 12 mois**.

### 3. Calibration Isotonique
Les modèles de Gradient Boosting ont tendance à sous-estimer ou surestimer les probabilités extrêmes. Une **calibration isotonique** a été appliquée en post-traitement, permettant de fiabiliser les probabilités estimées et de réduire le score de Brier de **63 %**.

### 4. Explicabilité par valeurs de SHAP
L'acceptabilité métier étant indispensable, la méthode **SHAP (SHapley Additive exPlanations)** a été intégrée pour quantifier la contribution exacte de chaque variable, tant au niveau global (variables dominantes) qu'au niveau local (explication détaillée de la recommandation d'extension sur un boîtier précis).

---

## Résultats Clés

Comparé à la règle métier statique basée sur le seuil d'occupation instantané, le modèle démontre une supériorité opérationnelle nette :

| Indicateur | Baseline Métier | Modèle XGBoost Calibré | Gain |
|---|---|---|---|
| **PR-AUC (à 6 mois)** | 0,283 | **0,812** | **x 2,9** |
| **ROC-AUC (à 6 mois)** | — | **0,943** | Performance globale élevée |
| **Taux de rappel** | 23,4 % | **91,0 %** | Détection quasi-exhaustive des saturations |
| **Faux négatifs** | Référence | **-88 %** | Risque d'imprévu drastiquement réduit |
| **Score de Brier** | 0,142 | **0,052** | **-63 %** (probabilités très bien calibrées) |

Les prédictions ont ensuite été agrégées à l'échelle des plaques géographiques pour fournir aux décideurs une matrice de priorisation claire des chantiers d'extension de réseau.
