---
title: "Ring-Star — Optimizing a circular metro line"
description: "MILP modeling and heuristics to design the route of a circular metro line, trading off the cost of the loop against users' access distance."
result: "19 % lower cost than the greedy approach, in under one second."
joke: "NP-hard, like my attempts to find the shortest route to the metro on rainy mornings."
date: "2026-01"
tags: ["Operations research", "MILP", "Metaheuristics", "Python"]
github: "https://github.com/Lamine2004Sow/ring-star"
---

Optimization project (SAÉ, Université Sorbonne Paris Nord, Sup Galilée, 2025-2026) on the **Ring-Star Problem**: designing a circular metro line that covers a territory at the lowest cost.

## Problem

Among `n` activity hubs, exactly `p` must be chosen as stations:

- the stations are connected by **a single circular line** (the ring);
- each hub that is not served is attached by a **star link** (walking, shuttle) to the nearest station.

The objective combines two costs: the construction and operating cost of the loop, and the access cost for users from their hub to their station. The trade-off is central: more stations lengthen the cycle, but shorten access trips.

The problem is NP-hard: it generalizes the traveling salesman problem (case `p = n`, no star) and the p-median problem (case where the cost of the ring is zero).

## Modeling (MILP)

The mixed-integer linear programming model uses three families of variables:

- `y[i][j]` binary: equals 1 if hub `i` is attached to station `j`; `y[j][j]` equals 1 if `j` is a station;
- `x[i][j]` binary: equals 1 if edge `{i, j}` belongs to the cycle (for `i < j`);
- `z[i][j]` continuous non-negative: flow variables that eliminate subtours and ensure the connectivity of the cycle.

Objective function, with `D` the distance matrix and `alpha` the weight of the cycle:

```
min  alpha * somme(D[i][j] * x[i][j])  +  somme(D[i][j] * y[i][j])
```

Main constraints: exactly `p` stations; unique assignment of each hub; `y[i][j] <= y[j][j]`; reference station fixed; degree 2 in the cycle for each station; connectivity through the flow (`z[i][j] + z[j][i] <= (p - 1) * x[i][j]`).

The model is solved with PuLP and the CBC, CPLEX and Gurobi solvers.

## Heuristics

For larger instances, two approximate methods are implemented.

**1. Greedy heuristic.** In four phases:

1. grid partitioning: a non-empty cell provides the hub closest to its center;
2. Maximin completion: while the number of stations is below `p`, add the hub whose minimum distance to the stations already chosen is maximal;
3. assignment of each hub to the nearest station;
4. construction of the cycle over the stations by the nearest-neighbor algorithm, starting from the reference station.

**2. Stochastic descent by swaps (SWAP).** A move removes a station (other than the reference station), replaces it with a non-station hub, then recomputes assignments, cycle and cost. The move is accepted only if it decreases the cost. This approach does not guarantee the global optimum, but in practice it improves the greedy solution.

## Results

In the CV, the results are summarized as follows: the heuristics and local search reduce costs by **19 %** compared with the greedy approach, in under one second.

## Stack

Python. MILP modeling with PuLP, solved with CBC, CPLEX or Gurobi. Heuristics and local search implemented in Python.
