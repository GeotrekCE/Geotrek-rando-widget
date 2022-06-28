export const createTreksList = ({ api, inBbox, cities, districts, structures, themes, portals, routes, practices, colorPrimary, colorPrimaryTint }) => {
  const container = document.createElement('div');
  const treks = document.createElement('grw-treks-provider');
  treks.setAttribute('api', api);
  treks.setAttribute('in-bbox', inBbox);
  treks.setAttribute('cities', cities);
  treks.setAttribute('districts', districts);
  treks.setAttribute('structures', structures);
  treks.setAttribute('themes', themes);
  treks.setAttribute('portals', portals);
  treks.setAttribute('routes', routes);
  treks.setAttribute('practices', practices);
  container.appendChild(treks);
  const list = document.createElement('grw-treks-list');
  list.setAttribute('color-primary', colorPrimary);
  list.setAttribute('color-primary-tint', colorPrimaryTint);
  container.appendChild(list);
  return container;
};
