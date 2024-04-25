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

## Code

Pour afficher uniquement les **contenus touristiques** (Services) dans le widget, il faut que la balise `grw-app` embarque le paramètre suivant à `true` : 

```html
<grw-app
    ...
    touristic-contents="true"
></grw-app>
```

**Voici un exemple de code complet :**

```html
<div>
    <grw-app
        app-width="100%"
        app-height="100vh"
        api="https://geotrek-admin.portcros-parcnational.fr/api/v2/"
        languages="fr"
        name-layer="IGN,OpenStreetMap"
        url-layer="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x},https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution-layer="<a target='_blank' href='https://ign.fr/'>IGN</a>,OpenStreetMap"
        weather="true"
        treks="false"
        touristic-contents="true"
        rounded="true"
        color-departure-icon="#006b3b"
        color-arrival-icon="#85003b"
        color-sensitive-area="#4974a5"
        color-trek-line="#003e42"
        color-poi-icon="#974c6e"
        color-primary-app="#008eaa"
        color-on-primary="#ffffff"
        color-surface="#1c1b1f"
        color-on-surface="#49454e"
        color-surface-variant="#fff"
        color-on-surface-variant="#1c1b1f"
        color-primary-container="#94CCD8"
        color-on-primary-container="#005767"
        color-secondary-container="#94CCD8"
        color-on-secondary-container="#1d192b"
        color-background="#fff"
        color-surface-container-high="#fff"
        color-surface-container-low="#fff"
        fab-background-color="#94CCD8"
        fab-color="#003e42"
    ></grw-app>
</div>
```

## Exemple de widget avec uniquement les contenus touristiques

<div>
    <grw-app
        app-width="100%"
        app-height="100vh"
        api="https://geotrek-admin.portcros-parcnational.fr/api/v2/"
        languages="fr"
        name-layer="IGN,OpenStreetMap"
        url-layer="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x},https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution-layer="<a target='_blank' href='https://ign.fr/'>IGN</a>,OpenStreetMap"
        weather="true"
        treks="false"
        touristic-contents="true"
        rounded="true"
        color-departure-icon="#006b3b"
        color-arrival-icon="#85003b"
        color-sensitive-area="#4974a5"
        color-trek-line="#003e42"
        color-poi-icon="#974c6e"
        color-primary-app="#008eaa"
        color-on-primary="#ffffff"
        color-surface="#1c1b1f"
        color-on-surface="#49454e"
        color-surface-variant="#fff"
        color-on-surface-variant="#1c1b1f"
        color-primary-container="#94CCD8"
        color-on-primary-container="#005767"
        color-secondary-container="#94CCD8"
        color-on-secondary-container="#1d192b"
        color-background="#fff"
        color-surface-container-high="#fff"
        color-surface-container-low="#fff"
        fab-background-color="#94CCD8"
        fab-color="#003e42"
    ></grw-app>
</div>