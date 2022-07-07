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
  colorPrimary,
  colorPrimaryShade,
  colorPrimaryTint,
  colorTrekLine,
  colorDepartureIcon,
  colorArrivalIcon,
  colorSensitiveArea,
  colorPoiIcon,
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
  app.setAttribute('color-primary', colorPrimary);
  app.setAttribute('color-primary-shade', colorPrimaryShade);
  app.setAttribute('color-primary-tint', colorPrimaryTint);
  app.setAttribute('color-trek-line', colorTrekLine);
  app.setAttribute('color-departure-icon', colorDepartureIcon);
  app.setAttribute('color-arrival-icon', colorArrivalIcon);
  app.setAttribute('color-sensitive-area', colorSensitiveArea);
  app.setAttribute('color-poi-icon', colorPoiIcon);
  return app;
};
