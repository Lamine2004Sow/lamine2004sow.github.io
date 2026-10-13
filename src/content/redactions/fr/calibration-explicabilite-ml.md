---
title: "Calibration isotonique et SHAP : passer d'un score abstrait à une décision métier"
description: "Pourquoi un AUC élevé ne suffit pas en production et comment fiabiliser les probabilités pour les équipes opérationnelles."
date: "2026-08"
tags: ["Machine Learning", "Explicabilité", "SHAP", "Calibration", "Data Science"]
---

## Le piège du score brut en Machine Learning industriel

Dans la plupart des tutoriels académiques, l'entraînement d'un classifieur binaire s'arrête à la maximisation de métriques globales comme l'accuracy, le F1-score ou le ROC-AUC. 

Pourtant, dans un cadre industriel à forts enjeux financiers — qu'il s'agisse de déployer des équipes de génie civil sur un réseau télécom ou d'accorder des financements —, la question posée par les responsables métier n'est pas :
> *"Le modèle a-t-il un bon ranking ?"*

mais plutôt :
> *"Si ce boîtier présente un score de 0,75, y a-t-il véritablement 3 chances sur 4 qu'il sature d'ici 6 mois ?"*

Un score brut issu d'une fonction sigmoïde ou d'un arbre Gradient Boosting (XGBoost, LightGBM) n'est **pas une probabilité intrinsèquement calibrée**.

---

## Mesurer la calibration : le Score de Brier

Le **Score de Brier** mesure l'erreur quadratique moyenne entre la probabilité prédite `p_i` et l'observation binaire réelle `y_i` (0 ou 1) :

`BS = (1/N) × somme sur i de (p_i − y_i)²`

Un modèle peut afficher un excellent ROC-AUC (bon ordonnancement des risques) tout en ayant un mauvais score de Brier (surestimation systématique de la confiance).

---

## Calibration isotonique vs Platt Scaling

Pour aligner les scores du modèle sur les fréquences observées dans le monde réel, deux méthodes de recalibrage a posteriori s'imposent :

1. **La régression logistique (Platt Scaling)** : suppose une relation sigmoïdale entre le score brut et la probabilité réelle. Elle fonctionne bien sur de petits volumes de données mais manque de flexibilité si la distorsion n'est pas strictement sigmoïde.
2. **La régression isotonique (Isotonic Regression)** : approche non paramétrique qui ajuste une fonction monotone croissante par morceaux (algorithme PAV - *Pair Adjacent Violators*). Sur des volumes de données suffisants, elle corrige les distorsions non linéaires sans introduire de biais structurel.

Lors de mon stage chez Sonatel sur l'anticipation de la saturation des PBO FTTH, une calibration isotonique, ajustée uniquement sur le jeu de validation, a permis de réduire nettement l'erreur de calibration des probabilités prédites. Ce point est essentiel lorsque les scores servent au dimensionnement budgétaire.

---

## Rendre la décision transparente : l'apport des valeurs de SHAP

La calibration résout la question du *combien*, mais pas celle du *pourquoi*. Les équipes de terrain refusent légitimement d'intervenir sur un équipement si elles ne comprennent pas ce qui motive la prédiction.

La méthode **SHAP (SHapley Additive exPlanations)**, issue de la théorie des jeux coopératifs, apporte une réponse rigoureuse :

- **Propriété d'efficacité** : la somme des contributions SHAP de chaque variable est rigoureusement égale à la différence entre la prédiction et l'espérance de base du modèle.
- **Explicabilité globale** : identification des leviers macroscopiques (ex. le taux d'occupation courant domine, suivi de la capacité nominale, puis les variables de pression géographique).
- **Explicabilité locale (waterfall plot)** : pour un équipement donné, les opérationnels visualisent les facteurs spécifiques qui poussent le score vers le haut ou vers le bas (ex. un taux d'occupation déjà élevé et une faible capacité résiduelle).

---

## Conclusion

L'alliance entre **calibration isotonique** et **explicabilité SHAP** constitue le pont indispensable entre la science des données et l'ingénierie décisionnelle. Elle permet de substituer à l'effet « boîte noire » un outil de confiance capable d'orienter sereinement les investissements d'une entreprise.
