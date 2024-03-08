# Gestion de la liste des randonnées

<center>
  <a title="Liste des randonnées"><img src="/components/list_trek.jpg" alt="Liste des randonnées"></a>
</center>

## Comportement et design

- Au survol d'un itinéraire dans la liste, le pictogramme est agrandi sur la carte et le tracé est affiché
- Affichage d'un carrousel pour faire défiler plusieurs images
- Le pictogramme de la pratique de l'itinéraire est affiché (pédestre, vélo, cheval, etc.)

## Filtre et recherche

- Recherche d'une randonnée par son nom
- Filtre sur les caractéristiques : type de parcours, longueur, dénivelé, accessibilité, labels (étiquettes)
- Filtre sur les randonnées rattachées à une ou plusieurs communes, secteurs, thèmes
- Réinitialisation des filtres

::: warning
Actuellement Geotrek-rando-widget ne peut pas remonter plus de de 999 éléments dans la liste
:::

## Désactiver l'affichage des randonnées dans le widget

Il est possible de paramétrer le widget de façon à valoriser une offre de contenus touristiques sans forcément mettre en avant les balades associées.

::: info
Par défaut, celles-ci sont visibles et matérialisées par une barre de segments permettant de les filtrer séparément des autres contenus (itinéraires, évènements touristiques).
:::

```html
<grw-app treks="false"></grw-app>
```
