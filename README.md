# Portfolio — [Ton Prénom Nom]

Portfolio académique et professionnel déployé sur GitHub Pages avec le thème [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy).

**URL** : https://lamine2004sow.github.io

## Ajouter du contenu

Tous les contenus (projets, rapports, démos) sont des fichiers Markdown dans `_posts/`.

### Nommage des fichiers

```
YYYY-MM-DD-titre-du-post.md
```

### Catégories disponibles

| Catégorie | Usage |
|-----------|-------|
| `Projets` | Projets techniques |
| `Rapports` | Rapports académiques / professionnels |
| `Démos` | Démonstrations interactives |

### Front matter minimal

```yaml
---
title: "Titre du post"
date: 2026-03-20 10:00:00 +0100
categories: [Projets]
tags: [python, embarqué]
description: "Une ligne de description."
---
```

## Développement local

```bash
gem install bundler
bundle install
bundle exec jekyll serve
# → http://localhost:4000
```

## Déploiement

Push sur `main` → GitHub Actions construit et déploie automatiquement.

Sur GitHub : Settings → Pages → Source = **GitHub Actions**
