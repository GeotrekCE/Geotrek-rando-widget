---
head:
  - - script
    - defer: true
      nomodule: true
      src: https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.js
  - - script
    - defer: true
      type: module
      src: https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.esm.js
  - - link
    - href: https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.css
      rel: stylesheet
---

# Personnalisations avancées

## Personnalisation et shadow dom

Geotrek rando widget utilise le [shadow-dom](https://developer.mozilla.org/fr/docs/Web/API/Web_components/Using_shadow_DOM). De ce fait, le css externe ne peut pas agir sur ses composants. C'est un point positif, néanmoins, ça empêche de les personnaliser finement comme on pourrait le faire d'habitude en surchargeant, par exemple, les classes.

Il existe quand même une solution afin de pouvoir personnaliser le rendu visuel. On doit utiliser [part](https://developer.mozilla.org/en-US/docs/Web/CSS/::part).

## Utilisation de part

Part fonctionne relativement comme les classes mais a quelques particularités.

Une part est indépendante. On ne peut donc pas personnalisé un autre élément à partir de celle-ci comme on pourrait le faire en css, par exemple :

```css
.container .element {
  background-color: #ff0000;
}
```

De plus, on doit sélectionner la part depuis le premier élément de son arbre.
Donc si on veut personnalider grw-card et qu'on l'utilise directement, on peut le faire de cette façon :

```css
grw-trek-card::part(trek-name) {
  background-color: #ff0000;
}
```

Par contre, si on utilise grw-treks-list qui affiche une liste de grw-trek-card alors on devrait personnaliser la part de grw-trek-card depuis grw-treks-list comme ceci :

```css
grw-treks-list::part(trek-name) {
  background-color: #ff0000;
}
```

::: info
grw-app est un composant particulier et n'utilise pas le shadow-dom donc il ne sera pas le premier élément de l'arbre. Chacune de ces classes est préfixée par grw- et peut donc être personnalisé de manière classique.
:::

## Comment trouver la part cible

Cette personnalisation est un concept avancée, on part du principe que vous avez un minimum de compétence en développement.
Le plus simple est d'utiliser l'inspecteur de code afin de trouver le nom de la part que l'on veut utiliser.

## Exemple de personnalisation en utilisant grw-app

Nous allons changer la couleur de fond du composant grw-trek-card ainsi que la couleur du titre de grw-trek-detail.

```css
grw-treks-list::part(trek-card) {
  background-color: #ff0000;
}

grw-trek-detail::part(trek-name) {
  color: #ff0000;
}
```

Ce qui donne ce résultat :

<div id="advanted-customization-result-container">
<grw-app
      api="https://geotrek-admin.portcros-parcnational.fr/api/v2/"
      name-layer="IGN"
      url-layer="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
      attribution-layer="<a target='_blank' href='https://ign.fr/'>IGN</a>"
    ></grw-app>
</div>
