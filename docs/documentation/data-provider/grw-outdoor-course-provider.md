# Récupérer les données liées à un parcours outdoor

Ce composant permet de récupérer les données liées à un parcours outdoor. Il convient de renseigner les paramètres nécessaires.

## Paramètres obligatoires

- api: url de l'api du geotrek admin cible
- outdoor-course-id: identifiant du parcours outdoor

## Paramètres optionnels

- languages : identifiant de la langue, fr par défaut

## Composants graphiques liés

- grw-outdoor-course-detail
- grw-outdoor-course-card
- grw-map

## Exemple d'affichage du détail d'un parcours outdoor

```html
<grw-outdoor-course-provider api="https://admin.escapade62.fr/api/v2/" outdoor-course-id="566"></grw-outdoor-course-provider>
<grw-outdoor-course-detail></grw-outdoor-course-detail>
```
