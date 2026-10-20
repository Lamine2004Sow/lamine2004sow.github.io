---
title: "DermTriage — Classification d’images dermatologiques"
description: "Pipeline PyTorch expérimental (ResNet-18) pour classer sept types de lésions cutanées du jeu HAM10000, avec un protocole d’évaluation sans fuite entre lésions."
result: "2,5 fois plus performant qu’une baseline classique : macro-F1 de 0,66 contre 0,26 (validation croisée à 5 plis), sur 10 015 images et 7 classes."
joke: "Mon modèle reconnaît les lésions cutanées, tant qu'on ne lui demande pas de sortir de HAM10000."
date: "2026-10"
tags: ["Deep learning", "Vision par ordinateur", "PyTorch", "ResNet-18"]
github: "https://github.com/Lamine2004Sow/DermTriage"
---

Projet expérimental de classification de lésions cutanées à partir du jeu de données HAM10000. Le dépôt contient un pipeline PyTorch complet : partitions reproductibles, chargement des images, entraînement et évaluation d’un ResNet-18 à sept classes, baselines, six variantes comparées sur 5 folds, et les scripts qui régénèrent tableaux et figures.

Ce projet n’est pas un dispositif médical. Il ne fournit aucun diagnostic et ne remplace pas l’avis d’un professionnel de santé.

## Contexte

HAM10000 contient 10 015 images dermatoscopiques réparties en sept classes : `akiec`, `bcc`, `bkl`, `df`, `mel`, `nv` et `vasc`. Les classes sont très déséquilibrées, ce qui rend l’exactitude peu informative : la métrique principale retenue est la macro-F1, moyenne des F1 par classe.

## Protocole sans fuite

- **Partitions par lésion.** Une même lésion peut être photographiée plusieurs fois dans HAM10000 ; les partitions sont donc construites avec `StratifiedGroupKFold` par `lesion_id`, afin qu’une lésion ne se retrouve jamais à la fois en entraînement et en validation.
- **Jeu de test réservé.** Environ 10 % des images sont isolées dans `test.csv` (`fold = -1`). Le code d’entraînement ne lit que `train_val.csv` (folds 0 à 4) ; le test n’est pas chargé pendant le développement.
- **Mapping figé.** Les classes sont fixées dans `src/classes.py`, sans `LabelEncoder`, pour garantir le même ordre des sorties partout.
- **Partitions identiques.** Toutes les variantes sont évaluées sur les mêmes folds.

## Méthode

**Baselines.** Un classifieur majoritaire (B0) et une régression logistique sur 30 caractéristiques couleur (B1).

**Modèle.** ResNet-18 pré-entraîné sur ImageNet, images converties en tenseurs `3 × 224 × 224` avec normalisation ImageNet. La perte d’entraînement peut être pondérée par les poids de classes ; l’arrêt précoce se fait sur la macro-F1 de validation.

**Variantes.** Une seule différence entre deux variantes voisines :

| Code | Variante |
|---|---|
| E1 | ResNet-18 figé + régression logistique sur les 512 caractéristiques extraites |
| E2 | ResNet-18, tête seule entraînée, avec augmentations |
| E3 | `layer4` + tête, taux d’apprentissage 1e-4 |
| E4 | E3 avec perte pondérée par les classes |
| E5 | E3 sans augmentations |

## Résultats

Macro-F1 de validation, moyenne sur les 5 folds (graine 0). Un fold contient environ 1 800 images.

| Variante | Macro-F1 moyenne | Écart-type entre folds |
|---|---:|---:|
| B0 · classe majoritaire | 0,115 | 0,000 |
| B1 · régression logistique sur 30 caractéristiques couleur | 0,260 | 0,024 |
| E1 · ResNet-18 figé + régression logistique | 0,501 | 0,015 |
| E2 · ResNet-18, tête seule | 0,507 | 0,032 |
| E3 · `layer4` + tête | 0,661 | 0,016 |
| E4 · E3 avec perte pondérée | 0,662 (graine 0) ; 0,654 sur 3 graines | 0,031 |
| E5 · E3 sans augmentations | 0,626 | 0,021 |

### Verdicts sur les hypothèses

Règle de décision du protocole : moyenne en hausse et au moins 4 folds sur 5 améliorés.

- **H1** (caractéristiques ImageNet plutôt que couleurs) : confirmée, 5 folds sur 5, environ +0,24 de macro-F1.
- **H2** (adapter `layer4`) : confirmée, 5 folds sur 5, environ +0,15 par rapport à la tête seule.
- **H3** (perte pondérée) : confirmée sur les classes rares (rappel de `df`, `vasc`, `akiec`) et la précision de `nv`, sans gain de macro-F1.
- **H4** (augmentations) : confirmée, 5 folds sur 5, environ +0,035 de macro-F1.

Ces résultats portent sur la graine 0. Pour E4, trois graines donnent un écart-type de 0,0075 entre graines (0,024 entre folds) ; E3 n’a été entraîné qu’avec une graine. Les exécutions sur GPU Kaggle ne sont pas reproductibles à l’identique d’une session à l’autre (E3 relancé : −0,001 à −0,005 de macro-F1).

Durée d’une époque ResNet-18 (7 210 images) : environ 0,6 min sur un GPU Tesla T4 avec images à 256 px, environ 15 à 18 min sur CPU.

## Reproductibilité

- **Tests.** 55 tests unitaires, dont des tests sur les partitions réelles (ignorés si `data/processed/splits.csv` est absent).
- **Configurations.** Une configuration YAML par variante dans `configs/` ; chaque run écrit sa configuration exacte, le hash du commit, l’historique, les logits de validation et les métriques finales.
- **Commandes principales.**

| Commande | Rôle |
|---|---|
| `make install` | crée `.venv` et installe les dépendances |
| `make splits` | génère les partitions dans `data/processed/` |
| `make preprocess` | copie les images à 256 px |
| `make test` | lance les tests |
| `make baselines` | calcule les baselines sur les 5 folds |
| `make features` | extrait les caractéristiques ResNet-18 figées et lance la régression logistique (E1) |
| `make aggregate` | agrège les résultats dans `results/comparison.csv` |
| `make time-epoch` | mesure la durée d’une époque |

Entraînement d’un fold : `python -m scripts.train --config configs/resnet18_head.yaml --fold 0 --seed 0`.

## État et limites

- Les phases 0 à 2 (assainissement, protocole, entraînement reproductible) sont terminées. La phase 3 (transfert et ablations) est en cours : les variantes E1 à E5 sont comparées, les verdicts H1 à H4 sont rédigés.
- Restent à faire : variance entre graines sur la configuration retenue, analyse des erreurs, calibration et abstention, évaluation unique sur le jeu de test, interface d’inférence, documentation des biais.
- HAM10000 est un jeu de données de recherche qui ne couvre pas nécessairement toutes les populations, tous les appareils de prise de vue ni toutes les situations cliniques. Les prédictions peuvent être erronées ou biaisées.
- Aucune validation clinique n’a été réalisée. Le projet n’est pas destiné à un usage médical.
