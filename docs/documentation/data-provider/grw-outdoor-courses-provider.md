# Récupérer les données liées aux parcours outdoor

Ce composant permet de récupérer les données liées aux parcours outdoor. Il convient de renseigner les paramètres nécessaires.

## Paramètres obligatoires

- api: url de l'api du geotrek admin cible

## Paramètres optionnels

- languages : identifiant de la langue, fr par défaut
- in-bbox : Bounding box
- cities : liste d'identifiants des villes séparés par une virgule
- districts : Liste d'identifiants des secteurs séparés par une virgule
- structures : Liste d'identifiants des structures séparés par une virgule
- themes : Liste d'identifiants des thèmes séparés par une virgule
- portals : Liste d'identifiants des portails séparés par une virgule

## Composants graphiques liés

- grw-outdoor-courses-list
- grw-map

## Exemple d'affichage d'une liste de parcours outdoor

```html
<grw-outdoor-courses-provider api="https://admin.escapade62.fr/api/v2/" themes="1,2"></grw-outdoor-courses-provider><grw-outdoor-courses-list></grw-outdoor-courses-list>
```
