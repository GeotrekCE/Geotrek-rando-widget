import { defineConfig, type DefaultTheme } from 'vitepress'

export const fr = defineConfig({
  lang: 'fr',
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Rechercher',
              },
              modal: {
                noResultsText: 'Aucun résultat pour',
                displayDetails: 'Afficher la liste détaillée',
                resetButtonTitle: 'Réinitialiser la recherche',
                footer: {
                  selectText: 'pour sélectionner',
                  navigateText: 'pour naviguer',
                  closeText: 'pour fermer',
                },
              },
            },
          },
        },
      },
    },
    nav: nav(),
    sidebar: sidebar(),
    docFooter: { prev: 'Page précédente', next: 'Page suivante' },
    darkModeSwitchLabel: 'Apparence',
    lightModeSwitchTitle: "Passer au thème clair",
    darkModeSwitchTitle: "Passer au thème sombre",
    outlineTitle: "Sur cette page",
    notFound: {
      title: "PAGE NON TROUVÉE",
      quote: "Mais si vous ne changez pas de direction et si vous continuez à chercher, vous risquez de vous retrouver là où vous vous dirigez.",
      linkLabel: "retour à l'accueil.",
      linkText: "Retourner à l'accueil",
      code: "404"
    }
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Accueil', link: '/' },
      { text: 'Documentation', link: '/documentation/introduction/overview', activeMatch: '/documentation/' },
  ]
}

function sidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
        text: 'Introduction',
        collapsed: true,
        items: [
          { text: 'Présentation', link: '/documentation/introduction/overview' },
          { text: 'Installation', link: '/documentation/introduction/get-started' },
        ],
      },
      {
        text: 'Thème',
        collapsed: true,
        items: [
          { text: 'Les couleurs', link: '/documentation/theme/colors' },
          { text: 'Responsive design', link: '/documentation/theme/responsive-design' },
          { text: 'Personnalisation avancée', link: '/documentation/theme/advanced-customization' },
          { text: 'Paramètres supplémentaires', link: '/documentation/theme/additional-settings' },
        ],
      },
      {
        text: 'Composants',
        collapsed: true,
        items: [
          { text: 'Fonctionnement', link: '/documentation/components/how-it-works' },
          { text: 'Application', link: '/documentation/components/grw-app' },
          { text: 'Liste de randonnées', link: '/documentation/components/grw-treks-list' },
          { text: "Vignette d'une randonnée", link: '/documentation/components/grw-trek-card' },
          { text: "Détail d'une randonnée", link: '/documentation/components/grw-trek-detail' },
          { text: "Liste d'outdoors", link: '/documentation/components/grw-outdoor-list' },
          { text: "Vignette d'un outdoor", link: '/documentation/components/grw-outdoor-card' },
          { text: "Détail d'un outdoor", link: '/documentation/components/grw-outdoor-detail' },
          { text: 'Liste des contenus touristiques', link: '/documentation/components/grw-touristic-contents-list' },
          { text: "Vignette d'un contenu touristique", link: '/documentation/components/grw-touristic-content-card' },
          { text: "Détail d'un contenu touristique", link: '/documentation/components/grw-touristic-content-detail' },
          { text: 'Liste des évènements touristiques', link: '/documentation/components/grw-touristic-events-list' },
          { text: "Vignette d'un évènement touristique", link: '/documentation/components/grw-touristic-event-card' },
          { text: "Détail d'un évènement touristique", link: '/documentation/components/grw-touristic-event-detail' },
          { text: 'Carte', link: '/documentation/components/grw-map' },
        ],
      },
      {
        text: 'Fournisseurs de données',
        collapsed: true,
        items: [
          { text: 'Fonctionnement', link: '/documentation/data-provider/how-it-works' },
          { text: 'Randonnées', link: '/documentation/data-provider/grw-treks-provider' },
          { text: 'Randonnée', link: '/documentation/data-provider/grw-trek-provider' },
          { text: 'Contenus touristiques', link: '/documentation/data-provider/grw-touristic-contents-provider' },
          { text: 'Contenu touristique', link: '/documentation/data-provider/grw-touristic-content-provider' },
          { text: 'Évènements touristiques', link: '/documentation/data-provider/grw-touristic-events-provider' },
          { text: 'Évènement touristique', link: '/documentation/data-provider/grw-touristic-event-provider' },
        ],
      },
      {
        text: 'Extras',
        collapsed: true,
        items: [
          { text: 'Progressive web app', link: '/documentation/extras/progressive-web-app' },
        ],
      },
      {
        text: 'Exemples',
        collapsed: true,
        items: [
          { text: 'Application', link: '/documentation/examples/application' },
          { text: 'Application itinéraires', link: '/documentation/examples/app-treks' },
          { text: 'Application itinéraires VTT', link: '/documentation/examples/app-treks_vtt' },
          { text: 'Application outdoors', link: '/documentation/examples/app-outdoors' },
          { text: 'Application contenus touristiques', link: '/documentation/examples/app-touristic-contents' },
          { text: 'Application événements touristiques', link: '/documentation/examples/app-touristic-events' },
          { text: 'Liste de randonnées', link: '/documentation/examples/treks-list' },
          { text: "Détail d'une randonnée", link: '/documentation/examples/trek-detail' },
          { text: "Détail d'une randonnée avec carte", link: '/documentation/examples/trek-detail-and-map' },
        ],
      },
      {
        text: 'Contribution',
        collapsed: true,
        items: [
          { text: 'Développement', link: '/documentation/contribution/development' },
          { text: 'Documentation', link: '/documentation/contribution/documentation' },
          { text: 'Traduction', link: '/documentation/contribution/translation' },
        ],
      },
      {
        text: 'À propos',
        collapsed: true,
        items: [
          {
            text: 'Geotrek',
            link: '/documentation/about/geotrek/what-is-geotrek',
            items: [
              { text: "Qu'est-ce que Geotrek ?", link: '/documentation/about/geotrek/what-is-geotrek', items: [] },
              { text: 'Les projets', link: '/documentation/about/geotrek/projects', items: [] },
            ],
          },
        ],
      },
  ]
}
