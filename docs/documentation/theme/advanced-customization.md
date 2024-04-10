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

# Personnalisation avancée

::: info
Cette section décrit comment surcharger finement le style de chaque composant existant dans Geotrek-rando-widget.

Dans la plupart des cas, la configuration standard du widget répond aux principaux besoins via la possibilité de modifier les couleurs, la police, les filtres, les fonds de plan, etc. Pour cela il faut se référer à la section [Composants - Application](../components/grw-app.html) 

La personnalisation décrite sur cette page va plus loin que la configuration standard, par conséquent il est recommandé d'avoir des compétences en développement et CSS.
:::


## Personnalisation et Shadow DOM

Geotrek-rando-widget utilise des composants web avec le [Shadow DOM](https://developer.mozilla.org/fr/docs/Web/API/Web_components/Using_shadow_DOM). Par conséquent, le CSS externe ne peut pas agir sur ses composants. C'est un point positif, néanmoins, cela ne permet pas de les personnaliser finement comme on pourrait le faire habituellement en surchargeant, par exemple, les classes.

Il existe quand même une solution permettant de personnaliser le rendu visuel. On doit pour cela utiliser l'élément CSS [`::part()`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part). 

## Utilisation de l'élément CSS `::part()`

L'élément [`::part()`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) fonctionne relativement comme les classes mais possède quelques particularités.

Ce dernier étant indépendant, il n'est donc pas possible de personnaliser un autre élément à partir de celui-ci, comme on pourrait le faire en CSS, en écrivant par exemple :

```css
.container .element {
  background-color: #ff0000;
}
```

De plus, on doit sélectionner `::part()` depuis le premier élément de son arbre.

Par conséquent, si l'on veut personnaliser la balise `grw-card` et qu'on l'utilise directement, il est possible le faire de cette façon :

```css
grw-trek-card::part(trek-name) {
  background-color: #ff0000;
}
```

En revanche, si l'on utilise la balise `grw-treks-list` qui affiche une liste de `grw-trek-card` alors il convient de personnaliser la part de `grw-trek-card` depuis `grw-treks-list` comme ceci :

```css
grw-treks-list::part(trek-name) {
  background-color: #ff0000;
}
```

::: info
`grw-app` est un composant particulier qui n'utilise pas le Shadow DOM, il ne sera donc pas le premier élément de l'arbre. Chacune de ces classes est préfixée par `grw-` et peut donc être personnalisée de manière classique.
:::

## Comment trouver la `::part()` cible ?

Le plus simple est d'utiliser l'inspecteur de code de votre navigateur et de parcourir les composants HTML qui composent votre widget afin de trouver le nom de la `::part()` souhaitée.

## Exemple de personnalisation en utilisant `grw-app`

Cet exemple illustre le changement de la couleur de fond du composant `grw-trek-card` ainsi que la couleur du titre de `grw-trek-detail`.

```css
grw-treks-list::part(trek-card) {
  background-color: #ff0000;
}

grw-trek-detail::part(trek-name) {
  color: #ff0000;
}
```

Ce qui donne ce résultat :

<div id="advanced-customization-result-container">
<grw-app
      api="https://prod-geotrek-pnrlat-admin.makina-corpus.net/api/v2/"
      portals="4"
      name-layer="IGN"
      url-layer="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
      attribution-layer="<a target='_blank' href='https://ign.fr/'>IGN</a>"
    ></grw-app>
</div>
