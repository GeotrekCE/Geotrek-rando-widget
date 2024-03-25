# Progressive web app

## Intégration

Le composant grw-app peut être intégré dans une pwa et permet de rendre disponible en hors ligne les itinéraires mais nécessite des configurations supplémentaires.

Tout d'abord, voici comment activer la fonctionnalité du hors ligne :

```html
<grw-app enable-offline="true" ...></grw-app>
```

Mais afin que le composant puissent fonctionner hors ligne, il faut modifier le service worker du site auquel il sera intégré.
