# Éléments de l'application

Le widget se présente sous la forme d'un tag HTML embarquant toutes les configurations nécessaires, par exemple :

```js
<grw-app
	api="https://geotrek-admin.portcros-parcnational.fr/api/v2/"
    name-layer="IGN,OpenStreetMap"
    url-layer="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x},https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution-layer="<a target='_blank' href='https://ign.fr/'>IGN</a>,OpenStreetMap"
    touristic-contents="true"
    touristic-events="true" 
    weather="true"
    rounded="false"
    color-primary-app="#0043AE"
    color-on-primary="#ffffff"
    color-surface="#0043AE"
    color-on-surface="#000000"
    color-surface-variant="#0043AE"
    color-on-surface-variant="#000000"
    color-primary-container="#0043AE"
    color-on-primary-container="#FFFFFF"
    color-secondary-container="#B3C3DA"
    color-on-secondary-container="#0043AE"
    color-background="#ffffff"
    color-surface-container-high="#0043AE"
    color-surface-container-low="#ffffff"
    fab-background-color="#C9AE75"
    fab-color="#000000"
    color-sensitive-area="#F1F6FB"
    color-poi-icon="#0043AE"
    color-trek-line="#0043AE"
    font-family="Montserrat"
    emergency-number="114"
></grw-app>
```
