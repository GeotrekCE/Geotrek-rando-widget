export const createTrekMap = ({
  api,
  trekId,
  urlLayer,
  center,
  zoom,
  attribution,
  colorPrimaryApp,
  colorOnSurface,
  colorPrimaryContainer,
  colorOnPrimaryContainer,
  colorBackground,
  colorTrekLine,
  colorDepartureIcon,
  colorArrivalIcon,
  colorSensitiveArea,
  colorPoiIcon,
  useGradient,
}) => {
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
  trekMap.setAttribute('color-primary-app', colorPrimaryApp);
  trekMap.setAttribute('color-on-surface', colorOnSurface);
  trekMap.setAttribute('color-primary-container', colorPrimaryContainer);
  trekMap.setAttribute('color-on-primary-container', colorOnPrimaryContainer);
  trekMap.setAttribute('color-background', colorBackground);
  trekMap.setAttribute('color-trek-line', colorTrekLine);
  trekMap.setAttribute('color-departure-icon', colorDepartureIcon);
  trekMap.setAttribute('color-arrival-icon', colorArrivalIcon);
  trekMap.setAttribute('color-sensitive-area', colorSensitiveArea);
  trekMap.setAttribute('color-poi-icon', colorPoiIcon);
  trekMap.setAttribute('use-gradient', useGradient);
  container.appendChild(trekMap);
  return container;
};
