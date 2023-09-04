export const createTreksMap = ({
  api,
  center,
  zoom,
  nameLayer,
  urlLayer,
  attributionLayer,
  colorPrimaryApp,
  colorOnSurface,
  colorPrimaryContainer,
  colorOnPrimaryContainer,
  colorBackground,
}) => {
  const container = document.createElement('div');
  container.style = 'height: 100%';
  const treks = document.createElement('grw-treks-provider');
  treks.setAttribute('api', api);
  container.appendChild(treks);
  const treksMap = document.createElement('grw-map');
  treksMap.setAttribute('center', center);
  treksMap.setAttribute('zoom', zoom);
  treksMap.setAttribute('name-layer', nameLayer);
  treksMap.setAttribute('url-layer', urlLayer);
  treksMap.setAttribute('attribution-layer', attributionLayer);
  treksMap.setAttribute('color-primary-app', colorPrimaryApp);
  treksMap.setAttribute('color-on-surface', colorOnSurface);
  treksMap.setAttribute('color-primary-container', colorPrimaryContainer);
  treksMap.setAttribute('color-on-primary-container', colorOnPrimaryContainer);
  treksMap.setAttribute('color-background', colorBackground);
  container.appendChild(treksMap);
  return container;
};
