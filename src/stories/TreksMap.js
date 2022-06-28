export const createTreksMap = ({ api, urlLayer, center, zoom, attribution, colorPrimary, colorPrimaryTint }) => {
  const container = document.createElement('div');
  container.style = 'height: 100%';
  const treks = document.createElement('grw-treks-provider');
  treks.setAttribute('api', api);
  container.appendChild(treks);
  const treksMap = document.createElement('grw-map');
  treksMap.setAttribute('url-layer', urlLayer);
  treksMap.setAttribute('center', center);
  treksMap.setAttribute('zoom', zoom);
  treksMap.setAttribute('attribution', attribution);
  treksMap.setAttribute('color-primary', colorPrimary);
  treksMap.setAttribute('color-primary-tint', colorPrimaryTint);
  container.appendChild(treksMap);
  return container;
};
