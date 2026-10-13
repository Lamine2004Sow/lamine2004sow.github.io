---
title: "ROADEF/EURO 2020 — RTE maintenance scheduling"
description: "Scheduling of maintenance operations on RTE's electricity network under uncertain risk: greedy, simulated annealing and MILP with Gurobi, evaluated on the challenge instances."
date: "2026-10"
tags: ["Operations research", "MILP", "Gurobi", "Simulated annealing"]
github: "https://github.com/Lamine2004Sow/roadef2020"
---

Operations research project on the ROADEF/EURO 2020 challenge, proposed by RTE. The goal is to schedule maintenance operations on the electricity transmission network, minimizing a risk described by scenarios.

## Problem

For each operation, a start date must be chosen:

- **resources** are limited by minimum and maximum bounds per period;
- certain **seasonal exclusions** forbid some dates;
- the **risk** is uncertain and described by scenarios. The cost combines the mean risk and the excess of the τ-quantile over that mean.

The objective is to minimize this cost under constraints.

## Methods

1. **Greedy + repair.** Operations are sorted from hardest to easiest (resource tension, exclusions, regret). Each one is placed on the date that increases the cost the least, then constraint violations are repaired.
2. **Simulated annealing + descent.** Starts from the greedy solution. Moves are local shifts (±5 periods) or global moves, and date swaps. The temperature is calibrated on the objective, and cooling is adjusted to the time limit.
3. **MILP (Gurobi).** Exact model: the quantile is linearized with big-M, and the solve starts from the best annealing solution. The `--coupes` option adds Gouvine's subset inequalities (inequality (20) of [arXiv:2111.01047](https://arxiv.org/abs/2111.01047)), separated iteratively on a relaxation without binary variables, then at each node of the tree. They strengthen the lower bound considerably.

## Protocol

- 15 A instances, with the challenge time budget (15 min per instance).
- Annealing: 5 seeds per instance.
- Annealing parameters tuned on three instances (A_06, A_09, A_13), presented separately. The conclusions cover the other 12.
- Gaps measured against the best known value of the challenge. All solutions are validated by the official checker.
- MILP: 15 min, starting from the best of the 5 seeds. Its solution therefore does not match the challenge budget, but its bound does.

Machine: Intel Core i7-1185G7 (4 cores, 8 threads), 15 GB RAM, Python 3.12, Gurobi 13.0.

## Results

| Mean gap to reference | Greedy | Annealing (mean) | Annealing (best seed) | MILP | Mean certified gap |
|---|---:|---:|---:|---:|---:|
| **12 instances outside tuning** | 2.83 % | **0.52 %** | 0.39 % | 0.31 % | 2.69 % |
| 3 tuning instances | 4.83 % | 0.63 % | 0.23 % | 0.002 % | 0.007 % |

Main points:

- **Annealing.** It divides the greedy gap by more than five (0.52 % versus 2.83 % on the instances outside tuning). Over the 75 runs (15 instances × 5 seeds), all 75 solutions are feasible. The best seed reaches the reference on 6 instances and stays within 0.1 % on 5 others.
- **Tuning / outside-tuning split.** Gaps are of the same order on both sets (0.63 % and 0.52 %). The split avoids judging the annealing on the instances used to tune it; it does not measure a bias.
- **MILP.** It proves the optimum of 8 instances (A_01, A_03, A_04, A_06, A_07, A_09, A_10, A_12), all equal to the reference. It improves the best annealing solution up to the optimum on A_01, A_04 and A_06, and brings A_14 from 2.14 % to 1.64 % of the reference.
- **Subset inequalities.** On the 7 instances limited by time, they reduce the certified gap everywhere it was not already nearly zero:

| Certified gap (15 min) | A_02 | A_05 | A_08 | A_11 | A_13 | A_14 | A_15 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Model alone | 55.94 % | 6.59 % | 5.94 % | 7.00 % | 0.02 % | 10.05 % | 10.53 % |
| With inequalities | 1.32 % | 4.91 % | 1.47 % | 6.28 % | 0.02 % | 8.32 % | 9.97 % |

For reference only, Gouvine (1 h, CPLEX) obtains 2.41 / 2.77 / 8.63 / 9.07 / 12.10 % with the same inequalities on the full model (A_02, A_08, A_11, A_14, A_15). This comparison is based on a different protocol and is not directly equivalent.

