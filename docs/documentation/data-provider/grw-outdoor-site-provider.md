# Récupérer les données liées à un site outdoor

Ce composant permet de récupérer les données liées à un site outdoor. Il convient de renseigner les paramètres nécessaires.

## Paramètres obligatoires

- api: url de l'api du geotrek admin cible
- outdoor-site-id: Identifiant du site outdoor

## Paramètres optionnels

- languages : identifiant de la langue, fr par défaut

## Composants graphiques liés

- grw-outdoor-site-detail
- grw-outdoor-site-card
- grw-map

## Exemple d'affichage du détail d'un site outdoor

```html
<grw-outdoor-site-provider api="https://admin.escapade62.fr/api/v2/" outdoor-site-id="197"></grw-outdoor-site-provider> <grw-outdoor-site-detail></grw-outdoor-site-detail>
```
