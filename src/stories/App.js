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
  appName,
  urlLayer,
  attribution,
  colorPrimary,
  colorPrimaryShade,
  colorPrimaryTint,
  trekLineColor,
  departureIconColor,
  arrivalIconColor,
  sensitiveAreasColor,
}) => {
  const app = document.createElement('grw-app');
  app.setAttribute('api', api);
  app.setAttribute('language', language);
  app.setAttribute('in-bbox', inBbox);
  app.setAttribute('cities', cities);
  app.setAttribute('districts', districts);
  app.setAttribute('structures', structures);
  app.setAttribute('themes', themes);
  app.setAttribute('portals', portals);
  app.setAttribute('routes', routes);
  app.setAttribute('practices', practices);
  app.setAttribute('app-name', appName);
  app.setAttribute('url-layer', urlLayer);
  app.setAttribute('attribution', attribution);
  app.setAttribute('color-primary', colorPrimary);
  app.setAttribute('color-primary-shade', colorPrimaryShade);
  app.setAttribute('color-primary-tint', colorPrimaryTint);
  app.setAttribute('trek-line-color', trekLineColor);
  app.setAttribute('departure-icon-color', departureIconColor);
  app.setAttribute('arrival-icon-color', arrivalIconColor);
  app.setAttribute('sensitive-areas-color', sensitiveAreasColor);
  return app;
};
