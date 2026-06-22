# Gestion de la carte

<center>
  <a title="Carte des randonnées"><img src="/components/map.jpg" alt="Carte des randonnées"></a>
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

```html
<grw-app
  name-layer="IGN,OpenStreetMap"
  url-layer="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x},https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution-layer="<a target='_blank' href='https://ign.fr/'>IGN</a>,OpenStreetMap"
></grw-app>
```

### Personnalisation des couleurs d'objets sur la carte

```html
<grw-app color-trek-line="#6b0030" color-departure-icon="#006b3b" color-arrival-icon="#85003b" color-sensitive-area="#4974a5" color-poi-icon="#974c6e"></grw-app>
```

## Intégration de couches cartographiques externes (GeoJSON, WMS & Tuiles/WMTS)

Le widget permet d'intégrer des couches d'informations externes complémentaires, qui s'affichent uniquement lorsque l'utilisateur consulte la fiche détaillée d'un itinéraire. Ces couches apparaissent dans le sélecteur de couches en haut à droite de la carte et peuvent être activées/désactivées indépendamment par l'utilisateur.

### 1. Couches GeoJSON

Vous pouvez charger un ou plusieurs fichiers GeoJSON (contenant des lignes, des polygones ou des points) et personnaliser leur affichage.

#### Styling des lignes et polygones

Les styles géométriques (couleurs, épaisseur, remplissage) peuvent être configurés de deux manières :

- **Via les propriétés de l'entité (Spécification Simplestyle)** : Le widget interprète les propriétés définies au sein du GeoJSON pour chaque entité :
  - `stroke` : Couleur de la ligne (ex: `#ff0000`).
  - `stroke-width` : Épaisseur de la ligne (ex: `3`).
  - `stroke-opacity` : Opacité de la ligne (ex: `0.8`).
  - `fill` : Couleur de remplissage du polygone (ex: `#00ff00`).
  - `fill-opacity` : Opacité de remplissage (ex: `0.3`).
- **Via la configuration globale (Fallback)** : Si aucune propriété de style n'est définie dans le GeoJSON, le widget applique par défaut les valeurs configurées avec `custom-geojson-color` et `custom-geojson-weight`.

#### Personnalisation des points (Pictogrammes et Émojis)

Pour les entités de type `Point`, vous pouvez afficher des icônes personnalisées en renseignant la propriété `icon` de l'entité dans le GeoJSON :

- **Emoji** : Définissez un émoji (ex: `"icon": "🐑"` ou `"icon": "🐕"`). Le widget l'affichera au centre d'une puce circulaire.
- **URL d'image** : Définissez une URL absolue ou relative (ex: `"icon": "/assets/icon.png"`).
- **Propriétés de style associées** :
  - `marker-color` : Couleur de fond de la puce circulaire (ex: `#4caf50`).
  - `marker-stroke` : Couleur de la bordure de la puce (ex: `#ffffff`).
  - `marker-stroke-width` : Épaisseur de la bordure (ex: `2`).

La taille de tous ces marqueurs personnalisés est gérée de manière cohérente à l'échelle de l'application via la propriété globale `common-marker-size` (partagée avec les POIs).

#### Popups d'informations

Si l'entité dispose d'un titre (`name` ou `title`) ou d'une description (`description` ou `desc`), le widget y associera automatiquement une popup au clic sur le marqueur :

- Elle hérite de la charte graphique de l'application.
- Si une propriété `image` est fournie avec une URL, une image d'illustration sera intégrée en en-tête de la popup.

#### Exemple de fichier GeoJSON (`custom-geojson.json`) :

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Troupeau du Vallon",
        "icon": "🐑",
        "marker-color": "#4caf50",
        "marker-stroke": "#ffffff",
        "marker-stroke-width": 3,
        "description": "Troupeau de brebis en éco-pâturage dans le vallon. Attention aux chiens de protection !",
        "image": "https://mon-site.fr/images/troupeau.jpg"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [6.956, 43.783]
      }
    }
  ]
}
```

### 2. Couches WMS

Vous pouvez superposer des couches issues de serveurs WMS distants (ex: plans cadastraux, cartes forestières, zones réglementées).

Chaque flux WMS requiert l'URL du serveur (`custom-wms-url`), le nom de la couche sur le serveur (`custom-wms-layers`), et optionnellement une attribution (`custom-wms-attribution`).

### 3. Couches de Tuiles Personnalisées (XYZ / WMTS)

Vous pouvez également ajouter des fonds de plan ou des overlays sous forme de tuiles prégénérées (XYZ ou WMTS avec un template d'URL contenant `{x}`, `{y}` et `{z}`).

Chaque serveur de tuiles requiert l'URL de template (`custom-tile-url`), un nom d'affichage (`custom-tile-name`), et optionnellement une attribution (`custom-tile-attribution`).

### 4. Exemple de configuration multi-couches (GeoJSON, WMS et Tuiles/WMTS)

Vous pouvez charger plusieurs couches de chaque type en séparant les valeurs par des virgules dans les attributs du widget :

```html
<grw-app
  api="https://mon-geotrek.fr/api/v2/"
  name-layer="IGN"
  url-layer="https://mon-serveur.fr/wmts?..."
  attribution-layer="IGN"
  custom-geojson-url="/assets/custom-geojson.json,/assets/custom-patous.json"
  custom-geojson-name="Moutons 🐑,Patous 🐕"
  custom-wms-url="https://mon-serveur-wms.fr/wms,https://autre-serveur-wms.fr/wms"
  custom-wms-layers="CADASTRALPARCELS.PARCELS,FOREST.MAPS"
  custom-wms-name="Cadastre,Forêts"
  custom-wms-attribution="© IGN,© IGN"
  custom-tile-url="https://{s}.tile.mon-serveur.fr/{z}/{x}/{y}.png,https://mon-serveur-wmts.fr/wmts?LAYER=ORTHOIMAGERY&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/jpeg&SERVICE=WMTS&REQUEST=GetTile"
  custom-tile-name="OpenStreetMap,Orthophotos IGN"
  custom-tile-attribution="© OpenStreetMap,© IGN"
></grw-app>
```
