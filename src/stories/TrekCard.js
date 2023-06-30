export const createTrekCard = ({ api, language, trekId, colorPrimaryApp, colorOnSurface, colorSecondaryContainer, colorOnSecondaryContainer, colorSurfaceContainerLow }) => {
  const container = document.createElement('div');
  const trek = document.createElement('grw-trek-provider');
  trek.setAttribute('api', api);
  trek.setAttribute('language', language);
  trek.setAttribute('trek-id', trekId);
  container.appendChild(trek);
  const card = document.createElement('grw-trek-card');
  trek.setAttribute('color-primary', colorPrimaryApp);
  trek.setAttribute('color-on-surface', colorOnSurface);
  trek.setAttribute('color-secondary-container', colorSecondaryContainer);
  trek.setAttribute('color-on-secondary-container', colorOnSecondaryContainer);
  trek.setAttribute('color-surface-container-low', colorSurfaceContainerLow);
  container.appendChild(card);
  return container;
};
