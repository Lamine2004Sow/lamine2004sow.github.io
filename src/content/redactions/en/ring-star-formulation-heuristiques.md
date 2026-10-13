---
title: "From the traveling salesman to Ring-Star: combining MILP and metaheuristics"
description: "How to design efficient algorithms for an NP-hard combinatorial problem combining a ring network and star-shaped service."
date: "2026-02"
tags: ["Operations Research", "MILP", "Metaheuristics", "Complexity"]
---

## Introduction

In telecommunications or transport network optimization, a recurring problem consists of designing a circular backbone connecting strategic nodes, while attaching peripheral nodes to that backbone. This problem is known as the **Ring-Star Problem (RSP)**.

Theoretically, the Ring-Star Problem is particularly rich because it sits at the crossroads of two canonical operations research problems:
- The **traveling salesman problem (TSP)**: finding the shortest cycle connecting a subset of points.
- The **p-median problem**: optimal selection of `p` centers and nearest-neighbor assignment.

---

## Mathematical modeling: the art of formulating subtours

The integer linear programming (MILP) formulation of a cycle requires eliminating "subtours" (disjoint cycles that do not cover all the selected stations). Two classical approaches exist:

1. **Dantzig-Fulkerson-Johnson (DFJ) constraints**: very tight but exponential in number, they require a dynamic cut separation algorithm (branch and cut).
2. **The flow formulation**: by injecting a fictitious flow from an origin station, with one unit consumed at each station of the cycle, connectivity is guaranteed with a polynomial number of variables and constraints.

The model used in this project follows the second approach: flow variables `z` eliminate subtours, and the problem is solved with PuLP and the CBC solver. The CPLEX and Gurobi solvers are also mentioned as alternatives.

---

## Why do exact methods give up?

As instance size grows, the branch and bound tree can grow very quickly, and computation time becomes hard to predict. The project was therefore designed with an exact approach for small instances and heuristics for larger ones.

For an interactive decision-support application, the user needs to explore several scenarios quickly. This is where **metaheuristics** come in.

---

## Stochastic descent by station swaps

The approach developed in this project relies on a two-step scheme:

```
[Set of hubs]
      │
      ▼
Greedy heuristic (grid + Maximin completion + nearest neighbor)
      │
      ▼  feasible initial solution
Stochastic descent (station swaps - SWAP)
      │
      ▼  improved solution
Retained solution
```

### Swap mechanism (SWAP)

At each step:
1. An active station `s` is chosen at random, excluding the reference station.
2. An unserved hub `v` replaces it.
3. The assignments of hubs to stations and the cycle over the stations are recomputed.
4. The total cost is recomputed.
5. The swap is kept only if it lowers the value of the objective function.

On the project's instances, local search reduces costs by **19 %** compared with the greedy approach, in under one second.

---

## Takeaways for the engineer

This study illustrates a key principle in decision engineering: **the exact solver provides a reference and a lower bound to assess quality**, but **the metaheuristic provides the responsiveness needed for interactive use**.
