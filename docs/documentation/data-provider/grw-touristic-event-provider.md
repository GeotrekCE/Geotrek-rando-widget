# Récupérer les données liées à un événement touristique

Ce composant permet de récupérer les données liées à un événement touristique. Il convient de renseigner les paramètres nécessaires.

## Paramètres obligatoires

- api: url de l'api du geotrek admin cible
- touristic-event-id: identifiant de l'événement touristique

## Paramètres optionnels

- languages : identifiant de la langue, fr par défaut

## Composants graphiques liés

- grw-touristic-event-detail
- grw-touristic-event-card
- grw-map

## Exemple d'affichage du détail d'un événement touristique

```html
<grw-touristic-event-provider api="https://geotrek-admin.portcros-parcnational.fr/api/v2/" touristic-event-id="935"></grw-touristic-event-provider>
<grw-touristic-event-detail></grw-touristic-event-detail>
```
