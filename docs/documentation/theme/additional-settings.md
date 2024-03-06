# Langues

Geotrek-rando-widget offre la possibilité de basculer d'une langue à l'autre via un bouton dédié dans le haut de la page si les randonnées sont traduites dans d'autres langages.

## Paramétrer plusieurs langues

```html
<grw-app languages="fr,en"></grw-app>
```

Actuellement seul l'anglais est prévu par défaut dans le widget, en plus du français.

Pour proposer les contenus dans une autre langue, il faut ajouter son code [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) à deux lettres (exemple : _es_, _it_, _de_) à la liste `interface AvailableTranslations` et traduire les paramètres dans le fichier _src/i18n/i18n.ts_ comme cela a été fait pour l'anglais [ici](https://github.com/GeotrekCE/Geotrek-rando-widget/blob/main/src/i18n/i18n.ts#L211).
