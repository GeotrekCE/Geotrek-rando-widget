# Récupérer les données liées à un itinéraire

Ce composant permet de récupérer les données liées à un itinéraire. Il convient de renseigner les paramètres nécessaires.

## Paramètres obligatoires

- api: url de l'api du geotrek admin cible
- trek-id: Identifiant de l'itinéraire

## Paramètres optionnels

- languages : identifiant de la langue, fr par défaut

## Composants graphiques liés

- grw-trek-detail
- grw-trek-card
- grw-map

## Exemple d'affichage du détail d'un itinéraire

```html
<grw-trek-provider api="https://geotrek-admin.portcros-parcnational.fr/api/v2/" trek-id="690"></grw-trek-provider> <grw-trek-detail></grw-trek-detail>
```
