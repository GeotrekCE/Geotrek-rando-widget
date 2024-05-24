# Fonctionnement des composants graphiques

Geotrek rando widget propose une multitude de composants graphiques.

Parmi ces composants, il en existe un prêt à l'emploi : `grw-app`. Ce dernier peut s'utiliser comme une [application](../examples/application.html) à part entière et assemble d'autres composants. 

Il est aussi possible d'utiliser chaque composant graphique de manière indépendante. Par exemple, il est possible d'afficher [une page détail d'un itinéraire ainsi que sa carte](../examples/trek-detail-and-map.html). Pour cela, il faut utiliser les composants graphiques `grw-trek-detail` et `grw-map`. 

Pour pouvoir afficher un itinéraire, il convient de récupérer les informations nécessaires avec un composant qui le permet : `grw-trek-provider`.
