# Éléments de l'application

Le widget se présente sous la forme d'un tag HTML embarquant toutes les configurations nécessaires, par exemple :

```html
      <grw-app
        app-width="100%"
        app-height="100%"
        api="https://prod-geotrek-pnrlat-admin.makina-corpus.net/api/v2/"
        languages="fr,en"
        name-layer="IGN,OpenStreetMap"
        url-layer="https://wxs.ign.fr/cartes/geoportail/wmts?&amp;REQUEST=GetTile&amp;SERVICE=WMTS&amp;VERSION=1.0.0&amp;STYLE=normal&amp;TILEMATRIXSET=PM&amp;FORMAT=image/png&amp;LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&amp;TILEMATRIX={z}&amp;TILEROW={y}&amp;TILECOL={x},https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution-layer="<a target='_blank' href='https://ign.fr/'>IGN</a>,OpenStreetMap"
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
        color-background="#fff"
        color-surface-container-high="#fff"
        color-surface-container-low="#fff"
        fab-background-color="#d1e3e6"
        fab-color="#003e42"
        color-trek-line="#003e42"
        color-sensitive-area="#147D85"
        color-poi-icon="#62ab41"
        treks="true"
        touristic-contents="true"
        touristic-events="true"
        weather="true"
        rounded="false"
      ></grw-app>

```

La balise `grw-app` peut embarquer de nombreux paramètres mais les seuls obligatoires sont :

- `api`
- `name-layer`, `url-layer`, `attribution-layer`

## Description des éléments


### Éléments de paramétrage

Ce tableau liste l'ensemble des paramètres disponibles pour la configuration du widget et de ses fonctionnalités (api, dimensions, filtres, langues, etc.)

| Property                    | Attribute                       | Description | Type      | Default     |
| --------------------------- | ------------------------------- | ----------- | --------- | ----------- |
| `appHeight`                 | `app-height`                    |    Hauteur du widget dans la page         | `string`  | `'100vh'`   |
| `appWidth`                  | `app-width`                     |     Largeur du widget dans la page        | `string`  | `'100%'`    |
| `api`                       | `api`                           |    API v2 de Geotrek-admin         | `string`  | `undefined` |
| `cities`                    | `cities`                        |   Filtrer les contenus de la liste den fonction d'une ou plusieurs communes à partir d'une liste d'identifiants (ex: 1,2,8,9)       | `string`  | `undefined` |
| `districts`                 | `districts`                     |    Filtrer les contenus de la liste en fonction d'un ou plusieurs secteurs à partir d'une liste d'identifiants (ex: 1,2,3)       | `string`  | `undefined` |
| `labels`                    | `labels`                        |    Filtrer les itinéraires dans la liste en fonction des étiquettes à partir d'une liste d'identifiants (ex: 1,3)      | `string`  | `undefined` |
| `portals`                   | `portals`                       |   Filtrer les contenus de la liste en fonction du ou des portails à partir d'une liste d'identifiants (ex: 2)        | `string`  | `undefined` |
| `practices`                 | `practices`                     |  Filtrer les itinéraires de la liste en fonction de leur pratique à partir d'une liste d'identifiants (ex: 1,3,5)          | `string`  | `undefined` |
| `routes`                    | `routes`                        |    Filtrer les itinéraires de la liste en fonction de leur type de parcours à partir d'une liste d'identifiants (ex: 1,2,3 )        | `string`  | `undefined` |
| `structures`                | `structures`                    |  Filtrer les contenus de la liste en fonction de la structure gestionnaire à partir d'une liste d'identifiants  (ex: 1,2)         | `string`  | `undefined` |
| `themes`                    | `themes`                        |   Filtrer  les contenus de la liste en fonction d'une sélection de thèmes à partir de l'identifiant sur Geotrek-admin (ex: 1,2,6,8)       | `string`  | `undefined` |
| `inBbox`                    | `in-bbox`                       |      Filtrer géographiquement les contenus de la liste à partir d'une bounding box (ex: 1.32,43.52,1.53,43.67)      | `string`  | `undefined` |
| `emergencyNumber`           | `emergency-number`              | Afficher un numéro de secours sur la fiche détail d'un itinéraire (ex: 114)          | `number`  | `undefined` |
| `enableOffline`             | `enable-offline`                |  Permettre le téléchargement d'un itinéraire pour le mode hors ligne dans une PWA           | `boolean` | `false`     |
| `treks`                     | `treks`                         |     Afficher la liste des itinéraires      | `boolean` | `true`      |
| `languages`                 | `languages`                     |    Gestion multilingue du widget (ex: fr,en). Disponible uniquement pour le français et l'anglais.    | `string`  | `'fr'`      |
| `touristicContents`         | `touristic-contents`            |  Afficher la liste des contenus touristiques           | `boolean` | `false`     |
| `touristicEvents`           | `touristic-events`              |   Afficher la liste des évènements touristiques          | `boolean` | `false`     |
| `weather`                   | `weather`                       |     Afficher les informations météo dans la fiche détail des itinéraires       | `boolean` | `false`     |

### Éléments du fond de carte

Ce tableau liste l'ensemble des paramètres inhérents aux fonds de plan (fond de plan, attribution, tuiles, niveau de zoom)

