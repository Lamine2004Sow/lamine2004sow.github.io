---
title: "DermTriage — Dermatological image classification"
description: "Experimental PyTorch pipeline (ResNet-18) to classify seven skin lesion types from the HAM10000 dataset, with an evaluation protocol free of leakage between lesions."
date: "2026-10"
tags: ["Deep learning", "Computer vision", "PyTorch", "ResNet-18"]
github: "https://github.com/Lamine2004Sow/DermTriage"
---

Experimental project on skin lesion classification using the HAM10000 dataset. The repository contains a complete PyTorch pipeline: reproducible splits, image loading, training and evaluation of a seven-class ResNet-18, baselines, six variants compared over 5 folds, and the scripts that regenerate tables and figures.

This project is not a medical device. It does not provide any diagnosis and does not replace the opinion of a healthcare professional.

## Context

HAM10000 contains 10,015 dermatoscopic images spread across seven classes: `akiec`, `bcc`, `bkl`, `df`, `mel`, `nv` and `vasc`. The classes are highly imbalanced, which makes accuracy uninformative: the main metric retained is macro-F1, the mean of the per-class F1 scores.

## Leakage-free protocol

- **Splits by lesion.** The same lesion can be photographed several times in HAM10000; the splits are therefore built with `StratifiedGroupKFold` by `lesion_id`, so that a lesion never appears in both training and validation.
- **Held-out test set.** About 10 % of the images are isolated in `test.csv` (`fold = -1`). The training code only reads `train_val.csv` (folds 0 to 4); the test set is not loaded during development.
- **Fixed mapping.** The classes are defined in `src/classes.py`, without `LabelEncoder`, to guarantee the same output order everywhere.
- **Identical splits.** All variants are evaluated on the same folds.

## Method

**Baselines.** A majority-class classifier (B0) and a logistic regression on 30 color features (B1).

**Model.** ResNet-18 pre-trained on ImageNet, images converted to `3 × 224 × 224` tensors with ImageNet normalization. The training loss can be weighted by class weights; early stopping is based on validation macro-F1.

**Variants.** A single difference between two neighboring variants:

| Code | Variant |
|---|---|
| E1 | Frozen ResNet-18 + logistic regression on the 512 extracted features |
| E2 | ResNet-18, head only trained, with augmentations |
| E3 | `layer4` + head, learning rate 1e-4 |
| E4 | E3 with class-weighted loss |
| E5 | E3 without augmentations |

## Results

Validation macro-F1, mean over the 5 folds (seed 0). A fold contains about 1,800 images.

| Variant | Mean macro-F1 | Std. dev. across folds |
|---|---:|---:|
| B0 · majority class | 0.115 | 0.000 |
| B1 · logistic regression on 30 color features | 0.260 | 0.024 |
| E1 · frozen ResNet-18 + logistic regression | 0.501 | 0.015 |
| E2 · ResNet-18, head only | 0.507 | 0.032 |
| E3 · `layer4` + head | 0.661 | 0.016 |
| E4 · E3 with weighted loss | 0.662 (seed 0); 0.654 over 3 seeds | 0.031 |
| E5 · E3 without augmentations | 0.626 | 0.021 |

### Verdicts on the hypotheses

Decision rule of the protocol: mean increase and at least 4 folds out of 5 improved.

- **H1** (ImageNet features rather than colors): confirmed, 5 folds out of 5, about +0.24 macro-F1.
- **H2** (adapting `layer4`): confirmed, 5 folds out of 5, about +0.15 compared with head only.
- **H3** (weighted loss): confirmed on rare classes (recall of `df`, `vasc`, `akiec`) and on the precision of `nv`, without macro-F1 gain.
- **H4** (augmentations): confirmed, 5 folds out of 5, about +0.035 macro-F1.

These results are for seed 0. For E4, three seeds give a standard deviation of 0.0075 across seeds (0.024 across folds); E3 was only trained with one seed. Runs on Kaggle GPUs are not reproducible bit-for-bit from one session to another (E3 re-run: −0.001 to −0.005 macro-F1).

Duration of one ResNet-18 epoch (7,210 images): about 0.6 min on a Tesla T4 GPU with 256 px images, about 15 to 18 min on CPU.

## Reproducibility

- **Tests.** 55 unit tests, including tests on the real splits (skipped if `data/processed/splits.csv` is absent).
- **Configurations.** One YAML configuration per variant in `configs/`; each run writes its exact configuration, the commit hash, the history, the validation logits and the final metrics.
- **Main commands.**

| Command | Role |
|---|---|
| `make install` | creates `.venv` and installs dependencies |
| `make splits` | generates the splits in `data/processed/` |
| `make preprocess` | copies the images at 256 px |
| `make test` | runs the tests |
| `make baselines` | computes the baselines on the 5 folds |
| `make features` | extracts the frozen ResNet-18 features and runs the logistic regression (E1) |
| `make aggregate` | aggregates the results into `results/comparison.csv` |
| `make time-epoch` | measures the duration of one epoch |

Training one fold: `python -m scripts.train --config configs/resnet18_head.yaml --fold 0 --seed 0`.

## Status and limitations

- Phases 0 to 2 (cleanup, protocol, reproducible training) are complete. Phase 3 (transfer and ablations) is in progress: variants E1 to E5 are compared, and verdicts H1 to H4 are written.
- Still to do: variance across seeds for the retained configuration, error analysis, calibration and abstention, single evaluation on the test set, inference interface, documentation of biases.
- HAM10000 is a research dataset that does not necessarily cover all populations, all imaging devices or all clinical situations. Predictions may be wrong or biased.
- No clinical validation has been carried out. The project is not intended for medical use.
