<div class="abstract">

**Résumé** — Cet article présente une étude comparative de deux algorithmes d'apprentissage par renforcement multi-agent (MARL) — MADDPG et QMIX — appliqués à des scénarios de navigation coopérative avec obstacles dynamiques. Nous montrons que MADDPG converge plus rapidement dans les environnements à communication limitée, tandis que QMIX offre une meilleure stabilité à long terme dans les configurations avec plus de 4 agents.

</div>

## 1. Introduction

L'apprentissage par renforcement multi-agent (MARL) est un domaine en pleine expansion qui vise à entraîner plusieurs agents à interagir dans un environnement partagé. Contrairement au RL mono-agent, le MARL doit faire face à des défis supplémentaires :

- **Non-stationnarité** : chaque agent modifie l'environnement pour les autres
- **Crédit partiel** : difficulté à attribuer la récompense individuelle dans un objectif commun
- **Scalabilité** : la complexité croît exponentiellement avec le nombre d'agents

Dans ce travail, nous comparons deux approches fondamentalement différentes :

1. **MADDPG** (Multi-Agent Deep Deterministic Policy Gradient) — approche actor-critic centralisée
2. **QMIX** — factorisation de la Q-value jointe sous contrainte de monotonicité

## 2. Formalisme

### 2.1 Jeu stochastique de Markov

Un jeu stochastique à $N$ agents est défini par le tuple $\langle \mathcal{S}, \mathcal{A}_1, \ldots, \mathcal{A}_N, \mathcal{T}, R_1, \ldots, R_N, \gamma \rangle$ où :

- $\mathcal{S}$ est l'espace d'états global
- $\mathcal{A}_i$ est l'espace d'actions de l'agent $i$
- $\mathcal{T}: \mathcal{S} \times \mathcal{A}_1 \times \cdots \times \mathcal{A}_N \rightarrow \mathcal{S}$ est la fonction de transition
- $R_i: \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R}$ est la récompense de l'agent $i$
- $\gamma \in [0, 1)$ est le facteur de discount

### 2.2 MADDPG

MADDPG étend DDPG au cadre multi-agent avec un **entraînement centralisé et une exécution décentralisée** (CTDE). Le critique de chaque agent $i$ a accès aux observations et actions de tous les agents :

$$Q_i^\mu(\mathbf{x}, a_1, \ldots, a_N) = \mathbb{E}\left[\sum_{t=0}^{\infty} \gamma^t r_i^t \mid \mathbf{x}_0 = \mathbf{x}, a_j^0 = a_j\right]$$

Le gradient de la politique est :

$$\nabla_{\theta_i} J(\mu_i) = \mathbb{E}_{\mathbf{x}, a \sim \mathcal{D}}\left[\nabla_{\theta_i} \mu_i(o_i) \cdot \nabla_{a_i} Q_i^\mu(\mathbf{x}, a_1, \ldots, a_N)\big|_{a_i = \mu_i(o_i)}\right]$$

### 2.3 QMIX

QMIX factorise la Q-value jointe $Q_{tot}$ comme une combinaison monotone des Q-values individuelles :

$$Q_{tot}(\boldsymbol{\tau}, \mathbf{a}) = f\left(Q_1(\tau_1, a_1), \ldots, Q_N(\tau_N, a_N); s\right)$$

sous la contrainte de monotonicité :

$$\frac{\partial Q_{tot}}{\partial Q_i} \geq 0, \quad \forall i \in \{1, \ldots, N\}$$

Cette contrainte est garantie par un réseau de mélange (mixing network) dont les poids sont produits par des hypernetworks et sont contraints à être positifs.

## 3. Environnement expérimental

Notre environnement est basé sur MPE (Multi-Particle Environment) de PettingZoo avec les modifications suivantes :

- **Obstacles dynamiques** : 3 à 8 obstacles se déplaçant selon des trajectoires sinusoïdales
- **Landmarks** : positions cibles que les agents doivent atteindre collectivement
- **Communication** : canal de communication discret optionnel entre agents

### Configuration

| Paramètre | Valeur |
|---|---|
| Nombre d'agents | 3, 5, 8 |
| Taille de l'arène | $[-1, 1]^2$ |
| Obstacles dynamiques | 3, 5, 8 |
| Taux d'apprentissage actor | $3 \times 10^{-4}$ |
| Taux d'apprentissage critic | $1 \times 10^{-3}$ |
| Taille du batch | 1024 |
| Buffer replay | $10^6$ |
| $\gamma$ | 0.95 |

## 4. Résultats

### 4.1 Convergence

Pour $N = 3$ agents, MADDPG atteint 90% de la récompense optimale en **~150k épisodes**, contre **~250k** pour QMIX. Cependant, pour $N = 8$, QMIX présente une variance significativement plus faible :

$$\text{Var}[\hat{R}]_{\text{QMIX}} \approx 0.12 \quad \text{vs.} \quad \text{Var}[\hat{R}]_{\text{MADDPG}} \approx 0.45$$

### 4.2 Scalabilité

La complexité de MADDPG en mémoire est $\mathcal{O}(N^2)$ car chaque critique observe tous les agents, tandis que QMIX reste en $\mathcal{O}(N)$ grâce à la factorisation.

## 5. Conclusion

MADDPG et QMIX offrent des compromis différents pour le MARL coopératif. Pour les petits groupes d'agents ($N \leq 4$) avec communication, MADDPG est préférable. Pour les configurations à grande échelle, QMIX offre une meilleure stabilité et scalabilité.

## Références

1. Lowe, R. et al. "Multi-Agent Actor-Critic for Mixed Cooperative-Competitive Environments." *NeurIPS*, 2017.
2. Rashid, T. et al. "QMIX: Monotonic Value Function Factorisation for Deep Multi-Agent Reinforcement Learning." *ICML*, 2018.
3. Terry, J. et al. "PettingZoo: Gym for Multi-Agent Reinforcement Learning." *NeurIPS*, 2021.
