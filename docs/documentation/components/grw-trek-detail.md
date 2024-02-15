# Vue détaillée d'une randonnée

La vue détaillée est composée de trois parties :

- La fiche détaillée à gauche
- La carte à droite
- Le profil altimétrique sous la carte

## Fiche détaillée d'une randonnée

La fiche détaillée d'une randonnée comporte plusieurs sections intéragissant dynamiquement avec la carte.

### Section "Présentation"

La section "Présentation" est constituée :

- de la vignette avec des informations plus détaillées comme le dénivelé négatif
- des boutons de téléchargement au formats GPX, KML et PDF
- du chapeau (bref résumé) et de l'ambiance (attractions principales et intérêts) de la randonnée

<center>
  <a title="Fiche détail d'une randonnée"><img src="/components/detail_trek.png" alt="Fiche détail d'une randonnée"></a>
</center>

### Section "Description"

Cette section comporte une description technique pas à pas de l’itinéraire avec le plus souvent une liste numérotée (que l'on sur la carte) des différentes étapes clés.

<center>
  <a title="Fiche détail d'une randonnée"><img src="/components/detail_trek_description.png" alt="Fiche détail d'une randonnée"></a>
</center>

### Section "Patrimoines"

La section "Patrimoine", en plus d'afficher les vignettes des éléments de patrimoines (POIs) situés à proximités de la randonnée (rayon de 500m par défaut), peut présenter des informations complémentaires comme :
- le widget Météo France
- Les accès routiers et parking
- Les transports en commun pour venir

::: info
Les pictogrammes des POIs s'affichent sur la carte lorsque l'utilisateur arrive sur cette section.
:::

<center>
  <a title="Fiche détail d'une randonnée"><img src="/components/detail_trek_poi.png" alt="Fiche détail d'une randonnée"></a>
</center>

### Sections "Recommandations" et "Lieux d'informations"

La section "Recommandations" présente les recommandations sur les risques, danger ou meilleure période pour pratiquer l’itinéraire, ainsi que tout autre élément d'information utile à connaître.

La section "Lieux d'informations" présente les lieux de renseignement (office du tourisme, bureau d'information, etc.) sous forme de vignettes. 

::: info
En cliquant sur le bouton "Centrer sur la carte", la carte est zoomée sur le lieu en question.
:::


<center>
  <a title="Fiche détail d'une randonnée"><img src="/components/detail_trek_informationdesk.png" alt="Fiche détail d'une randonnée"></a>
</center>

### Sections "Accessibilité" et "A proximité"

La section "Accessibilité" permet d'afficher les informations r'elatives à l'accessibilité (aménagements, pente, revêtements, exposition, etc.).

La section "A proximité" présente les services à proximité de la randonnée (rayon de 500m par défaut).

Une section complémentaire "En savoir plus" peut être affichée si le champ `source` est renseigné dans **Geotrek-admin** .

::: info
Les pictogrammes des services s'affichent sur la carte lorsque l'utilisateur arrive sur cette section.
:::

<center>
  <a title="Fiche détail d'une randonnée"><img src="/components/detail_trek_touristis_content.png" alt="Fiche détail d'une randonnée"></a>
</center>