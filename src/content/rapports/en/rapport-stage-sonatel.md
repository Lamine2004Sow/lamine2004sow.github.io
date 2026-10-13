---
title: "Forecasting saturation of FTTH network PBOs"
description: "Technician internship at Sonatel: proof of concept predicting the saturation of optical branching points with a calibrated XGBoost model, at 3 to 12 month horizons."
date: "2026-07"
entreprise: "Sonatel (Orange Group) — Dakar"
duree: "2 months (May – July 2026)"
---

Technician internship (INFO2) within the machine learning team at Sonatel, a subsidiary of the Orange Group in Senegal, in a unit dedicated to planning and sizing the FTTH network. The internship ran from 11 May to 10 July 2026, as a proof of concept rather than a production model.

## Context

A **PBO** (optical branching point) is the end box of the FTTH network, installed in the street or in a building, which allows homes to be connected. Its nominal capacity is fixed (usually 6, 8 or 12 ports): when all ports are occupied, it is saturated and can no longer accept a customer without physical intervention.

The business uses a **saturation threshold of 80 %** of nominal capacity. This threshold, deliberately conservative, gives teams time to plan an extension before actual saturation (100 %).

Extension decisions were based on the observed occupancy rate and on empirical ratios applied to the theoretical potential of the areas, without any projection tool. The report starts from the asymmetry of error costs: a false negative (undetected saturation) leads to a blocked customer and lost revenue, whereas a false alarm at worst leads to a field check. The choice of models therefore favored **recall** over precision.

## Objectives

1. **6-month binary model**: identify the PBOs that will cross the 80 % threshold within the next six months.
2. **Multi-horizon extension** (3, 6, 9 and 12 months): estimate not only whether a PBO will saturate, but when.
3. **Geographic aggregation** of risk at plate, OLT and municipality levels, for network and budget planning.

## Data

No quarterly history of PBO occupancy existed in Sonatel's systems. It was reconstructed, in pairs, from the commissioning date of each PBO and the connection dates of each customer: for each PBO and each quarter, the cumulative number of connected customers, hence the historical occupancy rate. The history covers January 2018 to January 2026, after cleaning and joining with customer, geographic and census data.

Twelve explanatory variables were built, in four families:

- **Equipment**: current occupancy, nominal capacity, occupancy rate, age of the PBO;
- **Temporal dynamics**: filling speed over 3 months, acceleration of this speed;
- **Spatial proximity**: mean occupancy rate of the nearest neighboring PBOs (BallTree search, Haversine distance);
- **Geographic pressure and potential**: mean occupancy rate at plate, OLT and municipality level, penetration rate (connected customers relative to census households), number of potential unconnected homes.

The split is chronological and strict, with a **six-month embargo** between the training and validation sets on one side and the test set on the other, so that no future observation influences learning.

## Modeling

**6-month binary model.** An XGBoost model predicts whether a PBO will cross the 80 % threshold within the 6-month horizon. The imbalance between saturated and non-saturated PBOs is handled through class weighting. The raw probabilities are then recalibrated by isotonic regression, fitted only on the validation set.

**Sub-model for the uncertainty zone.** PBOs whose occupancy rate lies between 30 and 60 % (about a quarter of the test set) are predicted less well: short-term dynamics are noisier there, and a SHAP analysis shows that the speed and acceleration variables lose almost all their contribution. A dedicated sub-model, with shallower trees, relies more on structural signals such as PBO age. A routing step selects this sub-model for that segment only. It brings a gain of **+18.7 % PR-AUC** on this segment, along with better calibration.

**Multi-horizon extension.** The model was extended to four horizons (3, 6, 9 and 12 months) as stacked binary models, with a monotonicity constraint: the probability of saturation does not decrease with the horizon. For each PBO, the system thus provides a risk trajectory and the most likely quarter of saturation.

**Aggregation.** Scores are aggregated at plate, OLT and municipality levels. The plate is the most relevant level: this is the granularity at which extension decisions are made.

**Tools.** Python, pandas, XGBoost and scikit-learn for modeling and calibration, SHAP for interpretability. The project is organized as a package with unit tests; exploration was carried out in notebooks, by phase.

