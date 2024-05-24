# Récupérer les données liées aux événements touristiques

Ce composant permet de récupérer les données liées aux événements touristiques. Il convient de renseigner les paramètres nécessaires.

## Paramètres obligatoires

- api: url de l'api du geotrek admin cible

## Paramètres optionnels

- languages : identifiant de la langue, fr par défaut
- in-bbox : bounding box
- cities : liste d'identifiants des villes séparés par une virgule
- districts : Liste d'identifiants des secteurs séparés par une virgule
- structures : Liste d'identifiants des structures séparés par une virgule
- themes : Liste d'identifiants des thèmes séparés par une virgule
- portals : Liste d'identifiants des portails séparés par une virgule

## Composants graphiques liés

- grw-touristic-events-list
- grw-map

## Exemple d'affichage d'une liste d'événements touristiques

```html
<grw-touristic-events-provider api="https://geotrek-admin.portcros-parcnational.fr/api/v2/" themes="1,2"></grw-touristic-events-provider>
<grw-touristic-event-detail></grw-touristic-event-detail>
```
