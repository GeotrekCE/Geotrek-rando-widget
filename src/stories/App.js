export const createApp = ({
  api,
  language,
  inBbox,
  cities,
  districts,
  structures,
  themes,
  portals,
  routes,
  practices,
  urlLayer,
  attribution,
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
  colorDepartureIcon,
  colorArrivalIcon,
  colorSensitiveArea,
  colorPoiIcon,
  linkName,
  linkTarget,
}) => {
  const app = document.createElement('grw-app');
  app.setAttribute('api', api);
  app.setAttribute('language', language);
  inBbox && app.setAttribute('in-bbox', inBbox);
  cities && app.setAttribute('cities', cities);
  districts && app.setAttribute('districts', districts);
  structures && app.setAttribute('structures', structures);
  themes && app.setAttribute('themes', themes);
  portals && app.setAttribute('portals', portals);
  routes && app.setAttribute('routes', routes);
  practices && app.setAttribute('practices', practices);
  app.setAttribute('url-layer', urlLayer);
  app.setAttribute('attribution', attribution);
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
  app.setAttribute('color-departure-icon', colorDepartureIcon);
  app.setAttribute('color-arrival-icon', colorArrivalIcon);
  app.setAttribute('color-sensitive-area', colorSensitiveArea);
  app.setAttribute('color-poi-icon', colorPoiIcon);
  app.setAttribute('link-name', linkName);
  app.setAttribute('link-target', linkTarget);
  return app;
};
