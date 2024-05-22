export const createApp = ({
  appWidth,
  appHeight,
  api,
  languages,
  inBbox,
  cities,
  districts,
  structures,
  themes,
  portals,
  routes,
  practices,
  nameLayer,
  urlLayer,
  attributionLayer,
  colorPrimaryApp,
  colorOnPrimary,
  colorSurface,
  colorOnSurface,
  colorSurfaceVariant,
  colorOnSurfaceVariant,
  colorPrimaryContainer,
  colorOnPrimaryContainer,
  colorSecondaryContainer,
  colorOnSecondaryContainer,
  colorBackground,
  colorSurfaceContainerHigh,
  colorSurfaceContainerLow,
  fabBackgroundColor,
  fabColor,
  colorTrekLine,
  colorSensitiveArea,
  useGradient,
  treks,
  touristicContents,
  touristicEvents,
  outdoor,
}) => {
  const app = document.createElement('grw-app');
  app.setAttribute('app-width', appWidth);
  app.setAttribute('app-height', appHeight);
  app.setAttribute('api', api);
  app.setAttribute('languages', languages);
  inBbox && app.setAttribute('in-bbox', inBbox);
  cities && app.setAttribute('cities', cities);
  districts && app.setAttribute('districts', districts);
  structures && app.setAttribute('structures', structures);
  themes && app.setAttribute('themes', themes);
  portals && app.setAttribute('portals', portals);
  routes && app.setAttribute('routes', routes);
  practices && app.setAttribute('practices', practices);
  app.setAttribute('name-layer', nameLayer);
  app.setAttribute('url-layer', urlLayer);
  app.setAttribute('attribution-layer', attributionLayer);
  app.setAttribute('color-primary-app', colorPrimaryApp);
  app.setAttribute('color-on-primary', colorOnPrimary);
  app.setAttribute('color-surface', colorSurface);
  app.setAttribute('color-on-surface', colorOnSurface);
  app.setAttribute('color-surface-variant', colorSurfaceVariant);
  app.setAttribute('color-on-surface-variant', colorOnSurfaceVariant);
  app.setAttribute('color-primary-container', colorPrimaryContainer);
  app.setAttribute('color-on-primary-container', colorOnPrimaryContainer);
  app.setAttribute('color-secondary-container', colorSecondaryContainer);
  app.setAttribute('color-on-secondary-container', colorOnSecondaryContainer);
  app.setAttribute('color-background', colorBackground);
  app.setAttribute('color-surface-container-high', colorSurfaceContainerHigh);
  app.setAttribute('color-surface-container-low', colorSurfaceContainerLow);
  app.setAttribute('fab-background-color', fabBackgroundColor);
  app.setAttribute('fab-color', fabColor);
  app.setAttribute('color-trek-line', colorTrekLine);
  app.setAttribute('color-sensitive-area', colorSensitiveArea);
  app.setAttribute('use-gradient', useGradient);
  app.setAttribute('treks', treks);
  app.setAttribute('touristic-contents', touristicContents);
  app.setAttribute('touristic-events', touristicEvents);
  app.setAttribute('outdoor', outdoor);
  return app;
};
