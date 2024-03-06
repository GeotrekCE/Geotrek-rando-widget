# Geotrek-rando-widget

**Geotrek-rando-widgek**, dernier composant de la suite Geotrek, permet aux structures telles que les collectivités territoriales, les offices du tourisme ou d'autres EPCI chargés de la **valorisation d'un territoire**, d'**intégrer facilement les contenus géographiques de leur territoire sur leur site web**, aussi simplement qu'une vidéo YouTube.

Il offre ainsi offre une solution simple et flexible pour intégrer les contenus d'un [**Geotrek-admin**](https://geotrek.readthedocs.io/) sur n'importe quel site web, sans nécessiter l'installation d'une plateforme dédiée comme [**Geotrek-rando**](https://github.com/GeotrekCE/Geotrek-rando-v3/blob/main/docs/presentation-fr.md). 

::: info
Il permet également de **valoriser des objets spécifiques à un territoire** en promouvant certains contenus présents dans **Geotrek-admin** qui ne seraient par exemple pas présents dans le **Geotrek-rando** du département.

Concrètement cela signifie que si la base de données Geotrek-admin du département référence une offre touristique ne convenant pas à une diffusion sur Geotrek-rando, le département pourra choisir de ne pas la diffuser sur son site Geotrek-rando tandis qu’un partenaire pourra diffuser cette offre dans Geotrek-rando-widget sur son site institutionnel.
:::

En résumé, il offre une **souplesse d'intégration et de promotion des contenus géographiques, tout en permettant une personnalisation et une sélection fine des informations à diffuser** selon les besoins de chaque entité territoriale ou partenaire.

Ce widget, développé dans le cadre du projet communautaire Geotrek, est **libre de droit** et son code source est consultable sur [Github](https://github.com/GeotrekCE/geotrek-rando-widget).

[[Insérer widget ici]]

## Fonctionnalités principales

**Techniquement parlant**

- Il s'agit d'un composant web
- Il est responsive et par conséquent s'adapte aux diverses tailles d'écran
- Il s'appuie sur l'API v2 de Geotrek-admin pour récupérer tous les éléments nécessaires

**Fonctionnellement parlant**

- Il est configurable et intégrable dans un site web
- Il peut afficher le contenu des objets dans plusieurs langues (anglais, espagnol) si ces derniers ont été traduits dans Geotrek-admin
- L'utilisateur peut filtrer et rechercher finement un objet dans la vue *liste*
- Il affiche les objets publiés (itinéraires, services, évènements touristiques, etc.) dans une vue *liste*
- Dans la vue *liste* les éléments suivants s'affichent : une photo principale, le nom de l'objet, quelques caractéristiques (difficulté, distance, dénivelé)
- Au clic sur un objet de la liste, une fiche *détaillée* s'ouvre avec l'ensemble des éléments textuels (dont POI, zones sensibles, lieux de renseignement, recommandations, et étiquettes, etc.) définis dans Geotrek-admin.
- Depuis la fiche *détaillée*, l'utilisateur peut télécharger les traces GPX/KML de l'itinéraire ainsi que sa fiche PDF
- Le contenu de la vue *liste* est synchronisé avec les éléments affichés sur la carte
- L'utilisateur peut copier l'URL d'une fiche *détaillée* pour la partager auprès d'autres internautes


## Exemples d'intégration sur des sites tiers

Voici des exemples d'intégration du de Geotrek-rando-widget en conditions réelle :
 
- [Serre Ponçon Vallées](https://www.serreponconvallees.com/s-aerer/randonnees-balades-pied-velo-vtt) 
- [Jurabsolu](https://www.jurabsolu.fr/decouvrez-territoire-jura/randonnees-forets-vignes-jura/)
- [Sidobre Vals et Plateaux](https://sidobre-vallees-tourisme.com/type_activite/balades-et-randonnees-sidobre-vallees/)
- [Haut Jura Saint-Claude](https://www.haut-jura-saint-claude.com/pause-aventure/randonnee-haut-jura/)
- [Coeur du Jura](https://www.coeurdujura-tourisme.com/parcours-randonnees-velo/)

 