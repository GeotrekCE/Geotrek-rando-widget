# Gestion de la liste des activités outdoor

<center>
  <a title="Liste des activités outdoor"><img src="/components/list_outdoor.jpg" alt="Liste des activités outdoor"></a>
</center>

## Comportement et design

- Au survol d'une activité outdoor dans la liste, le pictogramme est agrandi sur la carte et le tracé est affiché
- Affichage d'un carrousel pour faire défiler plusieurs images
- Le pictogramme de la pratique de l'activité est affiché (char à voile, course d'orientation, escalade etc.)

## Filtre et recherche

- Recherche d'une activité par son nom
- Filtre sur la pratique
- Filtre sur les randonnées rattachées à une ou plusieurs communes, secteurs
- Réinitialisation des filtres

::: warning
Actuellement Geotrek-rando-widget ne peut pas remonter plus de de 999 éléments dans la liste
:::

## Désactiver l'affichage des activités dans le widget

Il est possible de paramétrer le widget de façon à valoriser une offre de contenus touristiques sans forcément mettre en avant les activités outdoors associées.

::: info
Par défaut, celles-ci sont visibles et matérialisées par une barre de segments permettant de les filtrer séparément des autres contenus (itinéraires, évènements).
:::

```html
<grw-app outdoor="false"></grw-app>
```
