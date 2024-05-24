# Fonctionnement des composants graphiques

Geotrek rando widget propose une multitude de composants graphiques.

Il est possible d'en utiliser un prêt à l'emploi en tant qu'[application](../examples/application.html), grw-app, celui-ci assemble d'autres composants.

Il est aussi possible d'utiliser chaque composant graphique de manière indépendante. Par exemple, on peut afficher [une page détail d'un itinéraire ainsi que sa carte](../examples/trek-detail-and-map.html). Pour cela, il faut utiliser grw-trek-detail, grw-map, ce sont les composants graphiques. Afin qu'ils puissent afficher un itinéraire, il convient de récupérer les informations nécessaires avec un composant qui le permet, ici grw-trek-provider.
