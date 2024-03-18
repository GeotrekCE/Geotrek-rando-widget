# Progressive web app

## Intégration

Le composant grw-app peut être intégré dans une pwa et permet de rendre disponible en hors ligne les itinéraires mais nécessite des configurations supplémentaires.

Tout d'abord, voici comment activer la fonctionnalité du hors ligne :

```html
<grw-app enable-offline="true" ...></grw-app>
```

Mais afin que le composant puissent fonctionner hors ligne, il faut modifier le service worker du site auquel il sera intégré.
Celui-ci doit permettre de mettre cache les trois fichiers nécessaires à son fonctionnement ainsi que des images.

Si vous utiliser workbox pour gérer le service worker, voici un exemple de configuration :

```js
workbox.precacheAndRoute(
    [
      ...,
      {
        url: "https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.esm.js",
        revision: "1",
      },
      {
        url: "https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.js",
        revision: "1",
      },
      {
        url: "https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.css",
        revision: "1",
      },
      {
        url: "https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/assets/contract.svg",
        revision: "1",
      },
      {
        url: "https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/assets/default-image.svg",
        revision: "1",
      },
      {
        url: "https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/assets/layers.svg",
        revision: "1",
      },
      {
        url: "https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/assets/parking.svg",
        revision: "1",
      },
    ]
```

Il conviendra d'incrémenter le numéro de revision lorsque vous voulez que l'application mette à jour ces fichiers.

Un exemple de PWA est disponible ici : https://demo-rando-widget.geotrek.fr/
