# Fonctionnement des composants graphiques

Geotrek rando widget propose une multitude de composants graphiques.

Parmi ces composants, il en existe un prêt à l'emploi : `grw-app`. Ce dernier peut s'utiliser comme une [application](../examples/application.html) à part entière et assemble d'autres composants. 

Il est aussi possible d'utiliser chaque composant graphique de manière indépendante. Par exemple, il est possible d'afficher [une page détail d'un itinéraire ainsi que sa carte](../examples/trek-detail-and-map.html). Pour cela, il faut utiliser les composants graphiques `grw-trek-detail` et `grw-map`. 

Pour pouvoir afficher un itinéraire, il convient de récupérer les informations nécessaires avec un composant qui le permet : `grw-trek-provider`.

**Retrouvez l'intégralité des variables par composant** :

| Type | Composant |
| ------ | ------ |
|     Application   |    [grw-app](https://github.com/GeotrekCE/Geotrek-rando-widget/blob/main/src/components/grw-app/readme.md)    |
|    Common Button    | [grw-common-button](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-common-button)       |
|    Floating Action Button    | [grw-extended-fab](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-extended-fab)       |
|    Filter    | [grw-filter](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-filter)       |
|    Filter   | [grw-filters](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-filters)       |
|    Information Desk    | [grw-information-desk-detail](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-information-desk)       |
|    Loader    | [grw-loader](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-loader)       |
|    Map    | [grw-map](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-map)       |
|    Online Confirm Modal    | [grw-offline-confirm-modal](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-offline-confirm-modal)       |
|    Outdoor Course    | [grw-outdoor-course-card](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-outdoor-course-card)       |
|    Outdoor Course    | [grw-outdoor-course-detail](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-outdoor-course-detail)       |
|    Outdoor Site    | [grw-outdoor-site-card](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-outdoor-site-card)       |
|    Outdoor Site    | [grw-outdoor-site-detail](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-outdoor-site-detail)       |
|    Outdoor Site    | [grw-outdoor-sites-list](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-outdoor-sites-list)       |
|    POI    | [grw-poi-detail](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-poi-detail)       |
|    Search    | [grw-search](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-search)       |
|    Segmented Segment    | [grw-segmented-segment](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-segmented-segment)       |
|    Select Language    | [grw-select-language](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-select-language)       |
|    Sensitive Area    | [sensitive-area](https://github.com/GeotrekCE/Geotrek-rando-widget/blob/main/src/components/grw-sensitive-area-detail/readme.md)       |
|    Switch    | [grw-switch](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-switch)       |
|    Touristic Content    | [grw-touristic-content-card](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-touristic-content-card)       |
|    Touristic Content    | [grw-touristic-content-card-detail](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-touristic-content-detail)       |
|    Touristic Content    | [grw-treks-list](https://github.com/GeotrekCE/Geotrek-rando-widget/tree/main/src/components/grw-treks-list)       |
|    Touristic Event    | [grw-touristic-event-card](https://github.com/GeotrekCE/Geotrek-rando-widget/blob/main/src/components/grw-touristic-event-card/readme.md)       |
|    Touristic Event    | [grw-touristic-content-card-detail](https://github.com/GeotrekCE/Geotrek-rando-widget/blob/main/src/components/grw-touristic-event-detail/readme.md)       |
|    Trek    | [grw-trek-card](https://github.com/GeotrekCE/Geotrek-rando-widget/blob/main/src/components/grw-trek-card/readme.md)       |
|    Trek   | [grw-trek-detail](https://github.com/GeotrekCE/Geotrek-rando-widget/blob/main/src/components/grw-trek-detail/readme.md)       |
|    Trek   | [grw-treks-list](https://github.com/GeotrekCE/Geotrek-rando-widget/blob/main/src/components/grw-treks-list/readme.md)       |