# Progressive web app

## Intégration

Le composant grw-app peut être intégré dans une [PWA](https://developer.mozilla.org/fr/docs/Web/Progressive_web_apps) et permet de rendre disponibles en hors ligne les itinéraires. 

Tout d'abord, voici comment activer la fonctionnalité du hors ligne :

```html
<grw-app enable-offline="true" ...></grw-app>
```

Afin que le composant puisse fonctionner en étant hors ligne, il faut modifier le service worker du site auquel il sera intégré.