| Property                    | Attribute                       | Description | Type      | Default     |
| --------------------------- | ------------------------------- | ----------- | --------- | ----------- |
 `nameLayer`          | `name-layer`             | Nom du ou des fonds de plan            | `string`  | `undefined` |
| `urlLayer`          | `url-layer`             |  URL du ou des fonds de plan           | `string`  | `undefined` |
| `attributionLayer`          | `attribution-layer`             | Attribution du ou des fonds de plan            | `string`  | `undefined` |
| `globalTilesMaxZoomOffline` | `global-tiles-max-zoom-offline` |  Niveau de zoom maximum pour lequel les tuiles de fond de plan de la carte globale sont téléchargées en mode hors ligne           | `number`  | `11`        |
| `globalTilesMinZoomOffline` | `global-tiles-min-zoom-offline` | Niveau de zoom minimum pour lequel les tuiles de fond de plan de la carte globale sont téléchargées en mode hors ligne            | `number`  | `0`         |
| `trekTilesMaxZoomOffline`   | `trek-tiles-max-zoom-offline`   |   Niveau de zoom maximum pour lequel les tuiles de fond de plan sont téléchargées en mode hors ligne sur la carte d'un itinéraire          | `number`  | `16`        |
| `trekTilesMinZoomOffline`   | `trek-tiles-min-zoom-offline`   |  Niveau de zoom minimal pour lequel les tuiles de fond de plan sont téléchargées en mode hors ligne sur la carte d'un itinéraire           | `number`  | `12`        |


### Éléments de personnalisation de l'apparence

Ce tableau liste l'ensemble des paramètres permettant de personnaliser un thème (couleurs, police). Les paramètres reprennent les variables de [material ui](https://m3.material.io/styles/color/roles).

| Property                    | Attribute                       | Description | Type      | Default     |
| --------------------------- | ------------------------------- | ----------- | --------- | ----------- |
| `colorBackground`           | `color-background`              |   Couleur d'arrière-plan          | `string`  | `'#fef7ff'` |
| `colorPrimary`              | `color-primary`                 |   Couleur affichée le plus souvent sur les fenêtres et composants les plus importants          | `string`  | `'#6750a4'` |
| `colorPrimaryContainer`     | `color-primary-container`       |  Couleur de remplissage du fond pour les composants les plus importants           | `string`  | `'#eaddff'` |
| `colorOnPrimary`            | `color-on-primary`              |   Couleur utilisée pour le texte et les icônes par rapport à la couleur de remplissage principale          | `string`  | `'#ffffff'` |
| `colorOnPrimaryContainer`   | `color-on-primary-container`    | Couleur appliquée au contenu (icônes, texte, etc.) qui se trouve au-dessus du conteneur principal            | `string`  | `'#21005e'` |
| `colorSecondaryContainer`   | `color-secondary-container`     |  Couleur secondaire de remplissage      | `string`  | `'#e8def8'` |
| `colorOnSecondaryContainer` | `color-on-secondary-container`  |   Couleur utilisée pour les textes et icônes sur le conteneur secondaire          | `string`  | `'#1d192b'` |
| `colorSurface`              | `color-surface`                 |    Couleur par défaut pour les fonds des éléments       | `string`  | `'#1c1b1f'` |
| `colorSurfaceContainerHigh` | `color-surface-container-high`  |  Couleur du conteneur fortement accentuée           | `string`  | `'#ece6f0'` |
| `colorSurfaceContainerLow`  | `color-surface-container-low`   |  Couleur du conteneur faiblement accentuée           | `string`  | `'#f7f2fa'` |
| `colorSurfaceVariant`       | `color-surface-variant`         |  Variante de la couleur de surface           | `string`  | `'#fef7ff'` |
| `colorOnSurface`            | `color-on-surface`              |  Couleur utilisée pour le texte et les icônes lorsqu’elle est dessinée au-dessus de la couleur de surface           | `string`  | `'#49454e'` |
| `colorOnSurfaceVariant`     | `color-on-surface-variant`      |   Couleur utilisée pour le texte et les icônes lorsqu’elle est dessinée au-dessus de la variante de la couleur de surface         | `string`  | `'#1c1b1f'` |
| `fabBackgroundColor`        | `fab-background-color`          |   Couleur de fond du bouton flottant d'action (voir la carte / voir la liste) affiché au format mobile et tablette         | `string`  | `'#eaddff'` |
| `fabColor`                  | `fab-color`                     |   Couleur du bouton flottant d'action affiché au format mobile et tablette          | `string`  | `'#21005d'` |
| `colorTrekLine`             | `color-trek-line`               |  Couleur du tracé des itinéraires sur la carte           | `string`  | `'#6b0030'` |
| `colorSensitiveArea`        | `color-sensitive-area`          |     Couleur des zones sensibles sur la carte et sur la fiche détaillée d'un itinéraire        | `string`  | `'#4974a5'` |
| `colorPoiIcon`              | `color-poi-icon`                |    Couleur de fond des POIs sur la carte         | `string`  | `'#974c6e'` |
| `fontFamily`                | `font-family`                   |   Police des contenus         | `string`  | `'Roboto'`  |
| `rounded`                   | `rounded`                       |  Arrondir les bordures sur les principaux composants           | `boolean` | `true`      |

