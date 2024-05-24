# Récupérer les données liées à un contenu touristique

Ce composant permet de récupérer les données liées à un contenu touristique. Il convient de renseigner les paramètres nécessaires.

## Paramètres obligatoires

- api: url de l'api du geotrek admin cible
- touristic-content-id: identifiant de l'événement touristique

## Paramètres optionnels

- languages : identifiant de la langue, fr par défaut

## Composants graphiques liés

- grw-touristic-content-detail
- grw-touristic-content-card
- grw-map

## Exemple d'affichage du détail d'un contenu touristique

```html
<grw-touristic-content-provider api="https://geotrek-admin.portcros-parcnational.fr/api/v2/" touristic-content-id="935"></grw-touristic-content-provider>
<grw-touristic-content-detail></grw-touristic-content-detail>
```
