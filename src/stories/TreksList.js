export const createTreksList = ({
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
  colorPrimaryApp,
  colorOnSurface,
  colorSecondaryContainer,
  colorOnSecondaryContainer,
  colorSurfaceContainerLow,
}) => {
  const container = document.createElement('div');
  const treks = document.createElement('grw-treks-provider');
  treks.setAttribute('api', api);
  treks.setAttribute('languages', languages);
  inBbox && treks.setAttribute('in-bbox', inBbox);
  cities && treks.setAttribute('cities', cities);
  districts && treks.setAttribute('districts', districts);
  structures && treks.setAttribute('structures', structures);
  themes && treks.setAttribute('themes', themes);
  portals && treks.setAttribute('portals', portals);
  routes && treks.setAttribute('routes', routes);
  practices && treks.setAttribute('practices', practices);
  container.appendChild(treks);
  const list = document.createElement('grw-treks-list');
  list.setAttribute('color-primary', colorPrimaryApp);
  list.setAttribute('color-on-surface', colorOnSurface);
  list.setAttribute('color-secondary-container', colorSecondaryContainer);
  list.setAttribute('color-on-secondary-container', colorOnSecondaryContainer);
  list.setAttribute('color-surface-container-low', colorSurfaceContainerLow);
  container.appendChild(list);
  return container;
};
