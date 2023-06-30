export const createTrekDetail = ({
  api,
  language,
  trekId,
  colorPrimaryApp,
  colorOnSurface,
  colorPrimaryContainer,
  colorOnPrimaryContainer,
  colorSecondaryContainer,
  colorOnSecondaryContainer,
  colorBackground,
}) => {
  const container = document.createElement('div');
  const trek = document.createElement('grw-trek-provider');
  trek.setAttribute('api', api);
  trek.setAttribute('language', language);
  trek.setAttribute('trek-id', trekId);
  container.appendChild(trek);
  const detail = document.createElement('grw-trek-detail');
  trek.setAttribute('color-primary-app', colorPrimaryApp);
  trek.setAttribute('color-on-surface', colorOnSurface);
  trek.setAttribute('color-primary-container', colorPrimaryContainer);
  trek.setAttribute('color-on-primary-container', colorOnPrimaryContainer);
  trek.setAttribute('color-secondary-container', colorSecondaryContainer);
  trek.setAttribute('color-on-secondary-container', colorOnSecondaryContainer);
  trek.setAttribute('color-background', colorBackground);
  container.appendChild(detail);
  return container;
};
