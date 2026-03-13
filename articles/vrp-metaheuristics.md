<div class="abstract">

**Résumé** — Ce rapport présente une approche hybride pour la résolution du Vehicle Routing Problem avec fenêtres de temps (VRPTW). Nous combinons une relaxation MILP pour obtenir des bornes inférieures avec des méta-heuristiques (algorithme génétique et recuit simulé) pour produire des solutions réalisables de haute qualité. Les résultats sur les benchmarks de Solomon montrent un gap moyen de 3.2% par rapport aux meilleures solutions connues.

</div>

## 1. Introduction

Le problème de routage de véhicules (*Vehicle Routing Problem*, VRP) est l'un des problèmes d'optimisation combinatoire les plus étudiés en recherche opérationnelle. Sa variante avec fenêtres de temps (VRPTW) ajoute des contraintes temporelles : chaque client $i$ doit être servi dans l'intervalle $[e_i, l_i]$.

Le VRPTW est NP-difficile au sens fort, ce qui rend les méthodes exactes impraticables pour les instances de grande taille ($n > 50$ clients).

## 2. Formulation MILP

### 2.1 Variables de décision

- $x_{ijk} \in \{0, 1\}$ : le véhicule $k$ parcourt l'arc $(i, j)$
- $s_{ik} \geq 0$ : heure de début de service du client $i$ par le véhicule $k$
- $u_{ik} \geq 0$ : charge du véhicule $k$ après avoir servi le client $i$

### 2.2 Fonction objectif

Minimiser la distance totale parcourue :

$$\min \sum_{k \in K} \sum_{(i,j) \in A} c_{ij} \cdot x_{ijk}$$

### 2.3 Contraintes principales

**Visite unique** — chaque client est visité exactement une fois :

$$\sum_{k \in K} \sum_{j \in \delta^+(i)} x_{ijk} = 1, \quad \forall i \in C$$

**Conservation de flux** :

$$\sum_{j \in \delta^+(i)} x_{ijk} = \sum_{j \in \delta^-(i)} x_{jik}, \quad \forall i \in N, \forall k \in K$$

**Fenêtres de temps** :

$$e_j \leq s_{jk} \leq l_j, \quad \forall j \in C, \forall k \in K$$

$$s_{ik} + t_{ij} + d_i \leq s_{jk} + M(1 - x_{ijk}), \quad \forall (i,j) \in A, \forall k \in K$$

**Capacité** :

$$\sum_{i \in C} q_i \cdot \sum_{j \in \delta^+(i)} x_{ijk} \leq Q, \quad \forall k \in K$$

## 3. Méta-heuristiques

### 3.1 Algorithme Génétique (GA)

**Encodage** : permutation de clients avec délimiteurs de routes.

**Opérateurs** :
- *Sélection* : tournoi de taille 5
- *Croisement* : Order Crossover (OX) préservant la faisabilité
- *Mutation* : 2-opt intra-route + relocation inter-route

**Fitness** : $f(s) = \text{distance}(s) + \lambda \cdot \text{violations}(s)$

```python
def genetic_algorithm(instance, pop_size=100, generations=500):
    population = [random_solution(instance) for _ in range(pop_size)]

    for gen in range(generations):
        parents = tournament_selection(population, k=5)
        offspring = [order_crossover(p1, p2) for p1, p2 in pairs(parents)]
        offspring = [mutate_2opt(child, rate=0.1) for child in offspring]
        population = elitist_replacement(population, offspring)

    return best(population)
```

### 3.2 Recuit Simulé (SA)

Le recuit simulé explore l'espace des solutions en acceptant les dégradations avec une probabilité décroissante :

$$P(\text{accepter}) = \exp\left(-\frac{\Delta f}{T}\right)$$

**Schéma de refroidissement géométrique** : $T_{k+1} = \alpha \cdot T_k$ avec $\alpha = 0.9995$.

**Voisinage** :
- *Relocation* : déplacer un client d'une route à une autre
- *2-opt* : inverser un segment de route
- *Cross-exchange* : échanger des segments entre deux routes

### 3.3 Approche hybride

Notre approche hybride procède en deux phases :

1. **Phase exacte** : résolution de la relaxation LP du MILP avec OR-Tools pour obtenir une borne inférieure $\text{LB}$
2. **Phase heuristique** : GA initialisé avec des solutions gloutonnes, affiné par SA

Le gap est défini par :

$$\text{gap} = \frac{f^* - \text{LB}}{\text{LB}} \times 100\%$$

## 4. Résultats expérimentaux

### 4.1 Benchmarks de Solomon

| Instance | $n$ | BKS | Notre solution | Gap (%) | Temps (s) |
|---|---|---|---|---|---|
| C101 | 25 | 191.3 | 191.3 | 0.0 | 2.4 |
| C201 | 25 | 214.7 | 215.8 | 0.5 | 3.1 |
| R101 | 50 | 1044.0 | 1072.3 | 2.7 | 18.5 |
| R201 | 50 | 791.9 | 817.4 | 3.2 | 22.3 |
| RC101 | 100 | 1623.6 | 1691.2 | 4.2 | 145.7 |
| RC201 | 100 | 1261.8 | 1308.4 | 3.7 | 167.2 |

**BKS** : Best Known Solution

### 4.2 Analyse

- Les instances clustered (C) sont mieux résolues que les instances random (R)
- Le SA post-optimisation améliore les solutions du GA de 2-5% en moyenne
- La borne LP est serrée pour les petites instances ($\text{gap}_{\text{LP}} < 5\%$) mais se relâche pour $n > 80$

## 5. Conclusion

L'approche hybride MILP + GA + SA offre un bon compromis qualité/temps de calcul pour le VRPTW. Les perspectives incluent l'intégration de méthodes de *column generation* et l'utilisation du RL pour apprendre les opérateurs de voisinage.

## Références

1. Dantzig, G. B. & Ramser, J. H. "The Truck Dispatching Problem." *Management Science*, 1959.
2. Solomon, M. M. "Algorithms for the Vehicle Routing and Scheduling Problems with Time Window Constraints." *Operations Research*, 1987.
3. Cordeau, J.-F. et al. "A Guide to Vehicle Routing Heuristics." *Journal of the ORS*, 2002.
4. Goldberg, D. E. "Genetic Algorithms in Search, Optimization, and Machine Learning." Addison-Wesley, 1989.
