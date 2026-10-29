---
title: "Orange (Sonatel) — Anticiper la saturation du réseau fibre"
short: "SONATEL"
description: "Stage Machine Learning / Data Science chez Sonatel (groupe Orange) : prédire quels points de branchement optique du réseau FTTH vont saturer, à horizons de 3 à 12 mois."
result: "88 % de faux négatifs en moins que la règle métier en place (PR-AUC 0,81 contre 0,28), avec un modèle XGBoost calibré et expliqué par SHAP."
date: "2026-07"
kind: "stage"
role: "Stagiaire ML / Data Science"
duree: "Mai – juillet 2026"
tags: ["XGBoost", "SHAP", "Calibration", "Séries temporelles", "Python"]
order: 3
---

Stage (INFO2) au sein du pôle machine learning de Sonatel, filiale du groupe Orange au Sénégal, dans une cellule dédiée à la planification et au dimensionnement du réseau FTTH. Le stage a été mené du 11 mai au 10 juillet 2026, sous la forme d’une preuve de concept et non d’un modèle de production.

## Contexte

Un **PBO** (point de branchement optique) est le boîtier d’extrémité du réseau FTTH, installé en rue ou en immeuble, qui permet de raccorder les foyers. Sa capacité nominale est fixe (en général 6, 8 ou 12 ports) : lorsque tous les ports sont occupés, il est saturé et ne peut plus accueillir de client sans intervention physique.

Le métier retient un **seuil de saturation de 80 %** de la capacité nominale. Ce seuil, volontairement conservateur, laisse aux équipes un délai pour planifier une extension avant la saturation réelle (100 %).

Les décisions d’extension reposaient sur le taux d’occupation observé et sur des ratios empiriques appliqués au potentiel théorique des zones, sans outil de projection. Le rapport part de l’asymétrie des coûts d’erreur : un faux négatif (saturation non détectée) entraîne un blocage client et une perte de revenu, tandis qu’une fausse alerte mène au pire à une vérification sur le terrain. Le choix des modèles a donc privilégié le **rappel** sur la précision.

## Objectifs

1. **Modèle binaire à 6 mois** : identifier les PBO qui franchiront le seuil de 80 % dans les six prochains mois.
2. **Extension multi-horizon** (3, 6, 9 et 12 mois) : estimer non seulement si un PBO va saturer, mais quand.
3. **Agrégation géographique** du risque aux niveaux plaque, OLT et commune, pour la planification réseau et budgétaire.

## Données

Aucun historique trimestriel de l’occupation des PBO n’existait dans les systèmes de Sonatel. Il a été reconstitué, en binôme, à partir de la date de mise en service de chaque PBO et des dates de raccordement de chaque client : pour chaque PBO et chaque trimestre, le nombre cumulé de clients raccordés, donc le taux d’occupation historique. L’historique couvre janvier 2018 à janvier 2026, après nettoyage et jointure avec des données clients, géographiques et de recensement.

Douze variables explicatives ont été construites, en quatre familles :

- **Équipement** : occupation courante, capacité nominale, taux d’occupation, âge du PBO ;
- **Dynamique temporelle** : vitesse de remplissage sur 3 mois, accélération de cette vitesse ;
- **Proximité spatiale** : taux d’occupation moyen des PBO voisins les plus proches (recherche BallTree, distance de Haversine) ;
- **Pression géographique et potentiel** : taux d’occupation moyen à l’échelle de la plaque, de l’OLT et de la commune, taux de pénétration (clients raccordés rapportés aux ménages recensés), nombre de foyers potentiels non raccordés.

Le découpage est chronologique et strict, avec un **embargo de six mois** entre les jeux d’entraînement et de validation d’une part, et le jeu de test d’autre part, afin qu’aucune observation future n’influence l’apprentissage.

## Modélisation

**Modèle binaire à 6 mois.** Un modèle XGBoost prédit si un PBO franchira le seuil de 80 % dans l’horizon de 6 mois. Le déséquilibre entre PBO saturés et non saturés est pris en compte par pondération des classes. Les probabilités brutes sont ensuite recalibrées par régression isotonique, ajustée uniquement sur le jeu de validation.

**Sous-modèle sur la zone d’incertitude.** Les PBO dont le taux d’occupation se situe entre 30 et 60 % (environ un quart du jeu de test) sont moins bien prédits : la dynamique de court terme y est plus bruitée, et une analyse SHAP montre que les variables de vitesse et d’accélération y perdent presque toute contribution. Un sous-modèle dédié, aux arbres moins profonds, s’appuie davantage sur des signaux structurels comme l’âge du PBO. Un routage sélectionne ce sous-modèle pour ce segment uniquement. Il apporte un gain de **+18,7 % de PR-AUC** sur ce segment, ainsi qu’une meilleure calibration.

**Extension multi-horizon.** Le modèle a été étendu à quatre horizons (3, 6, 9 et 12 mois) sous forme de modèles binaires empilés, avec une contrainte de monotonie : la probabilité de saturation ne décroît pas avec l’horizon. Pour chaque PBO, le système fournit ainsi une trajectoire de risque et le trimestre le plus probable de saturation.

**Agrégation.** Les scores sont agrégés aux niveaux plaque, OLT et commune. La plaque est le niveau le plus pertinent : c’est à cette maille que sont prises les décisions d’extension.

