import { defineConfig } from 'vitepress';

export const shared = defineConfig({
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: tag => tag.includes('grw-'),
      },
    },
  },
  title: 'Geotrek rando widget',
  description: 'Geotrek web components',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    i18nRouting: true,
    logo: '/assets/logo.svg',
    search: {
      provider: 'local',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/GeotrekCE/Geotrek-rando-widget' }],
  },
});
