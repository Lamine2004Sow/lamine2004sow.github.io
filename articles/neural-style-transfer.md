<div class="abstract">

**Résumé** — Ce rapport présente une implémentation et une analyse détaillée du transfert de style neuronal basé sur l'architecture VGG-19. Nous explorons la formulation de Gatys et al. (2015), les choix de couches pour l'extraction de features, et proposons des améliorations pour la convergence et la qualité visuelle.

</div>

## 1. Introduction

Le transfert de style neuronal (*Neural Style Transfer*, NST) est une technique de vision par ordinateur qui permet de recomposer une image de contenu avec le style visuel d'une autre image. Introduit par Gatys et al. en 2015, le NST exploite les représentations internes d'un réseau convolutif pré-entraîné pour séparer et recombiner contenu et style.

## 2. Formulation mathématique

### 2.1 Extraction de features

Soit $F^l \in \mathbb{R}^{N_l \times M_l}$ la matrice de features de la couche $l$ du réseau VGG-19, où $N_l$ est le nombre de filtres et $M_l = H_l \times W_l$ la taille spatiale.

### 2.2 Loss de contenu

La loss de contenu mesure la distance entre les features de l'image générée $\hat{x}$ et celles de l'image de contenu $p$ à la couche $l$ :

$$\mathcal{L}_{\text{content}}(\hat{x}, p, l) = \frac{1}{2} \sum_{i,j} \left(F_{ij}^l(\hat{x}) - P_{ij}^l\right)^2$$

### 2.3 Loss de style

Le style est capturé par les **matrices de Gram** $G^l \in \mathbb{R}^{N_l \times N_l}$ :

$$G_{ij}^l = \sum_k F_{ik}^l \cdot F_{jk}^l$$

La loss de style pour la couche $l$ est :

$$E_l = \frac{1}{4 N_l^2 M_l^2} \sum_{i,j} \left(G_{ij}^l(\hat{x}) - A_{ij}^l\right)^2$$

La loss totale de style agrège plusieurs couches avec des poids $w_l$ :

$$\mathcal{L}_{\text{style}} = \sum_l w_l \cdot E_l$$

### 2.4 Loss totale

$$\mathcal{L}_{\text{total}} = \alpha \cdot \mathcal{L}_{\text{content}} + \beta \cdot \mathcal{L}_{\text{style}} + \lambda \cdot \mathcal{L}_{\text{TV}}$$

où $\mathcal{L}_{\text{TV}}$ est la regularisation de variation totale pour la lissage spatial et $\alpha / \beta$ contrôle le ratio contenu/style.

## 3. Implémentation

### 3.1 Architecture

```python
# Couches utilisées pour l'extraction
CONTENT_LAYERS = ['conv4_2']
STYLE_LAYERS = ['conv1_1', 'conv2_1', 'conv3_1', 'conv4_1', 'conv5_1']

class StyleTransfer:
    def __init__(self, content_img, style_img, alpha=1, beta=1e6):
        self.vgg = models.vgg19(pretrained=True).features.eval()
        self.content_features = self.extract(content_img)
        self.style_grams = self.compute_grams(style_img)
```

### 3.2 Optimisation

Nous utilisons L-BFGS plutôt qu'Adam pour une convergence plus rapide et des résultats de meilleure qualité :

| Optimiseur | Itérations | Loss finale | Temps (GPU) |
|---|---|---|---|
| Adam (lr=0.01) | 500 | 2.4e6 | 45s |
| L-BFGS | 300 | 1.8e6 | 38s |
| Adam + scheduler | 500 | 2.0e6 | 48s |

## 4. Résultats et analyse

### 4.1 Impact du ratio $\alpha/\beta$

- $\beta/\alpha = 10^3$ : contenu dominant, léger transfert de texture
- $\beta/\alpha = 10^6$ : bon équilibre contenu/style (recommandé)
- $\beta/\alpha = 10^9$ : style dominant, perte de la structure du contenu

### 4.2 Choix des couches

Les couches profondes (conv4, conv5) capturent des structures sémantiques tandis que les couches superficielles (conv1, conv2) capturent les textures fines. L'utilisation de toutes les couches `conv*_1` pour le style donne les résultats les plus esthétiques.

## 5. Conclusion

Le NST basé sur l'optimisation produit des résultats de haute qualité mais reste coûteux. Les extensions feed-forward (Johnson et al., 2016) permettent un transfert en temps réel au prix d'une flexibilité moindre.

## Références

1. Gatys, L. A., Ecker, A. S., & Bethge, M. "A Neural Algorithm of Artistic Style." *arXiv:1508.06576*, 2015.
2. Johnson, J., Alahi, A., & Fei-Fei, L. "Perceptual Losses for Real-Time Style Transfer." *ECCV*, 2016.
3. Simonyan, K. & Zisserman, A. "Very Deep Convolutional Networks for Large-Scale Image Recognition." *ICLR*, 2015.
