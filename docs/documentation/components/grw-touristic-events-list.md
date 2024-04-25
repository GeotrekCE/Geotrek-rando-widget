# Gestion de la liste des évènements touristiques

<center>
  <a title="Liste des évènements"><img src="/components/list_touristic_event.jpg" alt="Liste des évènements"></a>
</center>

## Comportement et design

- Au survol d'un évènement dans la liste, le pictogramme est agrandi sur la carte
- Affichage d'un carrousel pour faire défiler plusieurs images
- Le pictogramme de la catégorie de l'évènement est affiché (exposition, atelier, conférence, etc.)

## Filtre et recherche

- Recherche d'un évènement par son nom
- Filtre sur la catégorie d'évènement
- Filtre sur la date
- Réinitialisation des filtres

::: warning
Actuellement Geotrek-rando-widget ne peut pas remonter plus de de 999 éléments dans la liste
:::

## Désactiver l'affichage des évènements dans le widget

Il est possible de paramétrer le widget de façon à valoriser une offre de contenus touristiques sans forcément mettre en avant les évènements associés.

::: info
Par défaut, ceux-ci sont visibles et matérialisés par une barre de segments permettant de les filtrer séparément des autres contenus (itinéraires, services).
:::

```html
<grw-app touristic-events="false"></grw-app>
```
