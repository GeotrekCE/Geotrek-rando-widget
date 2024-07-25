import { defineConfig, type DefaultTheme } from 'vitepress'

export const en = defineConfig({
  lang: 'en',
  themeConfig: {
    nav: nav(),
    sidebar: sidebar(),
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Home', link: '/en/' },
    { text: 'Documentation', link: '/en/documentation/introduction/overview', activeMatch: '/en/documentation/' },
  ]
}

function sidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
        text: 'Introduction',
        collapsed: true,
        items: [
          { text: 'Presentation', link: '/en/documentation/introduction/overview' },
          { text: 'Get started', link: '/en/documentation/introduction/get-started' },
        ],
      },
      {
        text: 'Theme',
        collapsed: true,
        items: [
          { text: 'Colors', link: '/en/documentation/theme/colors' },
          { text: 'Responsive design', link: '/en/documentation/theme/responsive-design' },
          { text: 'Advanced customization', link: '/en/documentation/theme/advanced-customization' },
          { text: 'Additional settings', link: '/en/documentation/theme/additional-settings' },
        ],
      },
      {
        text: 'Components',
        collapsed: true,
        items: [
          { text: 'How it works', link: '/en/documentation/components/how-it-works' },
          { text: 'Application', link: '/en/documentation/components/grw-app' },
          { text: 'Treks list', link: '/en/documentation/components/grw-treks-list' },
          { text: "Trek card", link: '/en/documentation/components/grw-trek-card' },
          { text: "Trek detail", link: '/en/documentation/components/grw-trek-detail' },
          { text: 'Outdoors list', link: '/en/documentation/components/grw-outdoor-list' },
          { text: "Outdoor card", link: '/en/documentation/components/grw-outdoor-card' },
          { text: "Outdoor detail", link: '/en/documentation/components/grw-outdoor-detail' },
          { text: 'Touristic contents list', link: '/en/documentation/components/grw-touristic-contents-list' },
          { text: "Touristic content card", link: '/en/documentation/components/grw-touristic-content-card' },
          { text: "Touristic content detail", link: '/en/documentation/components/grw-touristic-content-detail' },
          { text: 'Touristic events list', link: '/en/documentation/components/grw-touristic-events-list' },
          { text: "Touristic event card", link: '/en/documentation/components/grw-touristic-event-card' },
          { text: "Touristic event detail", link: '/en/documentation/components/grw-touristic-event-detail' },
          { text: 'Map', link: '/en/documentation/components/grw-map' },
        ],
      },
      {
        text: 'Data provider',
        collapsed: true,
        items: [
          { text: 'How it works', link: '/en/documentation/data-provider/how-it-works' },
          { text: 'Treks', link: '/en/documentation/data-provider/grw-treks-provider' },
          { text: 'Trek', link: '/en/documentation/data-provider/grw-trek-provider' },
          { text: 'Touristic contents', link: '/en/documentation/data-provider/grw-touristic-contents-provider' },
          { text: 'Touristic content', link: '/en/documentation/data-provider/grw-touristic-content-provider' },
          { text: 'Touristic events', link: '/en/documentation/data-provider/grw-touristic-events-provider' },
          { text: 'Touristic event', link: '/en/documentation/data-provider/grw-touristic-event-provider' },
        ],
      },
      {
        text: 'Extras',
        collapsed: true,
        items: [
          { text: 'Progressive web app', link: '/en/documentation/extras/progressive-web-app' },
        ],
      },
      {
        text: 'Examples',
        collapsed: true,
        items: [
          { text: 'Application', link: '/en/documentation/examples/application' },
          { text: 'Treks app', link: '/en/documentation/examples/app-treks' },
          { text: 'Treks app', link: '/en/documentation/examples/app-treks_bike' },
          { text: 'Outdoors app', link: '/en/documentation/examples/app-outdoors' },
          { text: 'Touristic contents app', link: '/en/documentation/examples/app-touristic-contents' },
          { text: 'Touristic events app', link: '/en/documentation/examples/app-touristic-events' },
          { text: 'Treks list', link: '/en/documentation/examples/treks-list' },
          { text: 'Trek detail', link: '/en/documentation/examples/trek-detail' },
          { text: "Trek detail with map", link: '/en/documentation/examples/trek-detail-and-map' },
        ],
      },
      {
        text: 'Contribution',
        collapsed: true,
        items: [
          { text: 'Development', link: '/en/documentation/contribution/development' },
          { text: 'Documentation', link: '/en/documentation/contribution/documentation' },
          { text: 'Translation', link: '/en/documentation/contribution/translation' },
        ],
      },
      {
        text: 'About',
        collapsed: true,
        items: [
          {
            text: 'Geotrek',
            link: '/en/documentation/about/geotrek/what-is-geotrek',
            items: [
              { text: "What is Geotrek ?", link: '/en/documentation/about/geotrek/what-is-geotrek', items: [] },
              { text: 'Projects', link: '/en/documentation/about/geotrek/projects', items: [] },
            ],
          },
        ],
      },
  ]
}
