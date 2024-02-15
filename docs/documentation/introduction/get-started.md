# Installation

## Configuration dans le Storybook

Le widget peut être facilement testé et configuré à l'aide d'un outil de construction appelé [**Storybook**](https://geotrekce.github.io/Geotrek-rando-widget/?path=/story/geotrek-rando-widget--app). Il se base sur les identifiants d'objets dans Geotrek-admin, permet d'appliquer des filtres potentiels et d'ajuster le style selon les besoins.

Voici les différentes étapes à suivre :

1. L'API doit au préalable autoriser les requêtes issues de geotrekce.github.io

2. Adapter le code du widget dans le Storybook en éditant les controls : changer le fond de plan cartographique, les couleurs, la langue, l'attribution, l'API, les paramètres de requête

3. Se rendre sur l'onglet Docs puis cliquer sur Show code pour afficher le code source qu'il vous faudra inclure dans votre site Web

<center>
  <a title="Storybook"><img src="/introduction/storybook.png" alt="Storybook"></a>
</center>
 
 ::: tip
- Dans les champs filtre (cities, districts, structures, themes, portals, etc.) il faut indiquer les identifiants des objets et non leur nom.
- Pour connaître le lien entre identifiant et nom des objets, il est possible d'utiliser l'api (exemple pour lister l'ensemble des secteurs : https://randoadmin.parc-haut-jura.fr/api/v2/district/)
- Il faut que l'itinéraire soit publié sur Geotrek-admin pour apparaître sur Geotrek-rando-widget

:::

## Intégration sur un site internet

1. L'API doit au préalable autoriser n'importe qui à accéder aux données ou autoriser explicitement un nom de domaine

2. Copier-coller ces balises HTML dans la section <head></head> du site web

```html
<link rel="stylesheet" href="https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.css" />
<script type="module" src="https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.esm.js"></script>
<script nomodule src="https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.js"></script>
```

3. Insérer le code source du widget généré à la dernière étape de la section précédente, dans la section du site Web dans laquelle il devra s'afficher
