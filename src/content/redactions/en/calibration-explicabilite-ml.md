---
title: "Isotonic calibration and SHAP: turning an abstract score into a business decision"
description: "Why a high AUC is not enough in production, and how to make probabilities reliable for operational teams."
date: "2026-08"
tags: ["Machine Learning", "Explainability", "SHAP", "Calibration", "Data Science"]
---

## The trap of the raw score in industrial Machine Learning

In most academic tutorials, training a binary classifier stops at maximizing global metrics such as accuracy, F1-score or ROC-AUC.

Yet in a high-stakes industrial setting — whether deploying civil engineering crews on a telecom network or granting financing — the question business managers ask is not:
> *"Does the model have a good ranking?"*

but rather:
> *"If this box shows a score of 0.75, is there really a 3-in-4 chance it saturates within 6 months?"*

A raw score from a sigmoid function or a Gradient Boosting tree (XGBoost, LightGBM) is **not an inherently calibrated probability**.

---

## Measuring calibration: the Brier Score

The **Brier Score** measures the mean squared error between the predicted probability `p_i` and the actual binary observation `y_i` (0 or 1):

`BS = (1/N) × sum over i of (p_i − y_i)²`

A model can display an excellent ROC-AUC (good ordering of risks) while having a poor Brier score (systematic overestimation of confidence).

---

## Isotonic calibration vs Platt Scaling

To align the model's scores with frequencies observed in the real world, two post-hoc recalibration methods stand out:

1. **Logistic regression (Platt Scaling)**: assumes a sigmoidal relationship between the raw score and the actual probability. It works well on small volumes of data but lacks flexibility if the distortion is not strictly sigmoidal.
2. **Isotonic Regression**: a non-parametric approach that fits a monotonically increasing piecewise function (PAV algorithm - *Pair Adjacent Violators*). With sufficient data volumes, it corrects non-linear distortions without introducing structural bias.

During my internship at Sonatel on anticipating the saturation of FTTH PBOs, isotonic calibration, fitted only on the validation set, clearly reduced the calibration error of the predicted probabilities. This matters when the scores are used for budget sizing.

---

## Making the decision transparent: the contribution of SHAP values

Calibration answers the question of *how much*, but not *why*. Field teams legitimately refuse to act on a piece of equipment if they do not understand what drives the prediction.

The **SHAP (SHapley Additive exPlanations)** method, drawn from cooperative game theory, provides a rigorous answer:

- **Efficiency property**: the sum of the SHAP contributions of each variable is exactly equal to the difference between the prediction and the model's base expectation.
- **Global explainability**: identification of the macro levers (e.g. the current occupancy rate dominates, followed by nominal capacity, then the geographic pressure variables).
- **Local explainability (waterfall plot)**: for a given piece of equipment, operators see the specific factors that push the score up or down (e.g. an already high occupancy rate and a low residual capacity).

---

## Conclusion

The combination of **isotonic calibration** and **SHAP explainability** forms the essential bridge between data science and decision engineering. It replaces the "black box" effect with a trustworthy tool that can confidently guide a company's investments.
