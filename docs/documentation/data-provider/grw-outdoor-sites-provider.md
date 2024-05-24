# Récupérer les données liées aux sites outdoor

Ce composant permet de récupérer les données liées aux sites outdoor. Il convient de renseigner les paramètres nécessaires.

## Paramètres obligatoires

- api: url de l'api du geotrek admin cible

## Paramètres optionnels

- languages : identifiant de la langue, fr par défaut
- in-bbox : Bounding box
- cities : liste d'identifiants des villes séparés par une virgule
- districts : liste d'identifiants des secteurs séparés par une virgule
- structures : liste d'identifiants des structures séparés par une virgule
- themes : liste d'identifiants des thèmes séparés par une virgule
- portals : liste d'identifiants des portails séparés par une virgule

## Composants graphiques liés

- grw-outdoor-sites-list
- grw-map

## Exemple d'affichage d'une liste de sites outdoor

```html
<grw-outdoor-sites-provider api="https://admin.escapade62.fr/api/v2/" themes="1,2"></grw-outdoor-sites-provider><grw-outdoor-sites-list></grw-outdoor-sites-list>
```