<details>
<summary>Per-instance details</summary>

Gap to reference (0: reference reached). σ: standard deviation of the objective over the 5 seeds. †: value obtained with `--coupes`.

**Instances outside tuning**

| Instance | Reference | Greedy | Annealing, mean | σ | Annealing, best | MILP | Certified gap |
|---|---:|---:|---:|---:|---:|---:|---:|
| A_01 | 1,767.82 | 2.26 % | 0.11 % | 0.73 | 0.08 % | 0 | optimal |
| A_02 | 4,671.38 | 0.29 % | 0.05 % | 1.09 | 0.02 % | 0.01 % | 1.32 % † |
| A_03 | 848.18 | 0.31 % | 0.18 % | 1.32 | 0 | 0 | optimal |
| A_04 | 2,085.88 | 4.21 % | 0.84 % | 6.20 | 0.36 % | 0 | optimal |
| A_05 | 635.22 | 0.73 % | 0.12 % | 0.53 | 0.02 % | 0.02 % | 4.91 % † |
| A_07 | 2,272.78 | 0 | 0 | 0 | 0 | 0 | optimal |
| A_08 | 744.29 | 0.21 % | 0 | 0 | 0 | 0 | 1.47 % † |
| A_10 | 2,994.85 | 0.08 % | 0.004 % | 0.16 | 0 | 0 | optimal |
| A_11 | 495.26 | 1.29 % | 0.04 % | 0.20 | 0.003 % | 0.002 % | 6.28 % † |
| A_12 | 789.63 | 0.30 % | 0.01 % | 0.18 | 0 | 0 | optimal |
| A_14 | 2,264.12 | 12.06 % | 2.54 % | 9.13 | 2.14 % | 1.64 % † | 8.32 % † |
| A_15 | 2,268.57 | 12.28 % | 2.41 % | 17.03 | 2.04 % | 2.04 % | 9.97 % † |

**Tuning instances**

| Instance | Reference | Greedy | Annealing, mean | σ | Annealing, best | MILP | Certified gap |
|---|---:|---:|---:|---:|---:|---:|---:|
| A_06 | 590.62 | 8.55 % | 1.80 % | 7.31 | 0.69 % | 0 | optimal |
| A_09 | 1,507.28 | 5.23 % | 0 | 0 | 0 | 0 | optimal |
| A_13 | 1,998.66 | 0.70 % | 0.09 % | 1.35 | 0.02 % | 0.007 % † | 0.02 % |

Run times: greedy under 10 s (except A_04: 85 s). MILP solved to optimality in under 3 s on small instances, 112 s on A_04, and the time limit (900 s) is reached from 12 scenarios onward.

</details>

## Repository structure

- `src/reader.py`: reads a JSON instance; `writer.py`: writes a solution.
- `src/evaluation.py`: incremental cost (objective and penalty for violated constraints), identical to the checker.
- `src/heuristique.py`: greedy and repair; `src/meta_heuristique.py`: simulated annealing and descent.
- `src/Plne.py`: full MILP with Gurobi, `--coupes` option.
- `src/campagne.py`: tuning, final (multiple seeds) and MILP campaigns; `src/tableau.py` and `src/graphes.py` produce tables and figures.
- `RTE_ChallengeROADEF2020_checker.py`: official checker.

## Reproducing

```bash
make install
make heuristique     INSTANCE=A_set/A_01.json
make metaheuristique INSTANCE=A_set/A_01.json TEMPS=60
make plne            INSTANCE=A_set/A_01.json
make check INSTANCE=A_set/A_01.json SOLUTION=solutions/A_01_plne.txt
```

MILP with Gurobi requires a full license: the license bundled with `pip install gurobipy` is limited to 2,000 variables. The greedy and annealing work without Gurobi. The instances are not versioned (about 10 GB unpacked); they are available on the challenge website.

## References

- Problem statement, instances and checker: [rte-france/challenge-roadef-2020](https://github.com/rte-france/challenge-roadef-2020).
- G. Gouvine, *Mixed-Integer Programming decomposition for stochastic programming with quantiles*, [arXiv:2111.01047](https://arxiv.org/abs/2111.01047): subset inequalities and comparison of the MILP.
- S. Kirkpatrick, C. D. Gelatt, M. P. Vecchi, *Optimization by Simulated Annealing*, Science, 1983.
