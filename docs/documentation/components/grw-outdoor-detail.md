# Vue détaillée d'un contenu outdoor

La vue détaillée est composée de deux parties :

- La fiche détaillée à gauche
- La carte à droite

## Fonctionnalités générales de la vue détaillée

- Défilement de plusieurs images sous la forme d'un carrousel
- Affichage de l’ensemble des communes traversées par le site outdoor
- Liens vers les parcours outdoor associés
- Liens vers les contenus touristiques associés (services et évènements)

## Fiche détaillée d'un site outdoor

La fiche détaillée d'un site outdoor comporte plusieurs sections intéragissant dynamiquement avec la carte.

### Section "Présentation"

La section "Présentation" est constituée :

- de la vignette avec la liste des thèmes associés (Faune, Flore, Patrimoine historique, etc.)
- de la pratique, l'orientation du vent, la saison de pratique, les cotations et la difficulté
- des boutons de téléchargement de la fiche d'un site au format PDF
- du chapeau (bref résumé) et de l'ambiance (attractions principales et intérêts) du site outdoor

<center>
  <a title="Fiche détail d'un site outdoor"><img src="/components/detail_outdoor.jpg" alt="Fiche détail d'un site outdoor"></a>
</center>

### Section "Description"

Cette section comporte une description technique pas à pas du site.

<center>
  <a title="Fiche détail d'un site outdoor - section Description"><img src="/components/detail_outdoor_description.jpg" alt="Fiche détail d'un site outdoor - section Description"></a>
</center>

### Section "Patrimoines"

Sur la vue détaillée d’un site outdoor, l'affichage des POIs a été optimisé de façon à rendre leur utilisation plus intuitive :

- Affichage d'un bouton « Lire plus » pour dévoiler la totalité de la description présente dans la vignette
- Possibilité d’afficher plusieurs images par POI dans un carrousel
- Affichage de l’icône de la catégorie du POI sur sa vignette (faune, flore, patrimoine, équipements…)

::: info
Les pictogrammes des POIs s'affichent sur la carte lorsque l'utilisateur arrive sur cette section.
:::

En plus d'afficher les vignettes des éléments de patrimoines (POIs) situés à proximités du site (rayon de 500m par défaut), la section "Patrimoine", peut présenter des informations complémentaires comme :

- le widget Météo France
- Les accès routiers et parkings
- Les transports en commun pour venir

#### Paramétrage du widget Météo France

```html
<grw-app weather="true"></grw-app>
```

### Sections "Recommandations" et "Lieux d'informations"

La section "Recommandations" présente les recommandations sur les risques, danger ou meilleure période pour pratiquer l’itinéraire, ainsi que tout autre élément d'information utile à connaître.

La section "Lieux d'informations" présente les lieux de renseignement (office du tourisme, bureau d'information, etc.) sous forme de vignettes.

::: info
En cliquant sur le bouton "Centrer sur la carte", la carte est zoomée sur le lieu en question.
:::

<center>
  <a title="Fiche détail d'un site outdoor - section Recommandations et Lieux d'informations"><img src="/components/detail_outdoor_informationdesk.jpg" alt="Fiche détail d'un site outdoor - section Recommandations et Lieux d'informations"></a>
</center>

### Sections "Accessibilité" et "A proximité"

La section "Accessibilité" permet d'afficher les informations relatives à l'accessibilité (aménagements, pente, revêtements, exposition, etc.).

La section "A proximité" présente les services à proximité du site (rayon de 500m par défaut).

Une section complémentaire "En savoir plus" peut être affichée si le champ `source` est renseigné dans **Geotrek-admin** .

::: info
Les pictogrammes des services s'affichent sur la carte lorsque l'utilisateur arrive sur cette section.
:::

