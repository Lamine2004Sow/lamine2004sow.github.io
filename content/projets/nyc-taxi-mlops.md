---
title: "Plateforme MLOps auto-réparatrice — NYC Taxi"
short: "MLOPS"
description: "Un modèle de durée de course NYC servi sur Kubernetes, surveillé par Prometheus et réentraîné automatiquement quand ses performances se dégradent."
result: "Choc COVID d’avril 2020 détecté et corrigé sans intervention : MAE holdout de 4,49 à 3,09 min après réentraînement et promotion automatiques."
date: "2026-10"
tags: ["MLOps", "Kubernetes", "MLflow", "Prometheus", "FastAPI"]
github: "https://github.com/Lamine2004Sow/nyc-taxi-mlops"
order: 2
---

Plateforme MLOps complète qui tourne en local sur un cluster Kubernetes (kind) : un modèle prédit la durée d’une course de taxi à New York, une API le sert, et la chaîne de surveillance le remplace toute seule quand il se dégrade.

## Ce que fait la plateforme

- **Service.** Une API FastAPI sur Kubernetes sert le modèle via l’alias MLflow « champion », rechargé à chaud quand un nouveau modèle est promu.
- **Surveillance.** Une alerte Prometheus se déclenche quand la MAE dépasse 1,15 × la référence. Alertmanager lance alors un Job Kubernetes de réentraînement.
- **Promotion prudente.** Le modèle challenger n’est promu que s’il bat le champion d’au moins 2 % sur des données jamais vues.
- **Observabilité.** Dashboards Grafana, rapports de dérive Evidently, CI GitHub Actions avec une baseline contractuelle.

## Résultats

- Durée de course prédite à environ **3,3 min de MAE**, 17 % mieux que la médiane par trajet.
- **Rejeu de février à juillet 2020** : la dégradation due au COVID (avril) est détectée, le réentraînement est lancé et le challenger promu automatiquement. MAE holdout : **4,49 → 3,09**.

## Stack

Python, FastAPI, MLflow (registry + Postgres), Kubernetes (kind), Helm, Prometheus, Alertmanager, Grafana, Evidently, Docker Compose, GitHub Actions, uv.