**Outils.** Python, pandas, XGBoost et scikit-learn pour la modélisation et la calibration, SHAP pour l’interprétabilité. Le projet est organisé en package avec tests unitaires ; l’exploration a été menée dans des notebooks par phases.

## Résultats

### Comparaison avec la règle métier

La règle métier existante (« PBO occupé à plus de 80 % ») est comparée au modèle XGBoost calibré sur le jeu de test, à horizon 6 mois.

| Métrique | Baseline métier | XGBoost calibré | Gain |
|---|---:|---:|---|
| Rappel (recall) | 23,4 % | 91,0 % | ×3,9 |
| Précision | 50,6 % | 40,8 % | rappel favorisé |
| F1-score | 32,0 % | 56,3 % | +24,3 pts |
| Vrais positifs | 4 740 | 18 453 | +13 713 PBO détectés |
| Faux négatifs | 15 540 | 1 827 | −88 % |
| PR-AUC | 0,283 | 0,812 | ×2,9 |
| ROC-AUC | – | 0,943 | – |

Le modèle détecte 91 % des PBO qui saturent dans les 6 mois, contre 23,4 % pour la règle métier, au prix d’une précision plus modeste. Au seuil de 0,5, le modèle privilégie le rappel et accepte davantage de fausses alertes, compromis assumé au vu de l’asymétrie des coûts.

### Précision sur les cas prioritaires (Top-K)

| Sélection | Précision |
|---|---:|
| Top 100 PBO | 100 % |
| Top 500 PBO | 100 % |
| Top 1 000 PBO | 100 % |
| Top 5 000 PBO | 100 % |

Ce résultat doit être lu avec prudence (voir les limites ci-dessous).

### Extension multi-horizon

| Horizon | PR-AUC |
|---|---:|
| 3 mois | 0,859 |
| 6 mois | 0,795 |
| 9 mois | 0,748 |
| 12 mois | 0,732 |

La performance se dégrade légèrement avec l’horizon, sans chute brutale. Le modèle respecte la contrainte de monotonie. Le trimestre de saturation est prédit exactement dans 84,8 % des cas, et à un trimestre près dans 92,1 % des cas. Le PR-AUC à 6 mois passe de 0,812 (modèle binaire, probabilités brutes) à 0,795 (modèle multi-horizon, calibré) ; les deux modèles ont été entraînés séparément.

### Interprétabilité (SHAP)

Le taux d’occupation courant domine nettement l’importance globale des variables, suivi de la capacité nominale : les petits PBO saturent plus vite. Les variables de pression géographique (plaque, OLT, commune) viennent ensuite, ce qui indique que la saturation relève en partie d’un phénomène de zone et pas seulement individuel. Pour un PBO à très haut risque, un taux d’occupation déjà élevé et une faible capacité résiduelle expliquent l’essentiel du score. Ce type d’explication vérifiable permet à un agent réseau de juger une alerte avant d’intervenir.

## Problèmes rencontrés

- **Fuite temporelle.** Construire naïvement variables et cible peut faire utiliser au modèle des informations futures. Un découpage chronologique strict, avec embargo de six mois, a été mis en place.
- **Calibration.** Un score XGBoost n’est pas une probabilité : un score de 0,7 ne correspond pas à 70 % de chances de saturation. La calibration isotonique a réduit nettement l’erreur de calibration ; elle est essentielle pour un usage budgétaire.
- **Feature « potentiel » écartée.** Le potentiel théorique d’une zone était disponible uniquement à une valeur figée, sans historique de son évolution. Statique, il a perdu son pouvoir prédictif et n’a pas été retenu.
- **Agrégation par commune.** Les référentiels de communes de Sonatel et de l’ANSD ne suivent pas la même nomenclature. Le mapping manuel reste incomplet : certaines communes n’ont pas pu être appariées avec certitude, ce qui limite la couverture et introduit une incertitude sur les indicateurs à cette échelle.

## Limites

- **Top-K à 100 %.** Ce résultat traduit surtout la séparation nette des cas extrêmes (cohérente avec le ROC-AUC de 0,943), et non une preuve de généralisation. La vraie difficulté reste la zone 30–60 %.
- **PBO déjà saturés non filtrés.** Au temps T, le pipeline n’exclut pas explicitement les PBO ayant déjà franchi le seuil de 80 %. Ces cas peuvent faciliter la prédiction et gonfler les performances Top-K. Une amélioration naturelle consisterait à les exclure du jeu de prédiction, afin de n’évaluer que la capacité à anticiper un franchissement futur du seuil.
- **Robustesse dans le temps.** Le rapport souligne que la robustesse du modèle dans le temps doit être approfondie, notamment par un suivi en conditions réelles, avant tout passage en production.

## Bilan

Le stage a abouti à une **preuve de concept**, non à un modèle opérationnel. Il a fourni à l’encadrant un modèle fonctionnel, des métriques chiffrées et une méthodologie reproductible. Les suites possibles (suivi en conditions réelles, enrichissement des données, service de scoring) relèvent d’une décision interne. Sur le plan personnel, le stage a confirmé mon intérêt pour l’intersection entre apprentissage automatique et recherche opérationnelle, et l’importance de la rigueur méthodologique sur les données temporelles.
