# Récupérer les données liées aux itinéraires

Ce composant permet de récupérer les données liées aux itinéraires. Il convient de renseigner les paramètres nécessaires.

## Paramètres obligatoires

- api: url de l'api du geotrek admin cible

## Paramètres optionnels

- languages : identifiant de la langue, fr par défaut
- in-bbox : bounding box
- cities : liste d'identifiants des villes séparés par une virgule
- districts : liste d'identifiants des secteurs séparés par une virgule
- structures : liste d'identifiants des structures séparés par une virgule
- themes : liste d'identifiants des thèmes séparés par une virgule
- portals : liste d'identifiants des portails séparés par une virgule
- routes : liste d'identifiants des types de parcours séparés par une virgule
- practices : liste d'identifiants des pratiques séparés par une virgule
- labels : liste d'identifiants des étiquettes séparés par une virgule

## Composants graphiques liés

- grw-treks-list
- grw-map

## Exemple d'affichage d'une liste d'itinéraires

```html
<grw-treks-provider api="https://geotrek-admin.portcros-parcnational.fr/api/v2/" themes="1,2"></grw-treks-provider> <grw-treks-list></grw-treks-list>
```
