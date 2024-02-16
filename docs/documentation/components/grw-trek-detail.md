# Vue détaillée d'une randonnée

La vue détaillée est composée de trois parties :

- La fiche détaillée à gauche
- La carte à droite
- Le profil altimétrique sous la carte

## Fonctionnalités générales de la vue détaillée

- Défilement de plusieurs images sous la forme d'un carrousel
- Flèches de direction (du point de départ vers l’arrivée) sur le tracé de l'itinéraire
- Profil altimétrique « dynamique » pouvant être survolé à la souris pour mettre en évidence le point de localisation correspondant sur la carte
- Affichage de l’ensemble des communes traversées par l’itinéraire
- Description détaillée de l'itinérance pour permettre l’affichage d’un fil de suivi avec les étapes sous forme de ronds colorés
- Liens vers les contenus touristiques associés (services)


## Fiche détaillée d'une randonnée

La fiche détaillée d'une randonnée comporte plusieurs sections intéragissant dynamiquement avec la carte.

### Section "Présentation"

La section "Présentation" est constituée :

- de la vignette avec des informations plus détaillées comme le dénivelé négatif
- des boutons de téléchargement du tracé au formats GPX et KML et de la fiche randonnée au format PDF
- du chapeau (bref résumé) et de l'ambiance (attractions principales et intérêts) de la randonnée

<center>
  <a title="Fiche détail d'une randonnée"><img src="/components/detail_trek.png" alt="Fiche détail d'une randonnée"></a>
</center>

### Section "Description"

Cette section comporte une description technique pas à pas de l’itinéraire avec le plus souvent une liste numérotée (que l'on sur la carte) des différentes étapes clés.

<center>
  <a title="Fiche détail d'une randonnée - section Description"><img src="/components/detail_trek_description.png" alt="Fiche détail d'une randonnée - section Description"></a>
</center>

### Section "Patrimoines"

Sur la vue détaillée d’un itinéraire, l'affichage des POIs a été optimisé de façon à rendre leur utilisation plus intuitive :

- Affichage d'un bouton « Lire plus » pour dévoiler la totalité de la description présente dans la vignette
- Possibilité d’afficher plusieurs images par POI dans un carrousel
- Affichage de l’icône de la catégorie du POI sur sa vignette (faune, flore, patrimoine, équipements…)

::: info
Les pictogrammes des POIs s'affichent sur la carte lorsque l'utilisateur arrive sur cette section.
:::

En plus d'afficher les vignettes des éléments de patrimoines (POIs) situés à proximités de la randonnée (rayon de 500m par défaut), La section "Patrimoine", peut présenter des informations complémentaires comme :
- le widget Météo France
- Les accès routiers et parkings
- Les transports en commun pour venir

#### Paramétrage du widget Météo France

```js
<grw-app
	weather="true"
></grw-app>
```

<center>
  <a title="Fiche détail d'une randonnée - section Patrimoines"><img src="/components/detail_trek_poi.png" alt="Fiche détail d'une randonnée - section Patrimoines"></a>
</center>

### Sections "Recommandations" et "Lieux d'informations"

La section "Recommandations" présente les recommandations sur les risques, danger ou meilleure période pour pratiquer l’itinéraire, ainsi que tout autre élément d'information utile à connaître.

La section "Lieux d'informations" présente les lieux de renseignement (office du tourisme, bureau d'information, etc.) sous forme de vignettes. 

::: info
En cliquant sur le bouton "Centrer sur la carte", la carte est zoomée sur le lieu en question.
:::


<center>
  <a title="Fiche détail d'une randonnée - section Recommandations et Lieux d'informations"><img src="/components/detail_trek_informationdesk.png" alt="Fiche détail d'une randonnée - section Recommandations et Lieux d'informations"></a>
</center>

### Sections "Accessibilité" et "A proximité"

La section "Accessibilité" permet d'afficher les informations relatives à l'accessibilité (aménagements, pente, revêtements, exposition, etc.).

La section "A proximité" présente les services à proximité de la randonnée (rayon de 500m par défaut).

Une section complémentaire "En savoir plus" peut être affichée si le champ `source` est renseigné dans **Geotrek-admin** .

::: info
Les pictogrammes des services s'affichent sur la carte lorsque l'utilisateur arrive sur cette section.
:::

<center>
  <a title="Fiche détail d'une randonnée - section Accessibilité et A proximité"><img src="/components/detail_trek_touristis_content.png" alt="Fiche détail d'une randonnée - section Accessibilité et A proximité"></a>
</center>