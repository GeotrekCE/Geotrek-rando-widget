# Gestion de la liste des contenus touristiques (services)

<center>
  <a title="Liste des services"><img src="/components/list_touristic_content.png" alt="Liste des services"></a>
</center>

## Comportement et design

- Au survol d'un service dans la liste, le pictogramme est agrandi sur la carte
- Affichage d'un carrousel pour faire défiler plusieurs images
- Le pictogramme de la catégorie du service est affiché (hébergements, sorties, musées etc.)

## Filtre et recherche

- Recherche d'un service par son nom
- Filtre sur la catégorie de service
- Réinitialisation des filtres

::: warning
Actuellement Geotrek-rando-widget ne peut pas remonter plus de de 999 éléments dans la liste
:::

## Désactiver l'affichage des services dans le widget

Il est possible de paramétrer le widget de façon à valoriser une offre de contenus touristiques sans forcément mettre en avant les balades associées.

::: info
Par défaut, celles ci sont visibles et matérialisées par une barre de segments permettant de les filtrer séparément des autres contenus (itinéraires, évènements touristiques).
:::

```html
<grw-app touristic-events="false"></grw-app>
```
