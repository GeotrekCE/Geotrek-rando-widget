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

Pour afficher uniquement les **itinéraires de pratique VTT** dans le widget, il faut que :
- la balise `grw-app` embarque le paramètre suivant à `true` :

```html
<grw-app ... treks="true"></grw-app>
```

- le paramètre `practices` soit renseigné avec l'identifiant de la pratique :

```html
<grw-app ... practices="1"></grw-app>
```
> [!INFO]
> * Si l'on souhaite afficher des itiénraires pour plusieurs pratiques, il faut lister les identifiants des pratiques comme ceci : 
>```html
><grw-app ... practices="1,2"></grw-app>
>```
> * Pour connaître la liste des identifiants de pratiques (remplacer par l'API souhaitée) :
> `https://demo-admin.geotrek.fr/api/v2/trek_practice/?language=fr`

**Voici un exemple de code complet :**

```html
    <div>
      <grw-app
      app-width="100%"
      app-height="100%"
      api="https://admin.rando-loireanjoutouraine.fr/api/v2/"
      languages="fr,en"
      name-layer="IGN,OpenStreetMap"
      url-layer="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x},https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution-layer="<a target='_blank' href='https://ign.fr/'>IGN</a>,OpenStreetMap"
      treks="true"
      weather="true"
      rounded="true"
      practices="1"
      color-departure-icon="#006b3b"
      color-arrival-icon="#85003b"
      color-sensitive-area="#4974a5"
      color-poi-icon="#974c6e"
      color-primary-app="#147D85"
      color-on-primary="#ffffff"
      color-surface="#1c1b1f"
      color-on-surface="#49454e"
      color-surface-variant="#fff"
      color-on-surface-variant="#1c1b1f"
      color-primary-container="#d1e3e6"
      color-on-primary-container="#003e42"
      color-secondary-container="#d1e3e6"
      color-on-secondary-container="#1d192b"
      fab-background-color="#d1e3e6"
      fab-color="#003e42"
      color-trek-line="#003e42"
  ></grw-app>
</div>
```

## Exemple de widget avec uniquement des itinéraires VTT

<ClientOnly>
  <div>
    <grw-app
      app-width="100%"
      app-height="100%"
      api="https://admin.rando-loireanjoutouraine.fr/api/v2/"
      languages="fr,en"
      name-layer="IGN,OpenStreetMap"
      url-layer="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x},https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution-layer="<a target='_blank' href='https://ign.fr/'>IGN</a>,OpenStreetMap"
      treks="true"
      weather="true"
      rounded="true"
      practices="1"
      color-departure-icon="#006b3b"
      color-arrival-icon="#85003b"
      color-sensitive-area="#4974a5"
      color-poi-icon="#974c6e"
      color-primary-app="#147D85"
      color-on-primary="#ffffff"
      color-surface="#1c1b1f"
      color-on-surface="#49454e"
      color-surface-variant="#fff"
      color-on-surface-variant="#1c1b1f"
      color-primary-container="#d1e3e6"
      color-on-primary-container="#003e42"
      color-secondary-container="#d1e3e6"
      color-on-secondary-container="#1d192b"
      fab-background-color="#d1e3e6"
      fab-color="#003e42"
      color-trek-line="#003e42"
    ></grw-app>
  </div>
</ClientOnly>