## Results

### Comparison with the business rule

The existing business rule ("PBO occupied at more than 80 %") is compared with the calibrated XGBoost model on the test set, at a 6-month horizon.

| Metric | Business baseline | Calibrated XGBoost | Gain |
|---|---:|---:|---|
| Recall | 23.4 % | 91.0 % | ×3.9 |
| Precision | 50.6 % | 40.8 % | recall favored |
| F1-score | 32.0 % | 56.3 % | +24.3 pts |
| True positives | 4,740 | 18,453 | +13,713 PBOs detected |
| False negatives | 15,540 | 1,827 | −88 % |
| PR-AUC | 0.283 | 0.812 | ×2.9 |
| ROC-AUC | – | 0.943 | – |

The model detects 91 % of the PBOs that saturate within 6 months, against 23.4 % for the business rule, at the cost of a more modest precision. At the 0.5 threshold, the model favors recall and accepts more false alarms, a trade-off that is deliberate given the asymmetry of costs.

### Precision on priority cases (Top-K)

| Selection | Precision |
|---|---:|
| Top 100 PBOs | 100 % |
| Top 500 PBOs | 100 % |
| Top 1,000 PBOs | 100 % |
| Top 5,000 PBOs | 100 % |

This result must be read with caution (see the limitations below).

### Multi-horizon extension

| Horizon | PR-AUC |
|---|---:|
| 3 months | 0.859 |
| 6 months | 0.795 |
| 9 months | 0.748 |
| 12 months | 0.732 |

Performance degrades slightly with the horizon, without a sharp drop. The model respects the monotonicity constraint. The saturation quarter is predicted exactly in 84.8 % of cases, and to within one quarter in 92.1 % of cases. The 6-month PR-AUC goes from 0.812 (binary model, raw probabilities) to 0.795 (multi-horizon model, calibrated); the two models were trained separately.

### Interpretability (SHAP)

The current occupancy rate clearly dominates the overall importance of the variables, followed by nominal capacity: small PBOs saturate faster. The geographic pressure variables (plate, OLT, municipality) come next, which indicates that saturation is partly an area-level phenomenon, not only an individual one. For a PBO at very high risk, an already high occupancy rate and a low residual capacity explain most of the score. This kind of verifiable explanation allows a network agent to judge an alert before intervening.

## Problems encountered

- **Temporal leakage.** Building variables and target naively can let the model use future information. A strict chronological split, with a six-month embargo, was put in place.
- **Calibration.** An XGBoost score is not a probability: a score of 0.7 does not correspond to a 70 % chance of saturation. Isotonic calibration clearly reduced the calibration error; it is essential for budget use.
- **"Potential" feature dropped.** The theoretical potential of an area was only available as a fixed value, with no history of its evolution. Being static, it had lost its predictive power and was not retained.
- **Aggregation by municipality.** Sonatel's and ANSD's municipality reference lists do not follow the same nomenclature. The manual mapping remains incomplete: some municipalities could not be matched with certainty, which limits coverage and introduces uncertainty into indicators at this level.

## Limitations

- **Top-K at 100 %.** This result mainly reflects the clear separation of extreme cases (consistent with the ROC-AUC of 0.943), not proof of generalization. The real difficulty remains the 30–60 % zone.
- **Already saturated PBOs not filtered out.** At time T, the pipeline does not explicitly exclude PBOs that have already crossed the 80 % threshold. These cases may make prediction easier and inflate Top-K performance. A natural improvement would be to exclude them from the prediction set, so as to evaluate only the ability to anticipate a future crossing of the threshold.
- **Robustness over time.** The report points out that the model's robustness over time needs to be investigated further, in particular through monitoring under real conditions, before any move to production.

## Summary

The internship resulted in a **proof of concept**, not an operational model. It provided the supervisor with a working model, quantified metrics and a reproducible methodology. Possible next steps (monitoring under real conditions, data enrichment, a scoring service) are an internal decision. On a personal level, the internship confirmed my interest in the intersection of machine learning and operations research, and the importance of methodological rigor with temporal data.
