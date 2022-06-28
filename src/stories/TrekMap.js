export const createTrekMap = ({ api, trekId, urlLayer, center, zoom, attribution, trekLineColor, departureIconColor, arrivalIconColor }) => {
  const container = document.createElement('div');
  container.style = 'height: 100%';
  const trek = document.createElement('grw-trek-provider');
  trek.setAttribute('api', api);
  trek.setAttribute('trek-id', trekId);
  container.appendChild(trek);
  const trekMap = document.createElement('grw-map');
  trekMap.setAttribute('url-layer', urlLayer);
  trekMap.setAttribute('center', center);
  trekMap.setAttribute('zoom', zoom);
  trekMap.setAttribute('attribution', attribution);
  trekMap.setAttribute('trek-line-color', trekLineColor);
  trekMap.setAttribute('departure-icon-color', departureIconColor);
  trekMap.setAttribute('arrival-icon-color', arrivalIconColor);
  container.appendChild(trekMap);
  return container;
};
