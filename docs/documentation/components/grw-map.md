# Gestion de la carte

<center>
  <a title="Carte des randonnées"><img src="/components/map.png" alt="Carte des randonnées"></a>
</center>

Les fonctionnalités du composant cartographique de **Geotrek-rando-widget** sont très similaires à celles présentées sur **Geotrek-rando** :

- Centrer la carte sur la vue d'un ou plusieurs objets avec le bon niveau de zoom
- Proposer une liste de fonds de carte sélectionnables via l'interface
- Géo-localisation de l'utilisateur
- Affichage de cluster de points pour gagner en lisibilité
- A usurvol du pictogramme sur la carte, ce dernier est agrandi
- Affichage des informations de l'objet au clic sur la carte : nom, photo principale, bouton cliquable pour afficher sa fiche détaillée
- Au survol et au clic d'un itinéraire sur la carte, son tracé est affiché

## Exemple de paramétrages

### Configuration de deux fonds de plan

```js
<grw-app
	name-layer="IGN,OpenStreetMap"
    url-layer="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x},https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution-layer="<a target='_blank' href='https://ign.fr/'>IGN</a>,OpenStreetMap"
></grw-app>
```

### Personnalisation des couleurs d'objets sur la carte

```js
<grw-app
	color-trek-line="#6b0030"
    color-departure-icon="#006b3b"
    color-arrival-icon="#85003b"
    color-sensitive-area="#4974a5"
    color-poi-icon="#974c6e"
></grw-app>
```